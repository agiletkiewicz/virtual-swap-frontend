document.addEventListener('DOMContentLoaded', () => {
  test ();

  const createEventForm = document.getElementById('create-event-form');

  createEventForm.addEventListener("submit", (event) => createFormHandler(event));
})


const BACKEND_URL = 'http://localhost:3000/api/v1';

function test() {
  fetch(`${BACKEND_URL}/events`)
  .then(response => response.json())
  .then(parsedResponse => console.log(parsedResponse));
}

function createFormHandler(event) {
  event.preventDefault();
  const nameInput = document.querySelector("#input-name").value;
  const rulesInput = document.querySelector("#input-rules").value;
  postFetch(nameInput, rulesInput);
}

function postFetch(name, rules) {
  console.log(name, rules);
}


