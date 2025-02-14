export async function createEvent(eventData) {
    let data = null;
    let error = null;
    try {
        const response = await fetch("/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"  
             
            },
            body: JSON.stringify(eventData) 
            
        });

        if (!response.ok) {
            const errorData = await response.json(); 
                    error = JSON.stringify(errorData); 
            throw new Error(error);
        }

        data = await response.json(); 


    } catch (err) {
        error = err.toString();
        console.error(error);
    }

    return [data, error];
}

export async function getEvents() {
    let data = null;
    let error = null;
    try {
        const response = await fetch("/events", {
            method: "GET"
        });

        if (!response.ok) {
            const errorData = await response.json(); 
                    error = JSON.stringify(errorData);
            throw new Error(error);
        }else{

            data = await response.json()
           
        }

       
       
       


    } catch (err) {
       

    }

    return [data, error];
}

export async function updateEvents(eventData) {
    let data = null;
    let error = null;
    try {
        const response = await fetch("/events", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"  
             
            },
            body: JSON.stringify(eventData) 
            
        });

        if (!response.ok) {
            const errorData = await response.json(); 
                    error = JSON.stringify(errorData);
            throw new Error(error);
        }

        data = await response.json(); 


    } catch (err) {
        error = err.toString();
        console.error(error);
    }

    return [data, error];
}

export async function deleteEvents(eventId) {
    let data = null;
    let error = null;
    try {
        const response = await fetch(`/events/${eventId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errorData = await response.json(); 
                    error = JSON.stringify(errorData);
            throw new Error(error);
        }

        data = await response.json(); 


    } catch (err) {
        error = err.toString();
        console.error(error);
    }

    return [data, error];
}
