class Item {

    constructor(data) {
        this.id = data.id,
        this.title = data.attributes.title,
        this.size = data.attributes.size,
        this.notes = data.attributes.notes,
        Item.all.push(this)
    }

    createItemCard() {
        const cardDiv = document.createElement('div');
        cardDiv.id = "card-div";
        cardDiv.dataset.id = this.id;
        cardDiv.innerHTML += `
            <h3> ${this.title} </h3>
            <h4> ${this.size} </h4>
            <h4> ${this.notes} </h4>
        `;
        document.querySelector("#item-container").appendChild(cardDiv);
    }

}

Item.all = []