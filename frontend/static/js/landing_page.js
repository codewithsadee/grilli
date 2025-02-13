import { getEvents } from "./event_manager_controller.js";
import { getVideos } from "./video_manager_controller.js";
import { getPictures } from "./picture_manager_controller.js";

document.addEventListener('DOMContentLoaded', async () => {
    const video_list = document.getElementById("video-list");
    const pictures_loading = document.getElementById("pictures_loading");
    const picture_section = document.getElementById("pictures");
    const video_player = document.getElementById("videos");
    let video_player_true = document.getElementById("videoplayer");
    const upcoming_events = document.getElementById("events");
    const pictureGrid = document.getElementById("pictureGrid");
    const events_loading = document.getElementById("events_loading")

    pictures_loading.classList.remove("hidden");
    events_loading.classList.remove("hidden");
    upcoming_events.classList.add("hidden")
    picture_section.classList.add("hidden");
    // Load the first video

    try {
        // Fetch videos, events, and pictures concurrently
        const [[data, error], [eventData, error2], [images, error3]] = await Promise.all([
            getVideos(),
            getEvents(),
            getPictures()
        ]);

        // Handle errors from API responses
        if (error) throw new Error(`Video Fetch Error: ${error}`);
        if (error2) throw new Error(`Event Fetch Error: ${error2}`);
        if (error3) throw new Error(`Image Fetch Error: ${error3}`);

        // Process events
        if (!eventData.events || eventData.events.length === 0) {
            console.warn("No events available");
            upcoming_events.classList.remove("grid", "grid-cols-1", "sm:grid-cols-2" ,"md:grid-cols-3" ,"gap-3" )
            upcoming_events.classList.add("text-white","text-center", "text-xl")
            upcoming_events.innerText = 'Check again later for Events';
            events_loading.classList.add("hidden");
        } else {
            events_loading.classList.add("hidden");
            upcoming_events.classList.remove("hidden")
            console.log("Event Data:", eventData.events);
            eventData.events.forEach((value) => {
                console.log("Event:", value);

                const listItem = document.createElement("div");
                listItem.classList.add("event-list-item");

                listItem.innerHTML = `
                    <span class="flex flex-row gap-3 text-white event-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chef-hat mb-4 h-8 w-8 text-primary">
                            <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"></path>
                            <path d="M6 17h12"></path>
                        </svg>

                        <p class="pt-1 text-2xl event-title font-bold">
                           ${value.event_name || 'Untitled Event'}
                        </p>
                    </span>

                    <div class="p-2 gap-3 flex flex-col text-white h-full">
                        <p class="text-xl font-semibold">
                            Date: 14th June 2024
                        </p>
                        <p class="text-lg">
                            ${value.event_description || 'Untitled Event'}
                        </p>
                    </div>`;

                upcoming_events.appendChild(listItem);
            });
        }

        // Process videos
        if (!data.videos || data.videos.length === 0) {
            console.warn("No videos available");
            video_list.classList.add("text-white")
            video_list.innerText = 'Check again later for Videos';
        } else {
            console.log("Video Data:", data.videos);
            video_player_true.src = `/video/${data.videos[0]["id"]}`;

            Object.entries(data.videos).forEach(([key, value]) => {
                const listItem = document.createElement("div");
                listItem.id = value.id;
                listItem.classList.add("list-view-item");
                listItem.innerHTML = `
                    <img class="box-aspect object-cover" src="${value.thumbnail || 'thumbnail1.jpg'}" alt="Video Thumbnail">
                    <p class="text-sm text-center p-4 text-white">${value.name || 'No description available.'}</p>`;
                listItem.addEventListener("click", () => {
                    alert("clicked");
                    video_player_true.src = `/video/${value.id}`;
                });
                video_list.appendChild(listItem);
            });
        }

        // Process pictures
        if (!images.pictures || images.pictures.length === 0) {
            console.warn("No pictures available");
            pictures_loading.classList.add("hidden");
            picture_section.classList.remove("hidden");
            pictureGrid.innerText = 'Check again later for Pictures';
        } else {
            pictures_loading.classList.add("hidden");
            picture_section.classList.remove("hidden");
            console.log("Picture Data:", images.pictures);
            Object.entries(images.pictures).forEach(([key, value]) => {
                const image = document.createElement("img");
                image.src = value.url_link;

                if (key == 0 || key == 3 || key == 6) {
                    image.classList.add("pic-span-2");
                }

                pictureGrid.append(image);
            });
        }
    } catch (err) {
        console.error("Error during data fetch or processing:", err.message);
    }
});
