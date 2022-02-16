const { userParams } = require("../database/connect")
const User = require("../models/User")

class UserController{
    async index(req, res){
        const users = await User.findAll()
        res.json(users)
    }

    async findUser(req, res) {
        const id = req.params.id 
        const user = await User.findById(id)

        if (user === undefined) {
            res.status(404)
            res.json({ err: "O usuário não foi encontrado!" })
        } else {
            res.json(user)
        }
    }

    async create(req, res) {
        const { name, email, password } = req.body

        if (name === "" || name === " " || name === undefined) {
            res.status(400)
            res.json({ err: "O nome é inválido!" })
            return
        } 

        if (email === "" || email === " " || email === undefined) {
            res.status(400)
            res.json({ err: "O e-mail é inválido!" })
            return
        } 

        if (password === "" || password === " " || password === undefined) {
            res.status(400)
            res.json({ err: "Não pode cadastrar sem uma senha!" })
            return
        }
        
        const emailExists = await User.findEmail(email)

        if (emailExists) {
            res.status(406)
            res.json({ err: "O e-mail já está cadastrado" })
            return 
        }       

        await User.new(name, email, password)

        res.status(200)
        res.send("Tudo OK!")
    }

    async edit(req, res) {
        const { id, name, email, role } = req.body 
        const result = await User.update(id, name, email, role)

        if (result !== undefined) {
            if (result.status) {
                res.status(200)
                res.send("Por Aqui, Tudo OK!")
            } else {
                res.status(406)
                res.send(result.err)
            }
        } else {
            res.status(406)
            res.send("Ocorreu um erro no servidor!")
        }     
    }

    async remove(req, res) {
        const id = req.params.id 
        const result = await User.delete(id)

        if (result.status) {
            res.status(200)
            res.send("Usuário deletado!")
        } else {
            res.status(406)
            res.send(result.err)
        }
    }
}

module.exports = new UserController();