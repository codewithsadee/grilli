import { Login } from "./auth_controller.js";






const email = document.getElementById("email")
const password = document.getElementById("password")
const submit = document.getElementById("submit")

submit.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailText = email.value.trim();
    const passwordText = password.value;

    try {
        const [data, err] = await Login(emailText, passwordText);

        if (err) {
            console.error('Login failed:', err);
            return;
        }

        if (data.token && data.redirect) {
            // Create a hidden form to submit with the token
            const form = document.createElement('form');
            form.method = 'GET';
            form.action = data.redirect;
            
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = 'token';
            tokenInput.value = data.token;
            
            form.appendChild(tokenInput);
            document.body.appendChild(form);
            form.submit();
        }
    } catch (error) {
        console.error('Unexpected error during login:', error);
    }
});