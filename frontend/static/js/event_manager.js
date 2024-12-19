// Importing event manager functionalities
import { getEvents, createEvent, updateEvents, deleteEvents } from "./event_manager_controller.js";

// Getting DOM elements
const loadingState = document.getElementById("loadingComponent");
const addEvent = document.getElementById("addEvent");
const table_body = document.getElementById("table_body");
const formComponent = document.getElementById("formComponent");
const editformComponent = document.getElementById("editformComponent"); // Fixed duplicate ID
const eventForm = document.getElementById("eventForm");

document.addEventListener('DOMContentLoaded', async () => {

    // Set the username in the UI from localStorage
    const username = document.getElementById('username');
    username.innerText = localStorage.getItem('userName');

    // Show loading indicator
    loadingState.classList.remove("hidden");

    // Fetch events from the server
    const [eventData, error] = await getEvents();

    if (error) {
        console.error(error);
        loadingState.classList.add("hidden");
        return;
    }

    // Handle cases where no events are found
    if (!eventData.events) {
        
        table_body.innerHTML = `<tr><td colspan="3">No Events Found</td></tr>`;
        loadingState.classList.add("hidden");
    } else {
        // Hide loading indicator
        loadingState.classList.add("hidden");

        // Populate events into the table
        eventData.events.forEach((event) => {
            const table_row = document.createElement("tr");
            table_row.classList.add(
                "border-b",
                "transition-colors",
                "odd:bg-white",
                "even:bg-slate-50",
            );
            
            table_row.innerHTML = `
                <td class="p-4 align-middle font-medium ">${event.event_name}</td>
                <td class="p-4 align-middle ">${event.date_of_event}</td>
                <td class="p-4 align-middle ">${event.event_description}</td>
                <td class="p-4 align-middle text-right">
                    <div class="flex justify-end space-x-2 items-center">
                        <button id="edit_event_${event.id}" type="button" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                            <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                            </svg>
                            <span class="sr-only">Edit</span>
                        </button>
                        <button id="delete_event_${event.id}" type="button" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                            <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                            </svg>
                            <span class="sr-only">Delete</span>
                        </button>
                    </div>
                </td>
            `;

            table_body.appendChild(table_row);

            // Add click event for editing the event
            const editButton = document.getElementById(`edit_event_${event.id}`);
            editButton.addEventListener("click", () => {
                const editEventName = document.getElementById("editEventName");
                const editEventDate = document.getElementById("editEventDate");
                const editEventDescription = document.getElementById("editEventDescription");

                // Populate edit form with existing event data
                if (editEventName && editEventDate && editEventDescription) {
                    editEventName.value = event.event_name;
                    editEventDate.value = event.date_of_event;
                    editEventDescription.value = event.event_description;
                    editformComponent.classList.remove("hidden");
                } else {
                    console.error("Edit form elements are missing.");
                }
            });

            // Add click event for deleting the event
            const deleteButton = document.getElementById(`delete_event_${event.id}`);
            deleteButton.addEventListener("click", async () => {
                const [data, err] = await deleteEvents(event.id);
                if (err) {
                    console.error(err);
                } else {
                    console.log(data);
                    Toastify({
                        text: "Event Deleted Successfully",
                        duration: 2000,
                        newWindow: true,
                        close: true,
                        gravity: "top",
                        position: "right",
                        stopOnFocus: true,
                        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
                        onClick: () => {}
                    }).showToast();

                    // Reload the page after deletion
                    setTimeout(() => {
                        window.location.reload();
                    }, 600);
                }
            });
        });
    }

    // Handle event form submission
    const submit = document.getElementById("submitButton");
    submit.onclick = async function (e) {
        e.preventDefault();

        // Collect form data
        const eventName = document.getElementById("eventName").value;
        const eventDate = document.getElementById("eventDate").value;
        const eventDescription = document.getElementById("eventDescription").value;

        const eventObject = {
            event_name: eventName,
            event_description: eventDescription,
            date_of_event: eventDate,
        };

        // Send data to server
        const [data, err] = await createEvent(eventObject);
        if (err) {
            console.error(err);
            swal("Error", "Failed to upload event", "error");
        } else {
            swal("Success", "Event Successfully Created", "success");
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    // Show the form to add a new event
    addEvent.addEventListener("click", () => {
        formComponent.classList.remove("hidden");
    });
});
