import { deleteEvents } from "./event_manager_controller.js";
import { deleteVideo, getVideos, UploadVideo } from "./video_manager_controller.js";


function playVideo() {
    alert('Clicked');
  }
document.addEventListener('DOMContentLoaded', async () => {

    


    let thumbnail;
    let file;
    const loadingComponent = document.getElementById("loadingComponent")
    const uploadButton = document.getElementById("uploadButton")
    const closeButton = document.getElementById("closeButton")
    const video_upload = document.getElementById("addVideoComponentLoading")
    const table_body = document.getElementById("table_body")
    const addVideo = document.getElementById("addVideo")
    const progressBarFill = document.getElementById("progressBarFill")
    loadingComponent.classList.remove("hidden");

    const totalvideos = document.getElementById("total_videos")
    
    document.getElementById("file_input").addEventListener("change", (event) => {
        file = event.target.files[0];
        console.log(file)
    })
    document.getElementById('thumbnailInput').addEventListener('change', function (event) {
        thumbnail = event.target.files[0];
        console.log(thumbnail)
        const preview = document.getElementById('thumbnailPreview');

        if(thumbnail){
            preview.src = URL.createObjectURL(thumbnail);
            preview.classList.remove("hidden");
            preview.onload = function () {
                URL.revokeObjectURL(preview.src);
            }
        }else{
            preview.src = '';
            preview.classList.add("hidden");
        }
        
       
    });


    addVideo.onclick = function (ev) {

        ev.preventDefault()
        video_upload.classList.remove("hidden")

    }
    closeButton.onclick = function (ev) {

        ev.preventDefault()
        video_upload.classList.add("hidden")

    }
    uploadButton.onclick = async function (ev) {

        ev.preventDefault()
        const videoTitle = document.getElementById("videoTitle").value


       const [data, err] = await UploadVideo(file,videoTitle ,thumbnail)


        if (err != null){
            Toastify({
                text: "Error uploading video, please try again",
                duration: 2000,
              
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "red",
                },
                onClick: function(){} // Callback after click
              }).showToast();
            console.log(err)
        }else{
           
            Toastify({
                text: "Video Uploaded Successfully",
                duration: 2000,
              
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function(){} // Callback after click
              }).showToast();
              setInterval(() => {
                window.location.reload()
              }, 600);
            
    

           
      
        }
      
    }


    let [videos, err] = await getVideos();



    if (err != null) {

        loadingComponent.classList.add("hidden");
        console.error(err.toString())
    }
    else {

        loadingComponent.classList.add("hidden");
    }

    totalvideos.innerHTML = Object.entries(videos.videos).length.toString();


    //Iterate through the videos, and populate the table
    Object.entries(videos.videos).forEach(([key, value]) => {
        const table_row = document.createElement("tr");
        table_row.classList.add(
            "border-b", 
            "transition-colors", 
            "odd:bg-white", 
            "even:bg-slate-50", 
       
        );
        table_row.innerHTML = `
            <td class="p-4 align-middle font-medium ">${value["name"]}</td>
            <td class="p-4 align-middle ">12 minutes</td>
            <td class="p-4 align-middle ">${value["is_on_dashboard"] ? "On Dashboard" : "Not on Dashboard"}</td>
            <td class="p-4 align-middle text-right">
                <div class="flex justify-end space-x-2 items-center">
                    <button id="playButton:id=${value["id"]}" type="button" class="bg-gray-300 hover:bg-gray-400 font-bold py-2 px-4 rounded inline-flex items-center  dark:hover:bg-gray-600 ">
                        <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 18V6l8 6-8 6Z"/>
                        </svg>
                        <span class="sr-only">Play</span>
                    </button>
                    <button type="button" class="bg-gray-300 hover:bg-gray-400 font-bold py-2 px-4 rounded inline-flex items-center  dark:hover:bg-gray-600 ">
                        <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                        </svg>
                        <span class="sr-only">Edit</span>
                    </button>
                    <button id='deleteButton:id=${value["id"]}' type="button" class="bg-gray-300 hover:bg-gray-400 font-bold py-2 px-4 rounded inline-flex items-center  dark:hover:bg-gray-600 ">
                        <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                        </svg>
                        <span class="sr-only">Delete</span>
                    </button>
                </div>
            </td>
        `;
    
        table_body.append(table_row);
    
        const playButton = document.getElementById(`playButton:id=${value["id"]}`);
        const deleteButton = document.getElementById(`deleteButton:id=${value["id"]}`)
        playButton.addEventListener("click", () => {
            alert("Clicked");
        });

        deleteButton.addEventListener("click",async () => {
            
            const [deleteEvent, err] = await deleteVideo(value["id"], value["url_link"]);
            if (err != null) {
                console.error(err);
                swal("Error", "Failed to delete event", "error");
            } else if (deleteEvent != null) {
                console.log()
                Toastify({
                    text: "Deleted Successfully",
                    duration: 600,
                  
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    onClick: function(){} // Callback after click
                  }).showToast();
                
                setInterval(() => {
                    
                    window.location.reload();
                }, 1000);
               
            }
        })
    });
    



})