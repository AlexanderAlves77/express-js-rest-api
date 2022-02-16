const jwt = require("jsonwebtoken")
require('dotenv').config()
const secret = "wa7752!kvner346@kngr#nn346$m3n%52aw&mkn677"

module.exports = function(req, res, next) {
    const authToken = req.headers['authorization']

    if (authToken !== undefined) {
        const bearer = authToken.split(" ")
        const token = bearer[1]

        try {
            const decoded = jwt.verify(token, secret)

            if(decoded.role === 1) {
                next()
            } else {
                res.status(404)
                res.send("Você não têm permissão prosseguir!")
                return
            }
            
        } catch (error) {
            res.status(404)
            res.send("Você não está autenticado")
            return
        }
        

    } else {
        res.status(404)
        res.send("Você não está autenticado")
        return
    }    
}