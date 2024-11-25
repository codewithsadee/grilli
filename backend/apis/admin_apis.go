package apis

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func AdminApis(r *gin.Engine, db *sql.DB) error {

	var err error

	http.HandleFunc("/admin/login", func(w http.ResponseWriter, r *http.Request) {

		http.ServeFile(w, r, "login.html")
	})
	return err
}
