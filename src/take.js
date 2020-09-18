class Take {

    constructor(id, data) {
        this.id = id;
        this.itemId = data.item_id,
        this.userId = data.user_id,
        Take.all.push(this)
    }

    static deleteById(id) {
        const index = this.all.findIndex( take => take.id === id );
        this.all.splice(index, 1);
    }

}

Take.all = []