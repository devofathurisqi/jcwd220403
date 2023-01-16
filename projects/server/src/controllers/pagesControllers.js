const database = require("../models")

module.exports = {
    landingPage: async (req, res) => {
        try{
            const response = await database.property.findAll()
            res.status(201).send(response)
        }catch(err){
            console.log(err)
            res.status(404).send(err)
        }
    }
}