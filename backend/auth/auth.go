package auth

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"zikos/backend/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

const (
	// Bcrypt cost factor
	bcryptCost = 14

	// Token expiration time
	tokenExpiration = 24 * time.Hour
)

var (
	// Email validation regex
	emailRegex = regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
)

// GetSecretKey retrieves the JWT secret key from environment variable
func GetSecretKey() []byte {
	secretKey := os.Getenv("JWT_SECRET")
	if secretKey == "" {
		// Fallback to a default secret (only for development, never in production!)
		secretKey = "development_secret_key_please_set_env_variable"
		fmt.Println("WARNING: Using default secret key. Set JWT_SECRET environment variable!")
	}
	return []byte(secretKey)
}

// AuthMiddleware provides JWT authentication for routes
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		tokenString, err := c.Cookie("Authorization")
		if err != nil {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		if tokenString == "" {
			// Redirect unauthenticated users to login with the current path as the redirect target
			target := c.Request.URL.Path
			c.Redirect(http.StatusFound, fmt.Sprintf("/login?redirect=%s", target))
			c.Abort()
			return
		}

		// Remove "Bearer " prefix if present
		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return GetSecretKey(), nil
		})

		if err != nil || !token.Valid {
			// Redirect to login if the token is invalid
			target := c.Request.URL.Path
			c.Redirect(http.StatusFound, fmt.Sprintf("/login?redirect=%s", target))
			c.Abort()
			return
		}

		c.Next()
	}
}

// isValidEmail checks if the email matches the required format
func isValidEmail(email string) bool {
	return emailRegex.MatchString(email)
}

// VerifyPassword compares a plain text password with a hashed password
func VerifyPassword(password, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

// HashPassword generates a bcrypt hash of the password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

// Login handles user authentication
func Login(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var user models.User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid input",
			})
			return
		}

		// Validate email format
		if !isValidEmail(user.Email) {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid email format",
			})
			return
		}

		var hashedPassword, userID string
		var role int
		err := db.QueryRow(
			`SELECT id, first_name, last_name, password, role FROM users WHERE email = $1`,
			user.Email,
		).Scan(&userID, &user.FirstName, &user.LastName, &hashedPassword, &role)

		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid credentials",
			})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Database error",
			})
			return
		}

		// Verify password
		if err := VerifyPassword(user.Password, hashedPassword); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid credentials",
			})
			return
		}

		// Generate JWT
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"userID": userID,
			"email":  user.Email,
			"role":   role,
			"exp":    time.Now().Add(tokenExpiration).Unix(),
		})

		tokenString, err := token.SignedString(GetSecretKey())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to generate token",
			})
			return
		}

		c.SetCookie("Authorization", "Bearer "+tokenString, int(tokenExpiration.Seconds()), "/", "", false, true)

		redirect := c.DefaultQuery("redirect", "/dashboard_index")
		c.JSON(http.StatusOK, gin.H{
			"token":    tokenString,
			"userID":   userID,
			"role":     role,
			"username": user.FirstName + " " + user.LastName,
			"message":  "Login successful",
			"redirect": redirect,
		})

	}
}

// Register handles user registration
func Register(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var user models.User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid input",
				"details": err.Error(),
			})
			return
		}

		// Trim and normalize email
		user.Email = strings.TrimSpace(strings.ToLower(user.Email))

		// Comprehensive email validation
		emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`)
		if !emailRegex.MatchString(user.Email) {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid email format",
			})
			return
		}

		// Validate password strength
		if len(user.Password) < 8 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Password must be at least 8 characters long",
			})
			return
		}

		// Check if user already exists
		var exists bool
		err := db.QueryRow(
			"SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
			user.Email,
		).Scan(&exists)
		if err != nil {
			log.Printf("Database exists check error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Database error",
			})
			return
		}
		if exists {
			c.JSON(http.StatusConflict, gin.H{
				"error": "User with this email already exists",
			})
			return
		}

		// Hash password
		hashedPassword, err := HashPassword(user.Password)
		if err != nil {
			log.Printf("Password hashing error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to secure password",
			})
			return
		}

		// Default role (adjust as needed)
		defaultRole := 2 // Assuming 1 is admin, 2 is regular user

		// Start a transaction
		tx, err := db.Begin()
		if err != nil {
			log.Printf("Transaction start error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Internal server error",
			})
			return
		}
		defer tx.Rollback() // Rollback in case of any error

		// Insert new user and retrieve ID
		var userID int
		err = tx.QueryRow(
			`INSERT INTO users 
				(first_name, last_name, email, password, role) 
			VALUES 
				($1, $2, $3, $4, $5) 
			RETURNING id`,
			user.FirstName,
			user.LastName,
			user.Email,
			hashedPassword,
			defaultRole,
		).Scan(&userID)

		if err != nil {
			log.Printf("User insertion error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to create user",
			})
			return
		}

		// Commit the transaction
		if err := tx.Commit(); err != nil {
			log.Printf("Transaction commit error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to complete registration",
			})
			return
		}

		// Log user registration (optional)
		go func() {
			log.Printf("New user registered: ID %d, Email %s", userID, user.Email)
		}()

		// Respond with user details (excluding sensitive information)
		c.JSON(http.StatusCreated, gin.H{
			"message":   "User created successfully",
			"userID":    userID,
			"firstName": user.FirstName,
			"email":     user.Email,
		})
	}
}
