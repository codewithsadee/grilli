package models

type Video struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Link     string `json:"url_link"`
	IsOnDash bool   `json:"is_on_dash"`
}
