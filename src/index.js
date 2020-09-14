document.addEventListener('DOMContentLoaded', () => {
  fetchEvents();

  createEventForm.addEventListener("submit", (event) => createFormHandler(event));
  viewEventForm.addEventListener("submit", (event) => viewFormHandler(event));

})


const BACKEND_URL = 'http://localhost:3000/api/v1';
const createEventForm = document.getElementById('create-event-form');
const viewEventForm = document.getElementById('view-event-form');

function fetchEvents() {
  fetch(`${BACKEND_URL}/events`)
  .then(response => response.json())
  .then(parsedResponse => addEventsToForm(parsedResponse));
}

function addEventsToForm(allEvents) {
  for (const event of allEvents.data) {
    const eventOptions = document.getElementById("events")
    let newOption = new Option(event.attributes.name, event.id);
    eventOptions.add(newOption,undefined);
  } 
}

function viewFormHandler(event) {
  event.preventDefault();
  // const nameInput = document.querySelector("#input-name").value;
  // createEventFetch(nameInput, rulesInput);
  const eventId = parseInt(document.querySelector('#events').value);
  fetchEvent(eventId);
}

function fetchEvent(eventId) {
  fetch(`${BACKEND_URL}/events/${eventId}`)
  .then(response => response.json())
  .then(parsedResponse => renderEvent(parsedResponse));
}

function createFormHandler(event) {
  event.preventDefault();
  const nameInput = document.querySelector("#input-name").value;
  const rulesInput = document.querySelector("#input-rules").value;
  createEventFetch(nameInput, rulesInput);
}

function createEventFetch(name, rules) {
  fetch(`${BACKEND_URL}/events`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name: name, 
      rules: rules,
    })
  })
  .then(response => response.json())
  .then(event => {
    renderEvent(event);
  })
}

function renderEvent(event) { 
  const eventData = event.data.attributes;

  const header = document.createElement("h1");
  header.innerText = eventData.name;
  const subheader = document.createElement("h2");
  subheader.innerText = eventData.rules;

  createEventForm.style.display = 'none';
  viewEventForm.style.display = 'none';
  const eventContainer = document.querySelector("#event-container");
  eventContainer.appendChild(header);
  eventContainer.appendChild(subheader);
}


