class Adapter {
    constructor(path) {
        this.path = "http://localhost:3000/api/v1" + path
    }

    getRequest() {
        return fetch(this.path).then(res => res.json())
    }

    postRequest(bodyData) {
        
        const configObj = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(bodyData)
        }

        return fetch(this.path, configObj).then(res => res.json())
    } 

    deleteRequest() {
        
        const configObj = {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        }

        return fetch(this.path, configObj).then(res => res.json())
    }

}