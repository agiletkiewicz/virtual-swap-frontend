document.addEventListener('DOMContentLoaded', () => {
  test ();
})


const BACKEND_URL = 'http://localhost:3000/api/v1';

function test() {
  fetch(`${BACKEND_URL}/events`)
  .then(response => response.json())
  .then(parsedResponse => console.log(parsedResponse));
}


