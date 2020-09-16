document.addEventListener('DOMContentLoaded', () => {
  fetchEvents();

  createEventForm.addEventListener("submit", (event) => createFormHandler(event));
  viewEventForm.addEventListener("submit", (event) => viewFormHandler(event));

})


const createEventForm = document.getElementById('create-event-form');
const viewEventForm = document.getElementById('view-event-form');
const eventContainer = document.querySelector("#event-container");
const userForm = document.querySelector("#select-user-form");
const userCreateForm = document.querySelector("#create-user-form");
const formContainer = document.querySelector("#form-container");
let currentUser
let currentEventId

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

  new Adapter(`/login`).postRequest(bodyData)
  .then(event => {
    debugger
    renderUserSelectForm();
    renderUserCreateForm();
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
    renderUserSelectForm();
    renderUserCreateForm();
    renderEvent(event);
  })
}

function renderEvent(event) { 
  const eventData = event.data.attributes;
  currentEventId = event.data.id

  const header = document.createElement("h1");
  header.innerText = eventData.name;
  const subheader = document.createElement("h2");
  subheader.innerText = eventData.rules;

  createEventForm.style.display = 'none';
  viewEventForm.style.display = 'none';
  eventContainer.appendChild(header);
  eventContainer.appendChild(subheader);

  for(const element of event.included) {
    if (element.type === "item") {
      const newItem = new Item(element);
      newItem.renderItemCard();
    } else if (element.type === "user") {
      const newUser = new User(element);
      let newOption = new Option(newUser.name, newUser.id);
      document.querySelector("#users").appendChild(newOption,undefined);
    }
  }
}


function renderUserSelectForm() {
  const select = document.createElement("select");
  select.name = "users";
  select.id = "users";

  const label = document.createElement("label");
  label.innerHTML = "Choose an existing user: "
  label.htmlFor = "users";

  const submit = document.createElement("input");
  submit.setAttribute('type',"submit");
  submit.setAttribute('value',"Submit");

  userForm.appendChild(label).appendChild(select);
  userForm.appendChild(submit);

  userForm.addEventListener("submit", (event) => userSelectFormHandler(event));
}

function renderUserCreateForm() {

  const label = document.createElement("label");
  label.innerHTML = "Create a new user:"
  label.htmlFor = "users";

  const input = document.createElement("input");
  input.setAttribute('type',"text");
  input.setAttribute('name',"name");
  input.setAttribute('id',"input-user-name");

  const submit = document.createElement("input");
  submit.setAttribute('type',"submit");
  submit.setAttribute('value',"Submit");

  userCreateForm.appendChild(label).appendChild(input);
  userCreateForm.appendChild(submit);

  userCreateForm.addEventListener("submit", (event) => userCreateFormHandler(event));
}

function userCreateFormHandler(event) {
  event.preventDefault();
  const nameInput = document.querySelector("#input-user-name").value;
  createUserFetch(nameInput);
}

function createUserFetch(name) {
  const bodyData = {name, event_id: currentEventId}

  new Adapter(`/users`).postRequest(bodyData)
  .then(event => {
    currentUser = new User(event.data);
    userForm.style.display = 'none';
    userCreateForm.style.display = 'none';
    renderItemCreateForm();
  })
}

function userSelectFormHandler(event) {
  event.preventDefault();
  const userId = parseInt(document.querySelector('#users').value);
  currentUser = User.findById(userId);
  userForm.style.display = 'none';
  userCreateForm.style.display = 'none';
  renderItemCreateForm();
}


function renderItemCreateForm() {
  const createForm = document.createElement("form");
  createForm.id = "creat-item-form";
  createForm.innerHTML = `
      <h3>Create a new item</h3>
      <input id="input-title" type="text" name="title" placeholder="title">
      <br><br>
      <input id="input-size" type="text" name="size" placeholder="size">
      <br><br>
      <input id="input-notes" type="text" name="notes" placeholder="notes">
      <br><br>
      <input id="create-button" type="submit" name="submit" value="Add new item"></input>
  `;
  createForm.addEventListener('submit', event => createItemFormHandler(event))
  formContainer.appendChild(createForm);
}

function createItemFormHandler(event) {
  event.preventDefault();
  const titleInput = document.querySelector("#input-title").value;
  const sizeInput = document.querySelector("#input-size").value;
  const notesInput = document.querySelector("#input-notes").value;
  createItemFetch(titleInput, sizeInput, notesInput);
}

function createItemFetch(title, size, notes) {
  const bodyData = {title, size, notes, user_id: currentUser.id}

  new Adapter(`/items`).postRequest(bodyData)
  .then(event => {
    const item = new Item(event);
    item.renderItemCard();
  })
}

