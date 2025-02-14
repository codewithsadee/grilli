
export async function getVideos() {

    let data;
    let error;

    try {
        const response = await fetch("/getVideos", {
            method: "GET"
        });

        if (!response.ok) {
            error = response.statusText
            throw new Error(response.statusText)
        }
        data = await response.json()
    } catch (e) {


        error = e.toString
        console.error()

    }




    return [data, error];

}

export async function UploadVideo(videoBlob, videoName, thumbnailBlob) {

    let data = null;
    let error = null;
    const progressBarElement = document.getElementById("progressBarFill")
    const formdata = new FormData()
    formdata.append("videoName", videoName)
    formdata.append("video", videoBlob)
    formdata.append("thumbnail", thumbnailBlob)

    try {

        const req = new XMLHttpRequest()

        req.open("POST", "/uploadVideo")

        req.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const progress = (e.loaded / e.total) * 100
                progressBarElement.style.width = `${progress}%`;

            }

        }

        req.onload = () => {

            if (req.status === 200 && req.status < 300) {
                data = JSON.parse(req.responseText);

            } else {
                error = req.statusText || "Upload Failed"
            }
        }

        req.onerror = () => {
            error = "Network Error";
        }

        req.send(formdata)


        await new Promise((resolve) => (req.onload = resolve))




    } catch (e) {


        error = e.toString()
        console.error(e)

    }




    return [data, error];

}

export async function playVideo(videoId) {

    let data = null;
    let error = null;


    try {

        const response = await fetch(`/playVideo/${videoId}`, {

        })
        if (!response.ok) {

            error = response.statusText
            throw new Error(response.statusText)
        }

        data = response.json()

    } catch (e) {

        error = e.toString()
        console.error(e)

    }

    return [data, error]

}


export async function deleteVideo(videoId, video_url) {

    let data = null;
    let error = null;




    try {

        const response = await fetch(`/video/${videoId}?link=${video_url}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            error = response.statusText
            throw new Error(response.statusText)
        }
        data = await response.json();

    } catch (err) {

        error = err.toString()
    }

    return [data, error];
}

