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
        newP.innerText = `given by: ${this.findUser()}`;
        document.querySelector(`[data-id="${this.id}"]`).appendChild(newP);
    }

}

class ItemFromDb extends Item {
    constructor(id, data) {
        super(id),
        this.title = data.attributes.title,
        this.size = data.attributes.size,
        this.notes = data.attributes.notes,
        this.userId = parseInt(data.user_id)  
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

{/* <p> notes: <br> ${this.findUser()} </p> */}