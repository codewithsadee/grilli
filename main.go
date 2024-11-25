package main

import (
	"fmt"
	"os"
	"zikos/backend/apis"

	_ "github.com/lib/pq"
)

func main() {

	err := apis.StartServer(5500)

	if err != nil {
		os.Exit(1)
		fmt.Println(err)
	}
}
