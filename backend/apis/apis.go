package apis

import (
	"database/sql"
	"log"
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
	dbname := "TashFash"

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

	r.LoadHTMLFiles("./frontend/pages/admin/dashboard/video_manager.html", "./frontend/pages/client/Landing.html",
		"./frontend/pages/admin/dashboard/login.html", "./frontend/pages/admin/dashboard/event_manager.html",
		"./frontend/pages/admin/dashboard/dashboard_index.html",
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
	r.GET("/video_manager", func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "video_manager.html", nil)
	})

	r.GET("/dashboard_index", func(ctx *gin.Context) {

		ctx.HTML(http.StatusOK, "dashboard_index.html", nil)
	})

	r.GET("/event_manager", func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "event_manager.html", nil)
	})

	r.POST("/register", auth.Register(db))
	r.POST("/login", auth.Login(db))

	r.GET("/events", getEvents)
	r.PATCH("/events", updateEvent)
	r.POST("/events", createEvent)
	r.DELETE("/events/:id", deleteEvent)
	r.GET("/getLandingPageVideos", getLandingPageVideos)

	r.POST("/uploadVideo", uploadVideo)

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
		err := rows.Scan(&video.Id, &video.Name, &video.Link, &video.IsOnDash)
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

	formData, err := c.FormFile("video")

	// The file cannot be received.
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "No file is received",
		})
		return
	}

	directory, err := os.Getwd()
	if err != nil {

		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
	}

	// file, err := formData.Open()
	video_directory := fmt.Sprintf("%s/videos/%s", directory, formData.Filename)

	fmt.Print(video_directory)

	if err := c.SaveUploadedFile(formData, video_directory); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to save the file",
		})
		return
	}
	filename := formData.Filename

	_, err2 := db.Exec("INSERT INTO landing_videos (name, url_link, is_on_dash) VALUES ($1, $2, $3)", filename, video_directory, true)

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
