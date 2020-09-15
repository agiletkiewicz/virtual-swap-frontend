document.addEventListener('DOMContentLoaded', () => {
  fetchEvents();

  createEventForm.addEventListener("submit", (event) => createFormHandler(event));
  viewEventForm.addEventListener("submit", (event) => viewFormHandler(event));

})


const createEventForm = document.getElementById('create-event-form');
const viewEventForm = document.getElementById('view-event-form');

function fetchEvents() {
  new Adapter('/events').getRequest()
  .then(parsedResponse => {
    addEventsToForm(parsedResponse)
  });
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
  const eventId = parseInt(document.querySelector('#events').value);
  const eventPin = parseInt(document.querySelector('#pin').value);
  accessEvent(eventId, eventPin);
}

function accessEvent(id, pin) {
  const bodyData = {id, pin}

  new Adapter('/login').postRequest(bodyData)
  .then(event => {
    renderEvent(event);
  })
}

function createFormHandler(event) {
  event.preventDefault();
  const nameInput = document.querySelector("#input-name").value;
  const rulesInput = document.querySelector("#input-rules").value;
  const pinInput = document.querySelector("#input-pin").value;
  createEventFetch(nameInput, rulesInput, pinInput);
}

function createEventFetch(name, rules, pin) {
  const bodyData = {name, rules, pin}

  new Adapter('/events').postRequest(bodyData)
  .then(event => {
    renderEvent(event);
  })
}

function renderEvent(event) { 
  const eventData = event.data.attributes;
  const eventId = event.data.id

  const header = document.createElement("h1");
  header.innerText = eventData.name;
  const subheader = document.createElement("h2");
  subheader.innerText = eventData.rules;

  createEventForm.style.display = 'none';
  viewEventForm.style.display = 'none';
  const eventContainer = document.querySelector("#event-container");
  eventContainer.appendChild(header);
  eventContainer.appendChild(subheader);

  renderUsers(eventId);
}

function renderUsers(eventId) {
  new Adapter(`/events/${eventId}/users`).getRequest()
  .then(response => {
    console.log(response);
  })
}
