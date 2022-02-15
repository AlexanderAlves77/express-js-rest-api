class HomeController{
    async index(req, res){
        res.send("APP EXPRESS! - Fulldevstacks");
    }
}

module.exports = new HomeController();