import { getPictures, uploadPicture, deletePicture } from "./picture_manager_controller.js";

document.addEventListener('DOMContentLoaded', async () => {


    const username = document.getElementById('username');
    username.innerText = localStorage.getItem('userName');

    const logout = document.getElementById('logout');


    const loadingComponent = document.getElementById('loadingComponent');

    loadingComponent.classList.remove('hidden');

    const totalPictures = document.getElementById('total_Pictures');
    const pictureGrid = document.getElementById('pictureGrid');
    const imageInput = document.getElementById('image-upload');
    const uploadButton = document.getElementById('uploadButton');
    const closeButton = document.getElementById('cancelButton');
    const imageContainer = document.getElementById('image-preview-container');
    const image_preview = document.getElementById('image-preview');
    const imagePreviewContainer = document.getElementById('addPictureComponentLoading');
    const addPicture = document.getElementById('addPicture');
    let file;


    const [data, err] = await getPictures()
    if (err != null) {

        console.error(err)
        loadingComponent.classList.add('hidden');
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
            onClick: function () { } // Callback after click
        }).showToast();
    } else if (data.pictures == null) {
        console.error("No data")
        loadingComponent.classList.add('hidden');
        const picture_container = document.createElement('p');
        picture_container.innerText = "No Pictures Uploaded"
        pictureGrid.append(picture_container);

    } else {
        totalPictures.innerText = data.pictures.length;
        
        Object.entries(data.pictures).forEach(([key, value]) => {

            console.log(value)
            const picture_container = document.createElement('div');
            picture_container.classList.add('picture-container');
            picture_container.innerHTML = `

            <div class="imgs rounded-md z-10 shadow-md">
            <img alt="${value.id.toString()}" loading="lazy" src="${value.url_link}">
            </div>
            <div class="w-full flex h-16 justify-center items-center">
            <button id="button${value.id}" 
                class="bg-red-300 hover:bg-red-400 h-16 w-full dark:hover:bg-gray-700 text-gray-800  font-bold py-2 px-4 rounded"
                    type="button">Delete Photo</button>
                    </div>




            `

            pictureGrid.append(picture_container);
            const deleteButton = document.getElementById(`button${value.id}`);
            deleteButton.addEventListener('click', async () => {

                const [data, err] = await deletePicture(value.id, value.picture_name)
                if (err != null) {

                    console.error(err)
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
                        onClick: function () { } // Callback after click
                    }).showToast();
                } else {
                    Toastify({
                        text: "Picture Deleted Successfully",
                        duration: 2000,
                        newWindow: true,
                        close: true,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "green",
                        },
                        onClick: function () {
                            
                        }
                        }
                    ).showToast();
                    setTimeout(() => {
                        window.location.reload();
                    })
                }
            })

        })
        loadingComponent.classList.add('hidden');

    }


    imageInput.addEventListener('change', () => {
        file = imageInput.files[0];
        if (file) {
            uploadButton.classList.add('bg-green-600');
            uploadButton.attributes.removeNamedItem('disabled');
            const reader = new FileReader();
            reader.onload = () => {
                image_preview.src = reader.result;
                imageContainer.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
        else {
            uploadButton.classList.remove('bg-green-600');
            uploadButton.classList.add('bg-gray-400');
            image_preview.src = '';
            imageContainer.classList.add('hidden');
        }
    });

    closeButton.addEventListener('click', () => {


        imagePreviewContainer.classList.add('hidden');


    });
    uploadButton.addEventListener('click', async () => {
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            const [data, err] = await uploadPicture(formData);
            if (err != null) {
                console.error(err);
                Toastify({
                    text: "Error uploading picture, please try again",
                    duration: 2000,
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "red",
                    },
                    onClick: function () { } // Callback after click
                }).showToast();
            } else {
                Toastify({
                    text: "Picture Uploaded Successfully",
                    duration: 2000,
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "green",
                    },
                    onClick: function () { } // Callback after click
                }).showToast();

                setTimeout(() => {
                    window.location.reload();
                }, 1000); // Reload the page after 1 second
            }
        }
    });
   

    addPicture.addEventListener('click', () => {

        imagePreviewContainer.classList.remove('hidden');
    })

    logout.addEventListener('click', async () => {

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        //Delete all cookies
       
        const response = await fetch('/logout', { method: 'POST' });
        if(!response.ok){
            throw new Error(response.statusText)
        }
        else {
            response.json().then(data => {
                console.log(data);
                window.location.href = '/login';
            })
        }
        
    })

})
