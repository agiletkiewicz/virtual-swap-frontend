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
    if (event.error) {
      debugger
      console.log(event.error)
    } else {
    renderUserSelectForm();
    renderUserCreateForm();
    renderEvent(event);
    }
  })
  .catch(error => console.log(error))
}

function renderEvent(event) { 
  const eventData = event.data.attributes;
  currentEventId = event.data.id

  const header = document.createElement("h1");
  header.innerText = eventData.name;
  header.classList.add("text-white");
  header.id = "shadow";
  const subheader = document.createElement("h3");
  subheader.innerHTML = `ground rules: <br> ${eventData.rules}`;
  subheader.classList.add("text-white");
  subheader.id = "shadow";
  document.querySelector("#page-title").innerText = "Create a new item"

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
      new Take(element.id, element.attributes);
    }
  }
}


function renderUserSelectForm() {
  const createForm = document.createElement("form");
  createForm.id = "select-user-form";
  createForm.classList.add("col");
  createForm.innerHTML = `
    <div class="form-group">
      <label class="text-white">Select a current user:</label>
      <select class="form-control" id="users">
      </select>
    </div>
    <button id="create-button" type="submit" class="btn btn-info">Submit</button>
  `;

  createForm.addEventListener("submit", (event) => userSelectFormHandler(event));

  formContainer.appendChild(createForm);
}


function renderUserCreateForm() {
  const createForm = document.createElement("form");
  createForm.id = "create-user-form";
  createForm.classList.add("col");

  createForm.innerHTML = ` 
    <div class="form-group">
    <label class="text-white">Create a new user:</label>
    <input type="text" class="form-control" id="input-user-name">
    </div>
    <button id="create-button" type="submit" class="btn btn-info">Submit</button>
  `;

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
    addTakeButtons();
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
  createForm.classList.add("col-md-8");
  createForm.innerHTML = `
      <h3 class="text-white">Create a new item</h3>
      <div class="form-group">
      <input class="form-control" id="input-title" type="text" name="title" placeholder="title">
      </div>
      <div class="form-group">
      <input class="form-control" id="input-image" type="text" name="image" placeholder="image url">
      </div>
      <div class="form-group">
      <input class="form-control" id="input-size" type="text" name="size" placeholder="size">
      </div>
      <div class="form-group">
      <input class="form-control" id="input-notes" type="text" name="notes" placeholder="notes">
      </div>
      <input class="btn btn-info" id="create-button" type="submit" name="submit" value="Add new item"></input>
  `;
  createForm.addEventListener('submit', event => createItemFormHandler(event))
  formContainer.appendChild(createForm);
}

function createItemFormHandler(event) {
  event.preventDefault();
  const titleInput = document.querySelector("#input-title").value;
  const sizeInput = document.querySelector("#input-size").value;
  const notesInput = document.querySelector("#input-notes").value;
  const imageInput = document.querySelector("#input-image").value;
  createItemFetch(titleInput, sizeInput, notesInput, imageInput);
}

function createItemFetch(title, size, notes, image_url) {
  const bodyData = {title, size, notes, image_url, user_id: User._current.id}

  new Adapter(`/items`).postRequest(bodyData)
  .then(event => {
    const item = new ItemFromForm(event.id, event);
    document.querySelector("#create-item-form").reset();
    item.renderItemCardFromDb();
  })
}

function editTakeFormHandler(event) {
  event.preventDefault();
  const item_id = parseInt(event.target.querySelector("#item-id").value);
  const user_id = parseInt(event.target.querySelector("#user-id").value);

  const bodyData = {item_id, user_id}
  
  if (event.target.querySelector("#take-button").value === "Taken!") {
    const take_id = parseInt(event.target.querySelector("#take-id").value);
    
      fetch(`http://localhost:3000/api/v1/takes/${take_id}`, {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      }
      })
      event.target.querySelector("#take-button").value = "Take";
      Take.deleteById(take_id);
      
  
  } else {
    new Adapter('/takes').postRequest(bodyData)
    .then(response => {
      new Take(response.id, response);
      const button = event.target.querySelector("#take-button")
      button.value = "Taken!";
      button.className = "btn btn-success";
      event.target.querySelector("#take-id").value = response.id;
    })
}
}

function deleteItemFormHandler(event) {
  const item_id = parseInt(event.target.querySelector("#item-id").value);

  fetch(`http://localhost:3000/api/v1/items/${item_id}`, {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    });
    
    document.querySelector(`[data-id="${item_id}"]`).remove();
    Item.deleteById(item_id);
}
