class Item {

    constructor(data) {
        this.id = data.id,
        this.name = data.attributes.name,
        this.size = data.attributes.size,
        this.notes = data.attributes.notes,
        Item.all.push(this)
    }

}

Item.all = []