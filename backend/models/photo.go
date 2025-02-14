package models

type Photo struct {
	Id          int    `json:"id"`
	Url         string `json:"url_link"`
	IsOnHome    bool   `json:"is_on_dash"`
	PictureName string `json:"picture_name"`
}
