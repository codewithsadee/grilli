export async function getProfile() {

    return new Promise((resolve, reject) => {



        const userId = localStorage.getItem('userId')

        const urlString = `/userDetails/${userId}`
        const xhr = new XMLHttpRequest();

        xhr.open("POST", urlString);

        xhr.timeout = 10000;

        xhr.onerror = () => {

            reject([null, xhr.statusText || 'Network Error']);

        }

        xhr.ontimeout = () => {

            reject([null, xhr.statusText]);

        }


        xhr.onload = () => {


            if (xhr.status === 200 && xhr.status < 300) {


                resolve([JSON.parse(xhr.responseText), null]);



            } else {

                reject([null, xhr.statusText]);

            }

        }




       
        xhr.send();

    })






}

export async function updateProfile(data) {

    return new Promise((resolve, reject) => {


        const xhr = new XMLHttpRequest();

        xhr.open("POST", "/updateProfile");
        

        xhr.timeout = 10000;



        xhr.ontimeout = () => {
            reject([null, xhr.statusText]);
        }


        xhr.onerror = () => {
            reject([null, xhr.statusText]);
        }

        xhr.onload = () => {

            if (xhr.status === 200 && xhr.status < 300) {
                resolve([JSON.parse(xhr.responseText), null]);
            } else {
                reject([null, xhr.statusText]);
            }

        }


        xhr.send(JSON.stringify(data))


    })}

    export async function updatePassword(data) {
        try {
            return await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.open("POST", "/updatePassword");
                xhr.setRequestHeader('Content-Type', 'application/json');
                
                xhr.timeout = 30000;
    
                xhr.ontimeout = () => {
                    reject([null, 'Request timed out']);
                };
    
                xhr.onerror = () => {
                    reject([null, xhr.statusText || 'Network Error']);
                };
    
                xhr.onload = () => {
                    try {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            const responseData = JSON.parse(xhr.responseText);
                            resolve([responseData, null]);
                        } else {
                            reject([null, xhr.statusText || `HTTP Error: ${xhr.status}`]);
                        }
                    } catch (parseError) {
                        reject([null, 'Response parsing error']);
                    }
                };
    
                xhr.send(JSON.stringify(data));
            });
        } catch (error) {
            console.error('Unexpected error in updatePassword:', error);
            throw error;
        }
    }