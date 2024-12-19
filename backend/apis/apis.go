package apis

import (
	"database/sql"
	"log"
	"runtime"
	"strconv"
	"zikos/backend/auth"
	"zikos/backend/models"

	"fmt"

	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var db *sql.DB

func StartServer(dbportNumber int) error {

	var err error
	host := "localhost"
	port := dbportNumber
	user := "postgres"
	password := "1590"
	dbname := "zikos"

	conn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)
	db, err = sql.Open("postgres", conn)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}
	fmt.Println("Connected To DB")

	r := gin.Default()

	r.Static("/static", "./frontend/static")
	r.Static("/thumbnails", "./thumbnails")

	r.LoadHTMLFiles("./frontend/pages/admin/dashboard/picture_manager.html", "./frontend/pages/admin/dashboard/video_manager.html", "./frontend/pages/client/Landing.html",
		"./frontend/pages/admin/dashboard/login.html", "./frontend/pages/admin/dashboard/event_manager.html",
		"./frontend/pages/admin/dashboard/dashboard_index.html", "./frontend/pages/admin/dashboard/profile_manager.html",
	)

	http.HandleFunc("/admin/login", func(w http.ResponseWriter, r *http.Request) {

		http.ServeFile(w, r, "login.html")
	})

	r.GET("/login", func(c *gin.Context) {

		c.HTML(http.StatusOK, "login.html", nil)
	})
	r.GET("/", func(c *gin.Context) {

		c.HTML(http.StatusOK, "Landing.html", nil)
	})

	r.GET("/getVideos", getVideos)

	r.GET("/video/:id", StreamVideoHandler)
	r.DELETE("/video/:id", deleteVideo)
	r.GET("/video_manager", auth.AuthMiddleware(), func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "video_manager.html", nil)
	})
	r.GET("/picture_manager", auth.AuthMiddleware(), func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "picture_manager.html", nil)
	})

	r.GET("/profile_manager", auth.AuthMiddleware(), func(ctx *gin.Context) {

		ctx.HTML(http.StatusOK, "profile_manager.html", nil)
	})

	r.GET("/dashboard_index", auth.AuthMiddleware(), func(ctx *gin.Context) {

		ctx.HTML(http.StatusOK, "dashboard_index.html", nil)
	})

	r.GET("/event_manager", auth.AuthMiddleware(), func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "event_manager.html", nil)
	})

	r.POST("/register", auth.Register(db))
	r.POST("/login", auth.Login(db), func(ctx *gin.Context) {

	})

	r.GET("/events", getEvents)
	r.PATCH("/events", updateEvent)
	r.POST("/events", createEvent)
	r.DELETE("/events/:id", deleteEvent)
	r.POST("/userDetails/:id", getUserDetails)
	r.POST("/updateProfile", updateProfile)

	r.POST("/updatePassword", updatePassword)
	r.GET("/pictures", getPictures)

	r.POST("/pictures", addPicture)
	r.DELETE("/pictures/:id", deletePicture)
	r.GET("/getLandingPageVideos", getLandingPageVideos)

	r.POST("/uploadVideo", uploadVideo)

	r.POST("/logout", logoutUser)
	return http.ListenAndServe(":8080", r)

}

func getVideos(c *gin.Context) {
	// Execute the query
	rows, err := db.Query(`SELECT * FROM landing_videos`)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var videos []models.Video

	// Loop through rows
	for rows.Next() {
		var video models.Video

		// Scan each row
		err := rows.Scan(&video.Id, &video.Name, &video.Link, &video.IsOnDash, &video.Thumbnail)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		videos = append(videos, video)
	}

	// Check for errors encountered during row iteration
	if err = rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Send the response if no errors occurred
	c.JSON(http.StatusOK, gin.H{
		"videos": videos,
	})
}

