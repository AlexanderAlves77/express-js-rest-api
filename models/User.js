const knex = require("../database/connect")
const bcrypt = require("bcrypt")

class User {

    async new(name, email, password) {
        try {
            await knex.insert({name, email, password, role: 0}).table("users")
        } catch (error) {
            console.log(error)
        }        
    }
}

module.exports = new User()
