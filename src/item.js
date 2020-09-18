class Item {
    constructor(id) {
        this.id = parseInt(id),
        Item.all.push(this)
    }

    findUser() {
        return User.findById(this.userId).name
    }

    static deleteById(id) {
        const index = this.all.findIndex( item => item.id === id );
        this.all.splice(index, 1);
    }

    // renderItemCard() {  
    //     const cardDiv = document.createElement('div');
    //     cardDiv.id = "card-div";
    //     cardDiv.dataset.id = this.id;
    //     cardDiv.innerHTML += `
    //         <h3> ${this.title} </h3>
    //         <img src="${this.image_url}" width=20% height=auto>
    //         <p> size: ${this.size} </p>
    //         <p> notes: <br> ${this.notes} </p>
    //     `;
    //     document.querySelector("#item-container").appendChild(cardDiv);
    // }

    renderItemCard() {  
        const cardDiv = document.createElement('div');
        cardDiv.id = "card-div";
        cardDiv.classList.add("col-md-4");
        cardDiv.dataset.id = this.id;
        cardDiv.innerHTML += `
            <div class="card mb-4 shadow-sm">
                <img src="${this.image_url}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class ="card-title">${this.title}</h5>
                <p class="card-text">size: ${this.size} <br> notes: ${this.notes}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                    </div>
                    <small id="giver" class="text-muted"></small>
                </div>
                </div>
            </div>
        `;
        document.querySelector("#item-container").appendChild(cardDiv);
    }

    // addUserToItemCard() {
    //     const newP = document.createElement('p');
    //     newP.id = "giver"
    //     newP.innerText = `given by: ${this.findUser()}`;
    //     document.querySelector(`[data-id="${this.id}"]`).appendChild(newP);
    // }
    addUserToItemCard() {
        const cardDiv = document.querySelector(`[data-id="${this.id}"]`);
        cardDiv.querySelector("#giver").innerText = `given by: ${this.findUser()}`;
    }

    // addTakeToItemCard() {
    //     const itemTake = Take.all.find( take => take.itemId === this.id)
    //     const thisCard = document.querySelector(`[data-id="${this.id}"]`);

    //     if (this.userId === User._current.id) {
    //         thisCard.querySelector("#giver").innerHTML = "My item";
    //         const deleteForm = document.createElement("form");
    //         deleteForm.id = "delete-item-form";
    //         deleteForm.innerHTML = `
    //             <input type="hidden" id="item-id" value="${this.id}">
    //             <input type="submit" value="Delete this item" id="delete-item-button">
    //         `; 

    //         deleteForm.addEventListener('submit', (event) => deleteItemFormHandler(event)),
    //         thisCard.appendChild(deleteForm);

    //     } else if (!itemTake){
    //         const takeForm = document.createElement("form");
    //         takeForm.id = "take-item-form";
    //         takeForm.innerHTML = `
    //             <input type="hidden" id="item-id" value="${this.id}">
    //             <input type="hidden" id="take-id" value="0">
    //             <input type="hidden" id="user-id" value="${User._current.id}">
    //             <input type="submit" value="Take item" id="take-button">
    //         `; 

    //         takeForm.addEventListener('submit', (event) => editTakeFormHandler(event)),
    //         thisCard.appendChild(takeForm);

    //     } else if (itemTake.userId === User._current.id) {
    //         const takeForm = document.createElement("form");
    //         takeForm.id = "take-item-form";
    //         takeForm.innerHTML = `
    //             <input type="hidden" id="item-id" value="${this.id}">
    //             <input type="hidden" id="take-id" value="${itemTake.id}">
    //             <input type="hidden" id="user-id" value="${User._current.id}">
    //             <input type="submit" value="Taken!" id="take-button">
    //         `; 

    //         takeForm.addEventListener('submit', (event) => editTakeFormHandler(event)),
    //         thisCard.appendChild(takeForm);
    //     } else {
    //         const newP = document.createElement('p');
    //         newP.innerText = `Item taken by ${User.findById(itemTake.userId).name}`;
    //          thisCard.appendChild(newP);
    //     }
    // }

    addTakeToItemCard() {
        const itemTake = Take.all.find( take => take.itemId === this.id)
        const thisCard = document.querySelector(`[data-id="${this.id}"]`);
        const button = thisCard.querySelector(".btn-group");

        if (this.userId === User._current.id) {
            thisCard.querySelector("#giver").innerHTML = "My item";
            const deleteForm = document.createElement("form");
            deleteForm.id = "delete-item-form";
            deleteForm.innerHTML = `
                <input type="hidden" id="item-id" value="${this.id}">
                <input class="btn btn-sm btn-outline-secondary" type="submit" value="Delete" id="delete-item-button">
            `; 

            deleteForm.addEventListener('submit', (event) => deleteItemFormHandler(event)),
            button.appendChild(deleteForm);

        } else if (!itemTake){
            const takeForm = document.createElement("form");
            takeForm.id = "take-item-form";
            takeForm.innerHTML = `
                <input type="hidden" id="item-id" value="${this.id}">
                <input type="hidden" id="take-id" value="0">
                <input type="hidden" id="user-id" value="${User._current.id}">
                <input class="btn btn-sm btn-outline-secondary" type="submit" value="Take" id="take-button">
            `; 

            takeForm.addEventListener('submit', (event) => editTakeFormHandler(event)),
            button.appendChild(takeForm);

        } else if (itemTake.userId === User._current.id) {
            const takeForm = document.createElement("form");
            takeForm.id = "take-item-form";
            takeForm.innerHTML = `
                <input type="hidden" id="item-id" value="${this.id}">
                <input type="hidden" id="take-id" value="${itemTake.id}">
                <input type="hidden" id="user-id" value="${User._current.id}">
                <input class="btn btn-sm btn-outline-secondary" type="submit" value="Taken!" id="take-button">
            `; 

            takeForm.addEventListener('submit', (event) => editTakeFormHandler(event)),
            button.appendChild(takeForm);
        } else {
            const newButton = document.createElement('button');
            newButton.innerText = `Item taken by ${User.findById(itemTake.userId).name}`;
            newButton.classList.add("btn btn-sm btn-outline-secondary")
            button.appendChild(newButton);
        }
    }

}

