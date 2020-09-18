class Take {

    constructor(id, data) {
        this.id = id;
        this.itemId = data.item_id,
        this.userId = data.user_id,
        Take.all.push(this)
    }

}

Take.all = []