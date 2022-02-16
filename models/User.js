const knex = require("../database/connect")
const bcrypt = require("bcrypt")
const PasswordToken = require("./PasswordToken")

class User {

    async findAll() {
        try {
            const result = await knex.select(["id", "name", "email", "role"]).table("users")
            return result
        } catch (error) {
            console.log(error)
            return []
        }
    }

    async findById(id) {
        try {
            const result = await knex.select(["id", "name", "email", "role"])
                .where({ id: id}).table("users")
            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }

        } catch (error) {
            console.log(error)
            return undefined
        }
    }

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

    async findByEmail(email) {
        try {
            const result = await knex.select(["id", "name", "email", "role"]).where({ email: email }).table("users")
            
            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }

        } catch (error) {
            console.log(error)
            return false
        } 
    }

    async update(id, name, email, role) {
        const user = await this.findById(id)

        if (user !== undefined) {
            const editUser = {}

            if (email !== undefined && email !== user.email) {
                const result = await this.findEmail(email)

                if (!result) {
                    editUser.email = email
                } else {
                    return { status: false, err: "O e-mail já está cadastrado!" }
                }
            }

            if (name !== undefined && name !== user.name) {
                editUser.name = name
            }

            if (role !== undefined && role !== user.role) {
                editUser.role = role
            }

            try {
                await knex.update(editUser).where({ id: id }).table("users")
                return { status: true }
            } catch (error) {
                return { status: false, err: error }
            }
            

        } else {
            return { status: false, err: "O usuário não existe!" }
        }        
    }

    async delete(id) {
        const user = await this.findById(id)

        if (user !== undefined) {
            try {
                await knex.delete().where({ id: id }).table("users")
                return { status: true }
            } catch (error) {
                return { status: false, err: err }
            }
            
        } else {
            return { status: false, err: "O usuário não existe, portanto não pode ser deletado." }
        }
    }

    async changePassword(newPassword, id, token) {
        const salt = 10
        const hash = await bcrypt.hash(newPassword, salt)
        await knex.update({ password: hash }).where({ id: id }).table("users")
        await PasswordToken.setUsed(token)
    }
}

module.exports = new User()
