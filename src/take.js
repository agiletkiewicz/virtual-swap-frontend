class Take {

    constructor(data) {
        this.itemId = data.attributes.item_id,
        this.userId = data.attributes.user_id,
        Take.all.push(this)
    }

}

Take.all = []