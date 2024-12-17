import { getEvents, createEvent, updateEvents, deleteEvents } from "./event_manager_controller.js"

const loadingState = document.getElementById("loadingComponent")
const addEvent = document.getElementById("addEvent")
const table_body = document.getElementById("table_body")
const formComponent = document.getElementById("formComponent")
const editformComponent = document.getElementById("formComponent")
const eventForm = document.getElementById("eventForm")
document.addEventListener('DOMContentLoaded', async () => {


    loadingState.classList.remove("hidden")

    //Get the list of v=events from the server
    const [eventData, error] = await getEvents();

    if (error != null) {
        console.error(error)
        loadingState.classList.add("hidden")
    } if (eventData.events == null) {

        table_body.innerHTML = `<tr><td colspan="3">No Events Found</td></tr>`
    }
    else if (eventData.events != null) {
        loadingState.classList.add("hidden")
        Object.entries(eventData.events).forEach(([key, value]) => {
            const table_row = document.createElement("tr");
            table_row.classList.add(
                "border-b",
                "transition-colors",
                "odd:bg-white",
                "even:bg-slate-50",

            );
            table_row.innerHTML = `
                <td class="p-4 align-middle font-medium ">${value["event_name"]}</td>
                <td class="p-4 align-middle ">${value["date_of_event"]}</td>
                <td class="p-4 align-middle ">${value["event_description"]}</td>
                <td class="p-4 align-middle text-right">
                    <div class="flex justify-end space-x-2 items-center">
                     
                        <button id="editButton" type="button" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center   ">
                            <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                            </svg>
                            <span class="sr-only">Edit</span>
                        </button>
                        <button id="delete_event:id=${value["id"]}" type="button" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center   ">
                            <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                            </svg>
                            <span class="sr-only">Delete</span>
                        </button>
                    </div>
                </td>
            `;



            table_body.append(table_row);


            const editButton = document.getElementById(`editButton`);
            editButton.addEventListener("click", async () => {

                const editEventName = document.getElementById("editEventName");
                const editEventDate = document.getElementById("editEventDate");
                const editEventDescription = document.getElementById("editEventDescription");

                console.log("event_name:", value["event_name"]);
                console.log("date_of_event:", value["date_of_event"]);
                console.log("event_description:", value["event_description"]);

                console.log("editEventName element:", document.getElementById("editEventName"));
                console.log("editEventDate element:", document.getElementById("editEventDate"));
                console.log("editEventDescription element:", document.getElementById("editEventDescription"));
                if (editEventName && editEventDate && editEventDescription) {
                    editEventName.value = value["event_name"];
                    editEventDate.value = value["date_of_event"];
                    editEventDescription.value = value["event_description"];
                } else {
                    console.error("One or more input elements are not found in the DOM.");
                }
                editformComponent.classList.remove("hidden")
            })
            const deleteEvent = document.getElementById(`delete_event:id=${value["id"]}`);
            deleteEvent.addEventListener("click", async () => {
                const [data, err] = await deleteEvents(value["id"])

                if (err != null) {


                    console.error(err)
                }
                else {
                    console.log(data)
                    Toastify({
                        text: "Event Deleted Successfully",
                        duration: 2000,
                        newWindow: true,
                        close: true,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        },
                        onClick: function () { } // Callback after click
                    }).showToast();
                    setInterval(() => {
                        window.location.reload()
                    }, 600);
                }
            });



        });

    }
    console.log(eventData)

    const submit = document.getElementById("submitButton")

    submit.onclick = async function (e) {

        e.preventDefault()

        const eventName = document.getElementById("eventName").value
        const eventDate = document.getElementById("eventDate").value
        const eventDescription = document.getElementById("eventDescription").value


        const eventObject =
            {
                "event_name": eventName,
                "event_description": eventDescription,
                "date_of_event": eventDate,
            };


        const eventJson = JSON.stringify(eventObject)
        console.log(eventJson)
        const [data, err] = await createEvent(eventJson)
        if (err != null) {
            console.error(err)
            swal("Error", "Failed to upload event", "error");
        } else {

            swal("Success", "Event Successfully Created", "success");




        }



    }










    addEvent.addEventListener("click", () => {

        formComponent.classList.remove("hidden")
    })

})


