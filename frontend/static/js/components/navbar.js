class MyNavBar extends HTMLElement {




    constructor(...args){

        super();
       
        
    }




    connectedCallback(){


        console.log("nav mounted")
        this.render();
    }



    render(){

        
        const currentPath = window.location.pathname;


        //Skeleton of the navbar
        const navbar = document.createElement('aside');
        navbar.classList.add('w-64','hidden','md:flex','flex-col','h-full', 'fixed', 'top-0', 'left-0', 'bg-gray-900', 'p-4', 'text-white', 'z-50');


        //Card will contain the logo
        const card = document.createElement('div');
        const spacer = document.createElement('div');
        const profile = document.createElement('div');
        spacer.classList.add('h-full')
        card.classList.add(  'mb-4', 'h-20');

        card.innerHTML = `
            <h1 class="text-2xl font-bold">Zikos Backoffice</h1>
        `

        //navbar contains the links
        const navbarContent = document.createElement('nav');
        navbarContent.classList.add('flex', 'flex-col', 'gap-2', 'text-md' );


        const dashBoardIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M513.33-580v-260H840v260H513.33ZM120-446.67V-840h326.67v393.33H120ZM513.33-120v-393.33H840V-120H513.33ZM120-120v-260h326.67v260H120Zm66.67-393.33H380v-260H186.67v260ZM580-186.67h193.33v-260H580v260Zm0-460h193.33v-126.66H580v126.66Zm-393.33 460H380v-126.66H186.67v126.66ZM380-513.33Zm200-133.34Zm0 200ZM380-313.33Z"/></svg>`;
        const EventsIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M186.67-80q-27 0-46.84-19.83Q120-119.67 120-146.67v-600q0-27 19.83-46.83 19.84-19.83 46.84-19.83h56.66V-880h70v66.67h333.34V-880h70v66.67h56.66q27 0 46.84 19.83Q840-773.67 840-746.67v600q0 27-19.83 46.84Q800.33-80 773.33-80H186.67Zm0-66.67h586.66v-420H186.67v420Zm0-486.66h586.66v-113.34H186.67v113.34Zm0 0v-113.34 113.34Zm93.33 220V-480h400v66.67H280ZM280-240v-66.67h279.33V-240H280Z"/></svg>`;
        const VideoIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="m388-308.67 266.67-172.66L388-654v345.33ZM146.67-160q-27 0-46.84-19.83Q80-199.67 80-226.67v-506.66q0-27 19.83-46.84Q119.67-800 146.67-800h666.66q27 0 46.84 19.83Q880-760.33 880-733.33v506.66q0 27-19.83 46.84Q840.33-160 813.33-160H146.67Zm0-66.67h666.66v-506.66H146.67v506.66Zm0 0v-506.66 506.66Z"/></svg>`;
        const PictureIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M350-384.67h394l-130.67-174-99.33 130-66-84.66-98 128.66Zm-70 171.34q-27 0-46.83-19.84Q213.33-253 213.33-280v-533.33q0-27 19.84-46.84Q253-880 280-880h533.33q27 0 46.84 19.83Q880-840.33 880-813.33V-280q0 27-19.83 46.83-19.84 19.84-46.84 19.84H280Zm0-66.67h533.33v-533.33H280V-280ZM146.67-80q-27 0-46.84-19.83Q80-119.67 80-146.67v-600h66.67v600h600V-80h-600ZM280-813.33V-280v-533.33Z"/></svg>`;
        //Appending links
        const dashboardLink = this.createLink('Dashboard', '/dashboard_index', currentPath, dashBoardIcon);
        const criminalsLink = this.createLink('Event Manager', '/event_manager', currentPath, EventsIcon);
        const crimeMapLink = this.createLink('Video Manager', '/video_manager', currentPath, VideoIcon);
        const crimesLink = this.createLink('Picture Manager', '/picture_manager', currentPath, PictureIcon);
        navbarContent.appendChild(dashboardLink);
        navbarContent.appendChild(criminalsLink);
        navbarContent.appendChild(crimeMapLink);
        navbarContent.appendChild(crimesLink);


      
        //appending everything
        navbar.append(card);
        
        navbar.append(navbarContent);
      


        this.append(navbar);

    }

    createLink(text, href, currentPath, iconCode) {
        const span = document.createElement('a');

        span.href = href;
        span.classList.add('flex', 'rounded-sm', 'items-center', 'gap-2', 'hover:bg-gray-700', href === currentPath ? 'bg-gray-700' : 'd','p-2');
        const link = document.createElement('a');
        const icon = document.createElement('span');
        icon.innerHTML = iconCode;

        link.classList.add('block', );
        link.textContent = text;
      
        
        span.append(icon);
        span.append(link);
        return span;
      }

  

    



}

customElements.define('my-navbar', MyNavBar);