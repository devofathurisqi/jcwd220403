const database = require("../models")

module.exports = {
    roomSetAlvaible: async (req, res) => {
        try {
            await database.room.update({
                availability: true
            }, {
                where: {
                    id: req.params.id
                }
            })
            res.status(200).send("room alvaible")
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    roomSetDisable: async (req, res) => {
        try {
            await database.room.update({
                availability: false
            }, {
                where: {
                    id: req.params.id
                }
            })
            res.status(200).send("room disable")
        } catch (err) {
            console.log(err)
            res.status(401).send(err)
        }
    }
}