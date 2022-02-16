const knex = require("../database/connect")
const bcrypt = require("bcrypt")

class User {

    async new(name, email, password) {        
        try {
            const salt = 10
            const hash = await bcrypt.hash(password, salt)

            await knex.insert({name, email, password: hash, role: 0})
                .table("users")
        } catch (error) {
            console.log(error)
        }        
    }

    async findEmail(email) {
        try {
            const result = await knex.select("*").from("users").where({ email: email })
            
            if (result.length > 0) {
                return true
            } else {
                return false
            }
            
        } catch (error) {
            console.log(error)
            return false
        }        
    }
}

module.exports = new User()