class ItemFromDb extends Item {
    constructor(id, data) {
        super(id),
        this.title = data.attributes.title,
        this.size = data.attributes.size,
        this.notes = data.attributes.notes,
        this.image_url = data.attributes.image_url,
        this.userId = data.attributes.user_id  
    }

    
}

class ItemFromForm extends Item {

    constructor(id, data) { 
        super(id),
        this.title = data.title,
        this.size = data.size,
        this.notes = data.notes,
        this.image_url = data.image_url,
        this.userId = parseInt(data.user_id)
    }

    renderItemCardFromDb() {  
        const cardDiv = document.createElement('div');
        cardDiv.id = "card-div";
        cardDiv.dataset.id = this.id;
        cardDiv.classList.add("col-md-4");

        cardDiv.innerHTML += `
            <div class="card mb-4 shadow-sm">
                <img src="${this.image_url}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class ="card-title">${this.title}</h5>
                <p class="card-text">size: ${this.size} <br> notes: ${this.notes}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                    </div>
                    <small id="giver" class="text-muted">My item</small>
                </div>
                </div>
            </div>
        `;
        document.querySelector("#item-container").appendChild(cardDiv);

        const deleteForm = document.createElement("form");
        deleteForm.id = "delete-item-form";
        deleteForm.innerHTML = `
            <input type="hidden" id="item-id" value="${this.id}">
            <input class="btn btn-sm btn-outline-secondary" type="submit" value="Delete" id="delete-item-button">
        `; 

        deleteForm.addEventListener('submit', (event) => deleteItemFormHandler(event));
        const button = cardDiv.querySelector(".btn-group");
        button.appendChild(deleteForm);
    }

}

Item.all = []
