CREATE TABLE IF NOT EXISTS landing_videos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url_link VARCHAR(255) NOT NULL,
    is_on_dash BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(50) NOT NULL,
    event_description VARCHAR(255) NOT NULL,
    date_of_event DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS pictures (
    id SERIAL PRIMARY KEY,
    url_link VARCHAR(255) NOT NULL, -- Increased to 255 for longer URLs
    is_on_dash BOOLEAN,
    picture_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role INT NOT NULL -- Removed trailing comma
);