func uploadVideo(c *gin.Context) {

	imageTitle := c.PostForm("videoName")
	formData, err := c.FormFile("video")

	if err != nil {
		fmt.Println(err)
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "No file is received",
		})
		return
	}
	thumbnanil, err := c.FormFile("thumbnail")

	// The file cannot be received.
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "No file is received",
		})
		return
	}

	directory, err := os.Getwd()
	if err != nil {

		fmt.Println(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
	}

	// file, err := formData.Open()
	os := runtime.GOOS

	var video_directory string
	var image_directory string
	var db_path string

	switch os {
	case "windows":

		video_directory = fmt.Sprintf("%s\\videos\\%s", directory, formData.Filename)
		image_directory = fmt.Sprintf("%s\\thumbnails\\%s", directory, thumbnanil.Filename)
		db_path = fmt.Sprintf("\\thumbnails\\%s", thumbnanil.Filename)
	case "linux":
		video_directory = fmt.Sprintf("%s/videos/%s", directory, formData.Filename)
		image_directory = fmt.Sprintf("%s/thumbnails/%s", directory, thumbnanil.Filename)
		db_path = fmt.Sprintf("/thumbnails/%s", thumbnanil.Filename)

	}

	fmt.Println("video_directory", video_directory)
	fmt.Println("image_directory", image_directory)
	fmt.Print("os", os)

	if err := c.SaveUploadedFile(formData, video_directory); err != nil {
		fmt.Println(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to save the video",
		})
		return
	}
	if err := c.SaveUploadedFile(thumbnanil, image_directory); err != nil {
		fmt.Println(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{

			"message": "Unable to save the image",
		})
		return
	}

	_, err2 := db.Exec("INSERT INTO landing_videos (name, url_link,thumbnail, is_on_dash) VALUES ($1, $2, $3, $4)", imageTitle, video_directory, db_path, true)

	if err2 != nil {

		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"message": err2.Error(),
		})
	}
	// File saved successfully. Return proper result
	c.JSON(http.StatusOK, gin.H{
		"message": "Your file has been successfully uploaded.",
	})

}

func getLandingPageVideos(c *gin.Context) {

	rows, err := db.Query(`SELECT * FROM landing_videos`)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var videos []models.Video

	// Loop through rows
	for rows.Next() {
		var video models.Video

		// Scan each row
		err := rows.Scan(&video.Id, &video.Name, &video.Link, &video.IsOnDash)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		videos = append(videos, video)
	}

	//Create a video stream for each videofile using its link

	c.JSON(http.StatusOK, gin.H{
		"videos": videos,
	})
}

// Streaming handler for videos
func StreamVideoHandler(c *gin.Context) {
	// Parse the video ID from the URL
	videoID, err := strconv.Atoi(c.Param("id"))
	fmt.Println(videoID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid video ID"})
		return
	}

	// Fetch video metadata from the database
	video, err := getVideoByID(videoID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
		return
	}

	// Serve the video file using the path from the database
	c.File(video.Link)
}

func getVideoByID(id int) (*models.Video, error) {
	var video models.Video
	row := db.QueryRow(`SELECT id, name, url_link FROM landing_videos WHERE id = $1`, id)
	if err := row.Scan(&video.Id, &video.Name, &video.Link); err != nil {
		return nil, err
	}
	fmt.Println(video.Link)
	return &video, nil
}

func getEvents(c *gin.Context) {

	rows, err := db.Query("SELECT * FROM events")

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"failed to query database": err.Error(),
		})
	}

	defer rows.Close()

	var events []models.EventResponse
	for rows.Next() {

		var event models.EventResponse

		if err := rows.Scan(&event.Id, &event.EventName, &event.EventDescription, &event.DateOfEvent); err != nil {

			c.JSON(500, gin.H{
				"Failed to Scan Database Rows": err.Error(),
			})
		}

		events = append(events, event)

	}
	c.JSON(200, gin.H{
		"events": events,
	})

}

func deleteEvent(c *gin.Context) {

	event_id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		log.Fatal("Failed to Parse Paramerter, or parameter is empty")
		c.JSON(500, gin.H{
			"failed to parse parameter": err.Error(),
		})

	}

	_, err = db.Exec("DELETE FROM events where id = $1", event_id)

	if err != nil {
		log.Fatal("Failed to Delete Event, or parameter is empty")
		c.JSON(500, gin.H{
			"failed to Delete Event": err.Error(),
		})

	}
	fmt.Println("event successfully deleted")

	c.JSON(200, gin.H{
		"message": "event successfully deleted",
	})

}

