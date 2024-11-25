import { getEvents } from "./event_manager_controller.js";
import { getVideos } from "./video_manager_controller.js";


document.addEventListener('DOMContentLoaded', async () => {
    const video_list = document.getElementById("video_list");
    const video_player = document.getElementById("video_player");
    const upcoming_events = document.getElementById("upcoming_events");

    video_player.src = "/video/1"; // Load the first video

    try {
        // Fetch videos and events
        const [data, error] = await getVideos();
        const [eventData, error2] = await getEvents();

        // Handle errors
        if (error) throw new Error(`Video Fetch Error: ${error}`);
        if (error2) throw new Error(`Event Fetch Error: ${error2}`);

        // Process events
        if (!eventData.events || eventData.events.length === 0) {
            console.warn("No events available");
        } else {
            console.log("Event Data:", eventData.events);
            eventData.events.forEach((value) => {
                console.log("Event:", value);

                const listItem = document.createElement("div");
                listItem.classList.add(
                    "flex",
                    "flex-col",
                    "gap-2",
                    "bg-white",
                    "dark:bg-black",

                    "p-2",
                    "rounded-lg",
                    "shadow-md",
                    "h-[400px]"
                );
                listItem.innerHTML = `
                    <img src="./static/images/menu-1.png" alt="${value.event_name}" class="w-full h-[300px] object-cover">    
                    <div class="flex flex-col gap-2">
                      <h2 class="text-2xl font-semibold">${value.event_name || 'Untitled Event'}</h2>
                      <p class="text-sm">${value.event_description || 'No description available.'}</p>
                    </div>`;
                upcoming_events.appendChild(listItem);
            });
        }

        // Process videos
        Object.entries(data.videos).forEach(([key, value]) => {
            const listItem = document.createElement("li");
            listItem.id = value.id;
            listItem.classList.add(
                "flex",
                "items-center",
                "space-x-3",
                "bg-white",
                "p-2",
                "rounded-lg",
                "shadow-md",
                "h-[200px]"
            );
            listItem.innerHTML = `
                <img class="w-16 h-9 object-cover" src="${value.thumbnail || 'thumbnail1.jpg'}" alt="Video Thumbnail">
                <div>
                    <h3 class="text-lg text-black">${value.name}</h3>
                    <p class="text-sm text-gray-500">${value.description || 'No description available.'}</p>
                </div>`;
            listItem.addEventListener("click", () => {
                video_player.src = `/video/${value.id}`;
            });
            video_list.appendChild(listItem);
        });
    } catch (err) {
        console.error("Error during data fetch or processing:", err.message);
    }
});
