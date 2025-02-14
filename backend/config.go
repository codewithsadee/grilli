package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// LoadEnvironmentVariables loads environment variables from .env file
func LoadEnvironmentVariables() {
	// Check if we're in production
	if os.Getenv("APP_ENV") != "production" {
		// Load .env file
		if err := godotenv.Load(); err != nil {
			log.Println("No .env file found")
		}
	}
}

// GetEnvOrDefault returns the environment variable value or a default
func GetEnvOrDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
