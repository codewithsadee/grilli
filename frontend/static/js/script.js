document.addEventListener('DOMContentLoaded', () => {

  console.log("Loaded")

  var prevScrollpos = window.pageYOffset;

  window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    var navbar = document.getElementById("navbar");
  
    if (!navbar) {
      console.error("Navbar element not found");
      return;
    }
  
    if (prevScrollpos > currentScrollPos) {
      // Show the navbar
      navbar.style.top = "0";
    } else {
      // Hide the navbar
      navbar.style.top = "-100px"; // Adjust this value based on the navbar's height
    }
  
    prevScrollpos = currentScrollPos;
  };

  const images = [
    `/static/images/hero-slider-1.jpg`,
    `/static/images/hero-slider-2.jpg`,
    `/static/images/hero-slider-3.jpg`,

  ]
  const first = images[0];
  var length = images.length;



 
  setImage(images, first, length)


})

function slideImages(){

  

}


function setImage(imageObject, firstImage, objectLength) {
  if (!imageObject || !Array.isArray(imageObject) || objectLength <= 0) {
    console.error("Invalid imageObject or objectLength");
    return;
  }

  let counter = 0;
  const image = document.getElementById("slider");

  if (!image) {
    console.error("Slider element not found");
    return;
  }

  // Set the initial image if provided
  if (firstImage) {
    image.src = firstImage;
  }

  setInterval(() => {
    // Add the fade-out class
    image.classList.add("fade-out");

    // Wait for the fade-out effect to complete before changing the image
    setTimeout(() => {
      image.src = imageObject[counter];
      counter = (counter + 1) % objectLength; // Loop through the images

      // Remove the fade-out class to fade back in
      image.classList.remove("fade-out");
    }, 1000); // Matches the CSS transition duration (1s)
  }, 7000); // Change image every 5 seconds
}

