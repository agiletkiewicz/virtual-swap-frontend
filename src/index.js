document.addEventListener('DOMContentLoaded', () => {
  fetchEvents();

  document.getElementById('create-event-form').addEventListener("submit", (event) => createEventFormHandler(event));
  document.getElementById('view-event-form').addEventListener("submit", (event) => viewEventFormHandler(event));

})

const eventContainer = document.querySelector("#event-container");
const formContainer = document.querySelector("#form-container");
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

function viewEventFormHandler(event) {
  event.preventDefault();
  const eventId = parseInt(document.querySelector('#events').value);
  const eventPin = parseInt(document.querySelector('#pin').value);
  accessEvent(eventId, eventPin);
}

function accessEvent(id, pin) {
  const bodyData = {id, pin}

  new Adapter(`/login`).postRequest(bodyData)
  .then(event => {
    renderUserSelectForm();
    renderUserCreateForm();
    renderEvent(event);
    addUsers();
  })
}

function addUsers() {
  for (const element of Item.all) {
    element.addUserToItemCard();
  }
}

function createEventFormHandler(event) {
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

  document.getElementById('create-event-form').style.display = 'none';
  document.getElementById('view-event-form').style.display = 'none';
  eventContainer.appendChild(header);
  eventContainer.appendChild(subheader);

  for(const element of event.included) {
    if (element.type === "item") {
      const newItem = new ItemFromDb(element.id, element);
      newItem.renderItemCard();
    } else if (element.type === "user") {
      const newUser = new User(element);
      let newOption = new Option(newUser.name, newUser.id);
      document.querySelector("#users").appendChild(newOption,undefined);
    } else if (element.type === "take") {
      new Take(element);
    }
  }
}


function renderUserSelectForm() {
  const createForm = document.createElement("form");
  createForm.id = "select-user-form";

  const select = document.createElement("select");
  select.name = "users";
  select.id = "users";

  const label = document.createElement("label");
  label.innerHTML = "Choose an existing user: "
  label.htmlFor = "users";

  const submit = document.createElement("input");
  submit.setAttribute('type',"submit");
  submit.setAttribute('value',"Submit");

  createForm.appendChild(label).appendChild(select);
  createForm.appendChild(submit);

  createForm.addEventListener("submit", (event) => userSelectFormHandler(event));

  formContainer.appendChild(createForm);
}

function renderUserCreateForm() {
  const createForm = document.createElement("form");
  createForm.id = "create-user-form";

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

  createForm.appendChild(label).appendChild(input);
  createForm.appendChild(submit);

  createForm.addEventListener("submit", (event) => userCreateFormHandler(event));

  formContainer.appendChild(createForm);
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
    User._current = new User(event.data);
    document.querySelector("#select-user-form").style.display = 'none';
    document.querySelector("#create-user-form").style.display = 'none';
    renderItemCreateForm();
  })
}

function userSelectFormHandler(event) {
  event.preventDefault();
  const userId = parseInt(document.querySelector('#users').value);
  User._current = User.findById(userId);
  document.querySelector("#select-user-form").style.display = 'none';
  document.querySelector("#create-user-form").style.display = 'none';
  renderItemCreateForm();
  addTakeButtons();
}

function addTakeButtons() {
  for (const element of Item.all) {
    element.addTakeToItemCard();
  }
}


function renderItemCreateForm() {
  const createForm = document.createElement("form");
  createForm.id = "create-item-form";
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
  const bodyData = {title, size, notes, user_id: User._current.id}

  new Adapter(`/items`).postRequest(bodyData)
  .then(event => {
    debugger
    const item = new ItemFromForm(event.id, event);
    item.renderItemCard();
  })
}

function editTakeFormHandler(event) {
  event.preventDefault();
}

