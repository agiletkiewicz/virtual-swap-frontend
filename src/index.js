document.addEventListener('DOMContentLoaded', () => {
  console.log("loaded")
})


const BACKEND_URL = 'http://localhost:3000/api/v1';
fetch(`${BACKEND_URL}/events`)
  .then(response => response.json())
  .then(parsedResponse => console.log(parsedResponse));