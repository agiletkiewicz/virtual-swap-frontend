class User {

    constructor(data) {
        this.id = data.id,
        this.name = data.attributes.name,
        User.all.push(this)
    }

}

User.all = []