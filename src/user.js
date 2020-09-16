class User {

    constructor(data) {
        this.id = parseInt(data.id),
        this.name = data.attributes.name,
        User.all.push(this)
    }

    static findById(id) {
        return this.all.find( user => user.id === id );
    }

}

User.all = []