document.addEventListener('DOMContentLoaded', async () => {
    
    video_container = document.getElementById('video')
    const myVideos = await getVideos();
    console.log(myVideos[0].Link)

    video_container.InnerHTML = `
    <video  width="320" height="240" controls>
    <source src="/videos/video1.mp4" type="video/mp4">
    </video>

    `
  

})
async function getVideos() {
    const response = await fetch('/videos')
    const videos = await response.json()
    return videos.videos
}