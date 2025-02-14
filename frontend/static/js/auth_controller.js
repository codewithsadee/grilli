export async function Login(email, password) {
    
    let data = null;
    let err = null

    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();

        xhr.open("POST", "/login", true);

        xhr.setRequestHeader("Content-Type", "application/json");


        xhr.onload = () => {

            try {
                const response = JSON.parse(xhr.responseText);

                if (xhr.status >= 200 && xhr.status < 300) {

                    localStorage.setItem('token', response.token);
                    localStorage.setItem('userId', response.userID);
                    localStorage.setItem('userRole', response.role);
                    localStorage.setItem('userName', response.username);

                   
                      // Check for redirect target
                    //   const redirectTarget = response.redirect || '/dashboard_index';

                    //   // Perform the redirection
                    //   window.location.href = redirectTarget;
                    //Successful Login
                    resolve([response, null])
                }else{

                    err = {
                        status: xhr.status,
                        messsage:response.error || 'Login Failed'
                    }
                    console.log(err)
                    reject([null, {
                        status: xhr.status,
                        messsage:response.error || 'Login Failed'
                    }])
                }
                
            } catch (error) {

              
                err = {
                    status: xhr.status,
                    messsage:response.error || 'Login Failed'
                }
                console.log(err)
                
                reject([null, {

                    status: xhr.status,
                    messsage:'Login Failed'
                }])

                
            }
        }


        xhr.onerror = function () {

            err = {
                status: xhr.status,
                messsage:response.error || 'Login Failed'
            }
            console.log(err)
            reject([null, {
                status: 0,
                messsage:'Check your internet connection'
            }])
        }


        xhr.send(JSON.stringify({ email, password }));



    })
    
}
function GoToPage(url, token) {






}