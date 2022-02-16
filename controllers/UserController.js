const { userParams } = require("../database/connect")
const User = require("../models/User")

class UserController{
    async index(req, res){}

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
}

module.exports = new UserController();