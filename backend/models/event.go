package models

type EventResponse struct {
	Id               int    `json:"id"`
	EventName        string `json:"event_name"`
	EventDescription string `json:"event_description"`
	DateOfEvent      string `json:"date_of_event"`
}

type EventRequest struct {
	EventName        string `json:"event_name"`
	EventDescription string `json:"event_description"`
	DateOfEvent      string `json:"date_of_event"`
}
