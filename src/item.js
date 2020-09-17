class Item {
    constructor(id) {
        this.id = parseInt(id),
        Item.all.push(this)
    }

    findUser() {
        return User.findById(this.userId).name
    }

    renderItemCard() {  
        const cardDiv = document.createElement('div');
        cardDiv.id = "card-div";
        cardDiv.dataset.id = this.id;
        cardDiv.innerHTML += `
            <h3> ${this.title} </h3>
            <p> size: ${this.size} </p>
            <p> notes: <br> ${this.notes} </p>
        `;
        document.querySelector("#item-container").appendChild(cardDiv);
    }

    addUserToItemCard() {
        const newP = document.createElement('p');
        newP.id = "giver"
        newP.innerText = `given by: ${this.findUser()}`;
        document.querySelector(`[data-id="${this.id}"]`).appendChild(newP);
    }

    addTakeToItemCard() {
        const itemTake = Take.all.find( take => take.itemId === this.id)
        const thisCard = document.querySelector(`[data-id="${this.id}"]`);

        if (this.userId === User._current.id) {
            thisCard.querySelector("#giver").innerHTML = "My item";

        } else if (!itemTake){
            const takeForm = document.createElement("form");
            takeForm.id = "take-item-form";
            takeForm.innerHTML = `
                <input type="hidden" id="item_id" value="${this.id}">
                <input type="hidden" id="user_id" value="${User._current.id}">
                <input type="submit" value="Take item" id="take-button">
            `; 

            takeForm.addEventListener('submit', (event) => editTakeFormHandler(event)),
            thisCard.appendChild(takeForm);

        } else if (itemTake.userId === User._current.id) {
            const takeForm = document.createElement("form");
            takeForm.id = "take-item-form";
            takeForm.innerHTML = `
                <input type="hidden" id="item_id" value="${this.id}">
                <input type="hidden" id="user_id" value="${User._current.id}">
                <input type="submit" value="Item taken!" id="take-button">
            `; 

            takeForm.addEventListener('submit', (event) => destroyTakeFormHandler(event)),
            thisCard.appendChild(takeForm);
        } else {
            const newP = document.createElement('p');
            newP.innerText = `Item taken by ${User.findById(itemTake.userId).name}`;
             thisCard.appendChild(newP);
        }
    }

}

class ItemFromDb extends Item {
    constructor(id, data) {
        super(id),
        this.title = data.attributes.title,
        this.size = data.attributes.size,
        this.notes = data.attributes.notes,
        this.userId = data.attributes.user_id  
    }

    
}

class ItemFromForm extends Item {

    constructor(id, data) { 
        super(id),
        this.title = data.title,
        this.size = data.size,
        this.notes = data.notes,
        this.userId = parseInt(data.user_id)
    }

}

Item.all = []
