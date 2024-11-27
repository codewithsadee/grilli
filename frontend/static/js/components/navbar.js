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
        navbar.classList.add('w-64','flex','flex-col','h-full', 'fixed', 'top-0', 'left-0', 'bg-gray-900', 'p-4', 'text-white', 'z-50');


        //Card will contain the logo
        const card = document.createElement('div');
        card.classList.add(  'mb-4', 'h-20');

        card.innerHTML = `
            <h1 class="text-2xl font-bold">Crime Watcher Gov</h1>
        `

        //navbar contains the links
        const navbarContent = document.createElement('nav');
        navbarContent.classList.add('flex', 'flex-col', 'gap-2', 'text-lg' );

        //Appending links
        const dashboardLink = this.createLink('Dashboard', '/dashboard_index', currentPath);
        const criminalsLink = this.createLink('Event Manager', '/event_manager', currentPath);
        const crimeMapLink = this.createLink('Video Manager', '/video_manager', currentPath);
        const crimesLink = this.createLink('Picture Manager', '/picture_manager', currentPath);
        navbarContent.appendChild(dashboardLink);
        navbarContent.appendChild(criminalsLink);
        navbarContent.appendChild(crimeMapLink);
        navbarContent.appendChild(crimesLink);

        //appending everything
        navbar.append(card);
        navbar.append(navbarContent);

        this.append(navbar);

    }

    createLink(text, href, currentPath) {
        const link = document.createElement('a');
        link.classList.add('block', 'p-2', 'hover:bg-gray-700', href === currentPath ? 'bg-gray-700' : 'd');
        link.textContent = text;
        link.href = href;
        return link;
      }

  

    



}

customElements.define('my-navbar', MyNavBar);