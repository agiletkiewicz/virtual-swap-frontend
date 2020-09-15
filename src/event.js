class Event {

    constructor(data) {
        this.id = data.id,
        this.name = data.attributes.name,
        this.rules = data.attributes.rules,
        Event.all.push(this)
    }

}

Event.all = []