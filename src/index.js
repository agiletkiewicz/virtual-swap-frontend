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
  console.log(event);
}


