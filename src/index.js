document.addEventListener('DOMContentLoaded', () => {
  test ();

  createEventForm.addEventListener("submit", (event) => createFormHandler(event));

})


const BACKEND_URL = 'http://localhost:3000/api/v1';
const createEventForm = document.getElementById('create-event-form');

function test() {
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

function createFormHandler(event) {
  event.preventDefault();
  const nameInput = document.querySelector("#input-name").value;
  const rulesInput = document.querySelector("#input-rules").value;
  postFetch(nameInput, rulesInput);
}

function postFetch(name, rules) {
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
  const eventContainer = document.querySelector("#event-container");
  eventContainer.appendChild(header);
  eventContainer.appendChild(subheader);
}