func updateEvent(c *gin.Context) {

	var event models.EventResponse
	c.BindJSON(&event)

	_, err := db.Exec(`UPDATE TABLE events
	SET event_name = $1,event_description = $2, date-of_event = $3 
	WHERE id = $4
	`, &event.EventName, &event.EventDescription, &event.DateOfEvent, &event.Id)

	if err != nil {
		log.Fatal("Failed to Update Event, or parameter is empty")
		c.JSON(500, gin.H{
			"failed to Update Event": err.Error(),
		})

	}

	c.JSON(200, gin.H{
		"message": "event successfully Updated",
	})

}

func createEvent(c *gin.Context) {
	var event models.EventRequest

	// Bind JSON input to the event struct
	if err := c.BindJSON(&event); err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"error": "Invalid JSON input",
		})
		return
	}

	// Validate the fields
	if event.EventName == "" || event.EventDescription == "" || event.DateOfEvent == "" {

		c.JSON(400, gin.H{
			"error": "All fields (event_name, event_description, date_of_event) are required",
		})
		return
	}

	// Insert into the database
	_, err := db.Exec(
		`INSERT INTO events (event_name, event_description, date_of_event) VALUES ($1, $2, $3)`,
		event.EventName, event.EventDescription, event.DateOfEvent,
	)

	// Handle database errors
	if err != nil {
		c.JSON(500, gin.H{
			"error":   "Failed to add event",
			"details": err.Error(),
		})
		return
	}

	// Success response
	c.JSON(200, gin.H{
		"message": "Event successfully added",
	})
}

func deleteVideo(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))
	link := c.Query("link")

	fmt.Println(link)
	if err != nil {

		c.JSON(500, gin.H{
			"failed to parse parameter": err.Error(),
		})
	}

	err = os.Remove(link)
	if err != nil {

		c.JSON(500, gin.H{
			"failed to Delete Video": err.Error(),
		})
	}
	_, err = db.Exec("DELETE FROM landing_videos where id = $1", id)

	if err != nil {

		c.JSON(500, gin.H{
			"failed to delete Video from db": err.Error(),
		})
	}

	c.JSON(200, gin.H{
		"message": "Video successfully deleted",
	})

}

func getPictures(c *gin.Context) {

	rows, err := db.Query(`SELECT * FROM pictures`)

	if err != nil {
		fmt.Println(err)
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
	}
	defer rows.Close()

	var pictures []models.Photo
	for rows.Next() {
		var picture models.Photo

		if err = rows.Scan(&picture.Id, &picture.Url, &picture.IsOnHome, &picture.PictureName); err != nil {

			c.JSON(500, gin.H{
				"error": err.Error(),
			})
		}

		pictures = append(pictures, picture)

	}

	c.JSON(200, gin.H{
		"pictures": pictures,
	})

}

func addPicture(c *gin.Context) {

	picture, err := c.FormFile("image")

	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
	}
	directory, err := os.Getwd()

	os := runtime.GOOS
	if err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
	}
	picture_name := picture.Filename

	var db_path string
	var image_directory string

	switch os {
	case "windows":

		image_directory = fmt.Sprintf(`%s\frontend\static\images\%s`, directory, picture_name)
		db_path = fmt.Sprintf(`\static\images\%s`, picture_name)
	case "linux":

		image_directory = fmt.Sprintf("%s/frontend/static/images/%s", directory, picture_name)
		db_path = fmt.Sprintf("/static/images/%s", picture_name)

	}

	err = c.SaveUploadedFile(picture, image_directory)

	if err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
	}

	_, err = db.Exec("INSERT INTO pictures (url_link, is_on_dash, picture_name) VALUES ($1, $2, $3)", db_path, false, picture_name)

	if err != nil {

		c.JSON(500, gin.H{
			"error": err.Error(),
		})
	}

	c.JSON(200, gin.H{
		"message": "Picture successfully added",
	})
}

