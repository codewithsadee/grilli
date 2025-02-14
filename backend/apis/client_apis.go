package apis

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func ClientApis(r *gin.Engine, db *sql.DB) error {

	var err error

	http.HandleFunc("/videos", func(w http.ResponseWriter, r *http.Request) {

		http.ServeFile(w, r, "video_1.mp4")
	})

	return err
}
