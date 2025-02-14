export async function getUpcomingEvents() {
    const data = null;
    const error = null;

    return new Promise((resolve, reject) => {



        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/events/upcoming', true);

            xhr.onerror = () =>{
                error = xhr.responseText;
                reject([null, error])
            }
            xhr.onload = () => {
                if(xhr.status === 200){
                    data = JSON.parse(xhr.responseText);
                    resolve([data, null]);
                } else {
                    error = xhr.responseText;
                    reject([null, error]);
                }
            }

            xhr.send();

            
        } catch (error) {
            reject([null, error]);
            
        }













    });
    
}

