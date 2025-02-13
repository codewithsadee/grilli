export async function uploadPicture(pictureFormData) {
    let data = null;
    let err = null;

    try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/pictures");

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const progress = (e.loaded / e.total) * 100;
                const progressBarElement = document.getElementById("progressBarFill");
                progressBarElement.style.width = `${progress}%`;
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200 && xhr.status < 300) {
                data = JSON.parse(xhr.responseText);
            } else {
                err = xhr.statusText;
                throw new Error(xhr.statusText);
            }
        };
        xhr.onerror = () => {
            err = xhr.statusText;
            throw new Error(xhr.statusText);
        };

        xhr.send(pictureFormData);

        await new Promise((resolve) => {
            xhr.onload = resolve;
        });

    } catch (error) {
        err = error.toString();
    }

    return [data, err];
}

export async function getPictures() {
    let data = null;
    let err = null;
    try {
        const response = await fetch("/pictures", {
            method: "GET",
        });
        if (!response.ok) {
            err = response.statusText;
            throw new Error(response.statusText);
        }
        data = await response.json();
    } catch (error) {
        err = error.toString();
    }
    return [data, err];
}


export async function deletePicture(pictureId, pictureName) {

    let data = null;
    let err = null;
    try {
        const response = await fetch(`/pictures/${pictureId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            err = response.statusText;
            throw new Error(response.statusText);
        }
        data = response.json();
    } catch (error) {
        err = error.toString();
    }
    return [data, err];
}