func deletePicture(c *gin.Context) {
	// Parse the ID from the URL parameter
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid picture ID"})
		return
	}

	// Query the database for the picture name
	var pictureName string
	row := db.QueryRow("SELECT picture_name FROM pictures WHERE id = $1", id)
	if err := row.Scan(&pictureName); err != nil {
		c.JSON(404, gin.H{"error": "Picture not found"})
		return
	}

	// Determine the file path based on OS
	directory, err := os.Getwd()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to determine working directory"})
		return
	}

	var imageDirectory string
	switch runtime.GOOS {
	case "windows":
		imageDirectory = fmt.Sprintf("%s\\frontend\\static\\images\\%s", directory, pictureName)
	case "linux":
		imageDirectory = fmt.Sprintf("%s/frontend/static/images/%s", directory, pictureName)
	default:
		c.JSON(500, gin.H{"error": "Unsupported operating system"})
		return
	}

	// Delete the file
	if err := os.Remove(imageDirectory); err != nil && !os.IsNotExist(err) {
		c.JSON(500, gin.H{"error": "Failed to delete picture file"})
		return
	}

	// Delete the database entry
	_, err = db.Exec("DELETE FROM pictures WHERE id = $1", id)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete picture record from database"})
		return
	}

	// Success response
	c.JSON(200, gin.H{"message": "Picture successfully deleted"})
}

func logoutUser(c *gin.Context) {

	// Clear specific cookies
	c.SetCookie("Authorization", "", -1, "/", "", false, true)

	c.JSON(200, gin.H{
		"message": "User successfully logged out",
	})
}

func getUserDetails(c *gin.Context) {

	var userId int
	var err error
	userId, err = strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(400, gin.H{
			"error": "invalid user id",
		})
		return
	}

	var user models.User
	rows := db.QueryRow(`SELECT id, first_name, last_name, email, role FROM users WHERE id = $1`, userId)

	if err = rows.Scan(&user.Id, &user.FirstName, &user.LastName, &user.Email, &user.Role); err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})

	}
	switch {
	case err == sql.ErrNoRows:
		c.JSON(404, gin.H{
			"error": "user not found",
		})
		return

	case err != nil:
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
		return

	}
	user.Password = ""

	c.JSON(200, gin.H{
		"user": user,
	})
}

func updateProfile(c *gin.Context) {

	var user models.User

	// Bind JSON input to the user struct
	if err := c.BindJSON(&user); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid JSON input",
		})
		return
	}

	// Update user details in the database
	_, err := db.Exec(
		`UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4`,
		user.FirstName, user.LastName, user.Email, user.Id)
	if err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "User details successfully updated",
	})

}

func updatePassword(c *gin.Context) {
	// Request struct with validation tags
	type UpdatePasswordRequest struct {
		Id          int    `json:"id" binding:"required,min=1"`
		OldPassword string `json:"old_password" binding:"required,min=8,max=72"`
		NewPassword string `json:"new_password" binding:"required,min=8,max=72"`
	}

	var updatePasswordRequest UpdatePasswordRequest

	// Validate JSON input with detailed error handling
	if err := c.ShouldBindJSON(&updatePasswordRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid input",
			"details": err.Error(),
		})
		return
	}

	// Prevent password reuse
	if updatePasswordRequest.OldPassword == updatePasswordRequest.NewPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "New password must be different from the old password",
		})
		return
	}

	// Retrieve current password from database
	var currentHashedPassword string
	err := db.QueryRow(
		`SELECT password FROM users WHERE id = $1`,
		updatePasswordRequest.Id,
	).Scan(&currentHashedPassword)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "User not found",
			})
		} else {
			log.Printf("Database error retrieving user: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Internal server error",
			})
		}
		return
	}

	// Verify current password
	if err := auth.VerifyPassword(updatePasswordRequest.OldPassword, currentHashedPassword); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid current password",
		})
		return
	}

	// Hash new password before storing
	hashedNewPassword, err := auth.HashPassword(updatePasswordRequest.NewPassword)
	if err != nil {
		log.Printf("Password hashing error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to process new password",
		})
		return
	}

	// Update password in database with transaction
	tx, err := db.Begin()
	if err != nil {
		log.Printf("Transaction start error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Internal server error",
		})
		return
	}
	defer tx.Rollback() // Rollback in case of any error

	_, err = tx.Exec(
		`UPDATE users SET 
			password = $1, 
			last_password_change = CURRENT_TIMESTAMP 
		WHERE id = $2`,
		hashedNewPassword,
		updatePasswordRequest.Id,
	)
	if err != nil {
		log.Printf("Password update error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update password",
		})
		return
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		log.Printf("Transaction commit error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to complete password update",
		})
		return
	}

	// Log password change event (optional but recommended)
	go func() {
		log.Printf("Password changed for user ID: %d", updatePasswordRequest.Id)
	}()

	c.JSON(http.StatusOK, gin.H{
		"message": "Password successfully updated",
	})
}
