import { getProfile , updateProfile, updatePassword} from "./profile_manager_controller.js"

document.addEventListener('DOMContentLoaded', async () => {
    let temp;
    const loadingComponent = document.getElementById("loadingComponent");
    const firstName = document.getElementById("first_name");
    const lastName = document.getElementById("last_name");
    const email = document.getElementById("email");
    const saveButton = document.getElementById("save_info");
    
    const newPassword = document.getElementById("new_password");
    const confirmPassword = document.getElementById("confirm_new_password");

    const changePasswordButton = document.getElementById("change_password");
    // Initial state to track original values
    let originalUserData = null;

    // Function to handle loading state
    function toggleLoading(show) {
        loadingComponent.classList.toggle("hidden", !show);
    }

    // Fetch and populate profile data
    try {
        toggleLoading(true);
        const [data, err] = await getProfile();

        if (err) {
            console.error(err);
            // Optionally show error to user
            return;
        }


        temp = data;
        // Store original data for comparison
        originalUserData = {
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            email: data.user.email
        };

        // Populate form fields
        firstName.value = data.user.first_name;
        lastName.value = data.user.last_name;
        email.value = data.user.email;
    } catch (error) {
        console.error("Unexpected error:", error);
    } finally {
        toggleLoading(false);
    }

    // Save button event listener
    saveButton.addEventListener('click', async () => {
        // Get current form values
        const currentDetails = {
            id: parseInt(localStorage.getItem('userId')),
            first_name: firstName.value.trim(),
            last_name: lastName.value.trim(),
            email: email.value.trim()
        };

        // Check for changes
        const hasChanges = originalUserData 
            ? Object.keys(currentDetails).some(
                key => currentDetails[key] !== originalUserData[key]
            )
            : false;

        if (hasChanges) {
            console.log("Changes detected", currentDetails);
            // Implement your save logic here
            const res = await updateProfile(currentDetails);
            if (res) {
                console.log(res);
                // Optionally show success message to user
            }
        } else {
            console.log("No changes");
        }
    });

    changePasswordButton.addEventListener('click', () => {

        checkPassword(newPassword, confirmPassword);
        



    });
});


async function checkPassword(newPassword, confirmPassword) {

    const password = document.getElementById("password");

    if (newPassword.value !== confirmPassword.value) {
        newPassword.classList.add("border-red-500");
        confirmPassword.classList.add("border-red-500");
        const passwordError1 = document.getElementById("password_error1");

        const passwordError2 = document.getElementById("password_error2");
        passwordError1.classList.remove("hidden");
        passwordError2.classList.remove("hidden");
        return;
    }else{

        newPassword.classList.remove("border-red-500");
        confirmPassword.classList.remove("border-red-500");
        const passwordError1 = document.getElementById("password_error1");
        const passwordError2 = document.getElementById("password_error2");
        passwordError1.classList.add("hidden");
        passwordError2.classList.add("hidden");

        const jsonObject = {
            id: parseInt(localStorage.getItem('userId')),
            old_password: password.value.trim(),
            new_password: newPassword.value.trim()
        };
        console.log(JSON.stringify(jsonObject));

        const [data, err] = await updatePassword(jsonObject);

        if (err) {
            console.log("Dalitso");
            console.error(err);
            swal("Error", "Failed to update password", "error");
        }else{
            passwordError2.classList.remove("hidden");
            passwordError2.classList.add("text-green-500");

            passwordError2.innerText = "Password updated successfully";
            setInterval(() => {
                passwordError2.classList.remove("hidden");
                window.location.reload();
            }, 3000);
            
        }
       
        
    
    }
}