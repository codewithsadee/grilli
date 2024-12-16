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


       
        navbar.innerHTML = `<!-- component -->
<div class="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased  bg-gray-900 text-gray-50">
  <div class="fixed flex flex-col top-0 left-0 w-64 bg-gray-900 h-full border-r">
    <div class="flex items-center justify-center h-14 border-b">
      <div>Zikos Media Manger</div>
    </div>
    <div class="overflow-y-auto overflow-x-hidden flex-grow">
      <ul class="flex flex-col py-4 space-y-1">
        <li class="px-5">
          <div class="flex flex-row items-center h-8">
            <div class="text-sm font-light tracking-wide text-white">Menu</div>
          </div>
        </li>
        <li>
          <a href="/dashboard_index" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-100 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
            <span class="inline-flex justify-center items-center ml-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            </span>
            <span class="ml-2 text-sm tracking-wide truncate">Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/picture_manager" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-100 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
            <span class="inline-flex justify-center items-center ml-4">
             <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M350-384.67h394l-130.67-174-99.33 130-66-84.66-98 128.66Zm-70 171.34q-27 0-46.83-19.84Q213.33-253 213.33-280v-533.33q0-27 19.84-46.84Q253-880 280-880h533.33q27 0 46.84 19.83Q880-840.33 880-813.33V-280q0 27-19.83 46.83-19.84 19.84-46.84 19.84H280Zm0-66.67h533.33v-533.33H280V-280ZM146.67-80q-27 0-46.84-19.83Q80-119.67 80-146.67v-600h66.67v600h600V-80h-600ZM280-813.33V-280v-533.33Z"/></svg>
            </span>
            <span class="ml-2 text-sm tracking-wide truncate">Picture Manager</span>
            <span class="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-indigo-500 bg-indigo-50 rounded-full">New</span>
          </a>
        </li>
        <li>
          <a href="/video_manager" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-100 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
            <span class="inline-flex justify-center items-center ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m388-308.67 266.67-172.66L388-654v345.33ZM146.67-160q-27 0-46.84-19.83Q80-199.67 80-226.67v-506.66q0-27 19.83-46.84Q119.67-800 146.67-800h666.66q27 0 46.84 19.83Q880-760.33 880-733.33v506.66q0 27-19.83 46.84Q840.33-160 813.33-160H146.67Zm0-66.67h666.66v-506.66H146.67v506.66Zm0 0v-506.66 506.66Z"/></svg>
              
            </span>
            <span class="ml-2 text-sm tracking-wide truncate">Video Manager</span>
          </a>
        </li>
        <li>
          <a href="/event_manager" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-100 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
            <span class="inline-flex justify-center items-center ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M186.67-80q-27 0-46.84-19.83Q120-119.67 120-146.67v-600q0-27 19.83-46.83 19.84-19.83 46.84-19.83h56.66V-880h70v66.67h333.34V-880h70v66.67h56.66q27 0 46.84 19.83Q840-773.67 840-746.67v600q0 27-19.83 46.84Q800.33-80 773.33-80H186.67Zm0-66.67h586.66v-420H186.67v420Zm0-486.66h586.66v-113.34H186.67v113.34Zm0 0v-113.34 113.34Zm93.33 220V-480h400v66.67H280ZM280-240v-66.67h279.33V-240H280Z"/></svg>
            </span>
            <span class="ml-2 text-sm tracking-wide truncate">Event Manager</span>
            <span class="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">1.2k</span>
          </a>
        </li>
        <li class="px-5">
          <div class="flex flex-row items-center h-8">
            <div class="text-sm font-light tracking-wide text-white">Tasks</div>
          </div>
        </li>
        <li>
          <a href="#" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-100 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
            <span class="inline-flex justify-center items-center ml-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </span>
            <span class="ml-2 text-sm tracking-wide truncate">Available Tasks</span>
          </a>
        </li>
        <li>
          <a href="#" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-100 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
            <span class="inline-flex justify-center items-center ml-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </span>
            <span class="ml-2 text-sm tracking-wide truncate">Clients</span>
            <span class="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">15</span>
          </a>
        </li>
        <li class="px-5">
          <div class="flex flex-row items-center h-8">
            <div class="text-sm font-light tracking-wide text-white">Settings</div>
          </div>
        </li>
        <li>
          <a href="/profile_manager" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-100 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
            <span class="inline-flex justify-center items-center ml-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </span>
            <span class="ml-2 text-sm tracking-wide truncate">Profile</span>
          </a>
        </li>
        
        <li>
          <a id="logout" href="#" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-100 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
            <span class="inline-flex justify-center items-center ml-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </span>
            <span class="ml-2 text-sm tracking-wide truncate">Logout</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>`

        this.append(navbar);
        let logout = document.getElementById('logout');
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