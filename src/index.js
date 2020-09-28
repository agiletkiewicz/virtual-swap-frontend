document.addEventListener('DOMContentLoaded', () => {
  fetchEvents();

  document.getElementById('create-event-form').addEventListener("submit", (event) => createEventFormHandler(event));
  document.getElementById('view-event-form').addEventListener("submit", (event) => viewEventFormHandler(event));

})

let currentEventId

function fetchEvents() {
  new Adapter('/events').getRequest()
  .then(parsedResponse => {
    addEventsToForm(parsedResponse)
  })
  .catch(error => {
    console.error(error);
    document.querySelector("#get-event-error").innerText = "Events failed to load. Try refreshing the page.";
  })
  
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
    if (event.message) {
      const error = document.querySelector("#get-event-error");
      error.innerText = event.message;
    } else {
    renderUserSelectForm();
    renderUserCreateForm();
    renderEvent(event);
    addUsers();
    }
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
    if (event.errors) {
      const error = document.querySelector("#create-event-error");
      error.innerText = ""
      console.log(event.errors);
      for (const element of event.errors) {
        error.innerText += element;
        const br = document.createElement('br');
        error.appendChild(br);
      }
    } else {
    renderUserSelectForm();
    renderUserCreateForm();
    renderEvent(event);
    }
  })
  .catch(error => {
    console.log(error);
    document.querySelector("#create-event-error").innerText = "Something went wrong. Please try again." 
  });
}

function renderEvent(event) { 
  const eventData = event.data.attributes;
  const eventContainer = document.querySelector("#event-container");
  currentEventId = event.data.id

  const header = document.createElement("h1");
  header.innerText = eventData.name;
  header.classList.add("text-white");
  header.id = "shadow";
  const subheader = document.createElement("h3");
  subheader.innerHTML = `ground rules: <br> ${eventData.rules}`;
  subheader.classList.add("text-white");
  subheader.id = "shadow";
  document.querySelector("#page-title").innerText = "Select a user"

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

  document.querySelector("#form-container").appendChild(createForm);
}


function renderUserCreateForm() {
  const createForm = document.createElement("form");
  createForm.id = "create-user-form";
  createForm.classList.add("col");

  createForm.innerHTML = ` 
    <div class="form-group">
    <label class="text-white">Create a new user:</label>
    <p id ="create-user-error" class="text-danger"></p>
    <input type="text" class="form-control" id="input-user-name">
    </div>
    <button id="create-button" type="submit" class="btn btn-info">Submit</button>
  `;

  createForm.addEventListener("submit", (event) => userCreateFormHandler(event));

  document.querySelector("#form-container").appendChild(createForm);
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
    if (event.errors) {
      const error = document.querySelector("#create-user-error");
      error.innerText = ""
      for (const element of event.errors) {
        error.innerText += element;
        const br = document.createElement('br');
        error.appendChild(br);
      }
    } else {
    User._current = new User(event.data);
    document.querySelector("#select-user-form").style.display = 'none';
    document.querySelector("#create-user-form").style.display = 'none';
    renderItemCreateForm();
    addTakeButtons();
    document.querySelector("#page-title").innerText = "Add a new item";
    }
  })
  .catch(error => {
    console.error(error);
    document.querySelector("#create-user-error").innerText = "Something went wrong. Please try again.";
  });
  
}

function userSelectFormHandler(event) {
  event.preventDefault();
  const userId = parseInt(document.querySelector('#users').value);
  User._current = User.findById(userId);
  document.querySelector("#select-user-form").style.display = 'none';
  document.querySelector("#create-user-form").style.display = 'none';
  renderItemCreateForm();
  addTakeButtons();
  document.querySelector("#page-title").innerText = "Add a new item";
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
      <h3 class="text-white">Add a new item</h3>
      <p id ="create-item-error" class="text-danger"></p>
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
  document.querySelector("#form-container").appendChild(createForm);
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
    if (event.errors) {
      const error = document.querySelector("#create-item-error");
      error.innerText = ""
      for (const element of event.errors) {
        error.innerText += element;
        const br = document.createElement('br');
        error.appendChild(br);
      }
    } else {
    const item = new ItemFromForm(event.id, event);
    document.querySelector("#create-item-form").reset();
    item.renderItemCardFromDb();
    }
  })
  .catch(error => {
    console.error(error);
    document.querySelector("#create-item-error").innerText = "Something went wrong. Please try again.";
  })
}

function editTakeFormHandler(event) {
  event.preventDefault();
  const item_id = parseInt(event.target.querySelector("#item-id").value);
  const user_id = parseInt(event.target.querySelector("#user-id").value);

  const bodyData = {item_id, user_id}
  
  if (event.target.querySelector("#take-button").value === "Taken!") {
    const take_id = parseInt(event.target.querySelector("#take-id").value);

      new Adapter(`/takes/${take_id}`).deleteRequest()
      .then((obj) => {
        const button = event.target.querySelector("#take-button"); 
        button.value = "Take";
        button.className = "btn btn-sm btn-outline-secondary";
        Take.deleteById(take_id);
      })
      .catch(error => console.error(error))

    } else {

    new Adapter('/takes').postRequest(bodyData)
    .then(response => {
      new Take(response.id, response);
      const button = event.target.querySelector("#take-button")
      button.value = "Taken!";
      button.className = "btn btn-success";
      event.target.querySelector("#take-id").value = response.id;
    })
    .catch(error => {
      console.error(error);
    })
    
}
}

function deleteItemFormHandler(event) {
  event.preventDefault();
  const item_id = parseInt(event.target.querySelector("#item-id").value);

  new Adapter(`/items/${item_id}`).deleteRequest()
    .then((obj) => {
      document.querySelector(`[data-id="${item_id}"]`).remove();
      Item.deleteById(item_id);
      console.log(obj);
    })
    .catch(error => {
      console.error(error);
    })

}
