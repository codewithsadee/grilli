'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll(".navbar-link");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);
addEventOnElements(navLinks, "click", closeNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

window.addEventListener("mousemove", function (event) {

  const baseX = -((event.clientX / window.innerWidth * 10) - 5);
  const baseY = -((event.clientY / window.innerHeight * 10) - 5);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    const speed = Number(parallaxItems[i].dataset.parallaxSpeed);
    const x = baseX * speed;
    const y = baseY * speed;
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});



/**
 * INTERACTIVE MENU CATEGORY TABS
 */

const menuTabBtns = document.querySelectorAll(".menu-tab-btn");
const menuCategories = document.querySelectorAll(".menu-category");
const menuJumpLinks = document.querySelectorAll("[data-menu-jump]");

const activateMenuTab = function (categoryName) {
  menuTabBtns.forEach(function (btn) {
    const isMatch = btn.dataset.tab === categoryName;
    btn.classList.toggle("active", isMatch);
    btn.setAttribute("aria-selected", isMatch ? "true" : "false");
  });

  menuCategories.forEach(function (list) {
    list.classList.toggle("active", list.dataset.category === categoryName);
  });
};

menuTabBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    activateMenuTab(btn.dataset.tab);
  });
});

menuJumpLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    activateMenuTab(link.dataset.menuJump);
  });
});



/**
 * WHATSAPP TABLE RESERVATION & UPDATES FORM
 */

const BRO_WHATSAPP_NUMBER = "94773494750";

const reservationForm = document.getElementById("reservation-form");
if (reservationForm) {
  const dateInput = reservationForm.querySelector('input[name="reservation-date"]');
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  reservationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = reservationForm.querySelector('input[name="name"]').value.trim();
    const phone = reservationForm.querySelector('input[name="phone"]').value.trim();
    const persons = reservationForm.querySelector('select[name="person"]').value;
    const date = reservationForm.querySelector('input[name="reservation-date"]').value;
    const time = reservationForm.querySelector('select[name="reservation-time"]').value;
    const message = reservationForm.querySelector('textarea[name="message"]').value.trim();

    const text =
      `Hello Bro Restaurant! I would like to reserve a table:%0A%0A` +
      `*Name:* ${encodeURIComponent(name)}%0A` +
      `*Phone:* ${encodeURIComponent(phone)}%0A` +
      `*Guests:* ${encodeURIComponent(persons)}%0A` +
      `*Date:* ${encodeURIComponent(date)}%0A` +
      `*Time:* ${encodeURIComponent(time)}` +
      (message ? `%0A*Special Request:* ${encodeURIComponent(message)}` : "");

    window.open(`https://wa.me/${BRO_WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener");
  });
}

const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const waNumber = newsletterForm.querySelector('input[name="whatsapp_number"]').value.trim();
    const text = `Hello Bro Restaurant! Please add my number (${encodeURIComponent(waNumber)}) to your special offers & updates list.`;
    window.open(`https://wa.me/${BRO_WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener");
    newsletterForm.reset();
  });
}
