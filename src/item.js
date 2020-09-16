// class Item {
//     constructor(data) {
            // this.id = parseInt(data.id),
            // this.title = data.attributes.title,
            // this.size = data.attributes.size,
            // this.notes = data.attributes.notes,
            // this.userId = data.relationships.user.data.id,
            // Item.all.push(this)
//     }

//     // findUser() {
//     //     return User.findById(this.userId).name
//     // }

//     renderItemCard() {
//         const cardDiv = document.createElement('div');
//         cardDiv.id = "card-div";
//         cardDiv.dataset.id = this.id;
//         cardDiv.innerHTML += `
//             <h3> ${this.title} </h3>
//             <p> size: ${this.size} </p>
//             <p> notes: <br> ${this.notes} </p>
            
//         `;
//         document.querySelector("#item-container").appendChild(cardDiv);
//     }

// }

class ItemFromDb {
    constructor(data) {
        this.id = parseInt(data.id),
        this.title = data.attributes.title,
        this.size = data.attributes.size,
        this.notes = data.attributes.notes,
        this.userId = data.relationships.user.data.id,
        Item.all.push(this)
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
    
}

class ItemFromForm {

    constructor(data) {
        this.id = parseInt(data.id),
        this.title = data.title,
        this.size = data.size,
        this.notes = data.notes,
        this.userId = data.user_id,
        Item.all.push(this)
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
}

Item.all = []