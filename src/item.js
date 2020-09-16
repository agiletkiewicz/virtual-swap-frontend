class Item {

    constructor(data) {
        this.id = parseInt(data.id),
        this.title = data.attributes.title,
        this.size = data.attributes.size,
        this.notes = data.attributes.notes,
        this.userId = data.attributes.user_id,
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
            <p> given by: ${this.findUser()} </p>
        `;
        document.querySelector("#item-container").appendChild(cardDiv);
    }

}

Item.all = []