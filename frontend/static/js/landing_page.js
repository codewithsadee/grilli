import { getEvents } from "./event_manager_controller.js";
import { getVideos } from "./video_manager_controller.js";
import {getPictures} from "./picture_manager_controller.js";

document.addEventListener('DOMContentLoaded', async () => {

    const username = document.getElementById('username');
    username.innerText = localStorage.getItem('userName'); 
    
    const video_list = document.getElementById("video-list");
    const video_player = document.getElementById("videos");
    let video_player_true = document.getElementById("videoplayer")
    const upcoming_events = document.getElementById("events");
    const pictureGrid = document.getElementById("pictureGrid");

   // Load the first video

    try {
        
        // Fetch videos and events
      

        const [[data, error] , [eventData, error2], [images, error3]] = await Promise.all([
         
            getVideos(),
            getEvents(),
            getPictures()
        ])

        // Handle errors
        if (error) throw new Error(`Video Fetch Error: ${error}`);
        if (error2) throw new Error(`Event Fetch Error: ${error2}`);
        if (error3) throw new Error(`Image Fetch Error: ${error3}`);

        // Process events
        if (!eventData.events || eventData.events.length === 0) {
            console.warn("No events available");
            const event_message = document.createElement('p')
            pictureGrid.innerText =' Check again later for Events'
        } else {
            console.log("Event Data:", eventData.events);
            eventData.events.forEach((value) => {
                console.log("Event:", value);

                const listItem = document.createElement("div");
                listItem.classList.add(
                  "event-list-item"

                );

                listItem.innerHTML = `  <span class="flex flex-row gap-3 text-white event-title ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-chef-hat mb-4 h-8 w-8 text-primary">
                        <path
                            d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z">

                        </path>
                        <path d="M6 17h12"></path>
                    </svg>

                    <p class="pt-1 text-2xl event-title font-bold">
                       ${value.event_name || 'Untitled Event'}
                    </p>

                   


                </span>

                <div  class="p-2 gap-3 flex flex-col text-white h-full  ">
                    <p class="text-xl font-semibold">
                        Date : 14th June 2024
                    </p>
                    <p class="text-lg ">
                        ${value.event_description || 'Untitled Event'}
                        
                    </p>
    
                </div>`
             
                upcoming_events.appendChild(listItem);
            });
        }
        

        video_player_true.src = `/video/${data.videos[0]["id"]}`
        console.log(data.videos)

        // Process videos
        Object.entries(data.videos).forEach(([key, value]) => {
            const listItem = document.createElement("div");
            listItem.id = value.id;
            listItem.classList.add(
               "list-view-item"
            );
            listItem.innerHTML = `
                <img class="box-aspect object-cover" src="${value.thumbnail || 'thumbnail1.jpg'}" alt="Video Thumbnail">
                <p class="text-sm text-gray-500">${value.name || 'No description available.'}</p>
                `;
            listItem.addEventListener("click", () => {
                alert("clicked")
                video_player_true.src = `/video/${value.id}`;
            });
            video_list.appendChild(listItem);
        });

        Object.entries(images.pictures).forEach(([key, value]) => {
            
            const image = document.createElement("img");
            image.src = value.url_link;
            if(key == 0){

                image.classList.add(
                    "pic-span-2"
                )
                
            }else if(key  == 3){

                image.classList.add(
                    "pic-span-2"
                )
            }else if(key == 6) {
                image.classList.add(
                    "pic-span-2"
                )
            }else{

            }

            pictureGrid.append(image);
        })
    } catch (err) {
        console.error("Error during data fetch or processing:", err.message);
    }
});
