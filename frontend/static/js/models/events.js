class Event {



    constructor(id, name, description, date, time, location, image, category, user_id) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.date = date;
        this.time = time;
        this.location = location;
        this.image = image;
        this.category = category;
        this.user_id = user_id;
    }

    // Getters [Somethind]
    getId() {
        return this.id;
    }


}
const ev = new Event(1, "name", "description", "date", "time", "location", "image", "category", 1);
ev.getId(); // 1
