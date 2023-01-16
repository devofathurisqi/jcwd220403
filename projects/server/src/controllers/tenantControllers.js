const database = require("../models")
const axios = require("axios")
const { sequelize } = require("../models")

module.exports = {
    CreateFastility: async (req, res) => {
        try {
            await database.facility.create(req.body)
            res.status(201).send("Fasility Created")
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    CreatePropertys: async (req, res) => {
        try {
            const { name, description } = req.body

            if (!name) {
                return res.status(401).send('Name is required')
            }
            if (!description) {
                return res.status(401).send('Description is required')
            }
            if (description.length > 500) {
                return res.status(401).send('Description is required and must be less than 500 characters')
            }
            if (!req.file) {
                return res.status(401).send("Picture is required")
            }
            const CategoryId = await database.category.findOne({
                order: [['id', 'DESC']]
            })
            const latestCategoryId = CategoryId.id

            const newProperty = await database.property.create({
                name: name,
                description: description,
                picture: req.file.filename,
                // tenant id datanya masih di tembak, menunggu login tenant
                tenantId: 1,
                categoryId: latestCategoryId
            })
            //add facilities to the property
            const latestFacility = await database.facility.findOne({
                order: [['id', 'DESC']]
            });
            const latestFacilityId = latestFacility.id;
            await database.propertyFacility.create({
                facilityId: latestFacilityId,
                propertyId: newProperty.id
            })
            res.status(200).send("propertyCreated")
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    CreateCategory: async (req, res) => {
        try {
            const { country, province, city } = req.body

            //validasi untuk country, province, city
            if (!country) throw "Country is required"
            if (!province) throw "Province is required"
            if (!city) throw "City is required"

            if (!/^[A-Z][a-zA-Z\s]*$/.test(country)) throw "Country must start with an uppercase letter"
            if (!/^[A-Z][a-zA-Z\s]*$/.test(province)) throw "Province must start with an uppercase letter"
            if (!/^[A-Z][a-zA-Z\s]*$/.test(city)) throw "City must start with an uppercase letter"


            //everything for location detail
            const address = `${city}, ${province}, ${country}`
            const API_KEY = process.env.GEOCODE_API_KEY;
            const responses = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                    address
                )}&key=${API_KEY}`
            );
            const data = responses.data;
            const location = data.results[0].geometry;
            const lat = location.lat
            const lng = location.lng
            const result = [lat, lng];
            // ---------------------------------------------------------------------------

            const response = await database.category.create({
                country: country,
                province: province,
                city: city,
                locationDetail: { type: 'Point', coordinates: result }
            })
            res.status(200).send(response)
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    createRoomData: async (req, res) => {
        try {
            const { name, description, price } = req.body
            const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

            if (!name) throw "Name is required"
            if (!description) throw "Description is required"
            if (!price) throw "Price is required"
            if (description.length > 300) throw 'Description is required and must be less than 500 characters'

            if (!req.file) {
                return res.status(401).send("Picture is required")
            }
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(401).send("Invalid file type. Only JPG, JPEG, WEBP and PNG are allowed.")
            }

            // Check file size
            if (req.file.size > 5000000) { // 5000000 bytes = 5MB
                return res.status(401).send("File size exceeds the allowed limit of 5MB.")
            }

            await database.room.create({
                name: name,
                description: description,
                price: price,
                picture: req.file.filename,
                //propertyId masih di tembak harusnya id di dapat dari tenantId yang login
                propertyId: req.params.id
                //harusnya seperti ini
                // propertyId: data.tenantId
            })
            res.status(200).send("Room created")
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    createManyImageinRoom: async (req, res) => {
        try {
            const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

            if (!req.file) {
                return res.status(401).send("Picture is required")
            }
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(401).send("Invalid file type. Only JPG, JPEG, WEBP and PNG are allowed.")
            }

            // Check file size
            if (req.file.size > 5000000) { // 5000000 bytes = 5MB
                return res.status(401).send("File size exceeds the allowed limit of 5MB.")
            }
            await database.image.create({
                name: req.file.filename,
                type: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
                //roomId masih di tembak
                roomId: req.body.roomId
            })
            res.status(200).send("More picture success!")
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    updatePictureProperty: async (req, res) => {
        try {
            if (!req.file) throw "Picture is required"
            await database.property.update({
                picture: req.file.filename
            }, {
                where: {
                    //harusnya id dari tenant yang login
                    tenantId: req.params.id
                }
            })
            res.status(200).send("Edited!")
        } catch (err) {
            console.log(err)
        }
    },
    updateNameProperty: async (req, res) => {
        try {
            const { name } = req.body
            if (!name) {
                return res.status(401).send("Name is Required")
            }
            await database.property.update({
                name: name
            }, {
                where: {
                    //harusnya id dari tenant yang login
                    tenantId: req.params.id
                }
            })
            res.status(200).send("Name edited!")
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    updateFacility: async (req, res) => {
        try {
            const { name } = req.body

            const propertyId = req.params.id
            const data = await database.property.findOne({
                where: { id: propertyId },
                include: [
                    { model: database.category },
                    {
                        model: database.facility,
                        through: { attributes: [] }
                    }
                ]
            })
            if (!name) {
                return res.status(401).send("Facility is Required")
            }
            await database.facility.update({
                name: name
            }, {
                where: {
                    //harusnya id dari tenant yang login
                    id: data.tenantId
                }
            })
            res.status(200).send("Facility updated successfully")
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    updateDescProperty: async (req, res) => {
        try {
            const { description } = req.body
            if (!description) {
                return res.status(401).send("Description is Required")
            }
            if (description.length > 500) {
                return res.status(401).send('Description is required and must be less than 500 characters')
            }
            await database.property.update({
                description: description
            }, {
                where: {
                    //harusnya dari id tenant yang login
                    //data ini masih di tembak
                    tenantId: req.params.id
                }
            })
            res.status(200).send("Description updated")
        } catch (err) {
            console.log(err)
            res.status(401).send(err)
        }
    },
    updateLocationDetail: async (req, res) => {
        try {
            const { country, province, city } = req.body

            if (!/^[A-Z][a-zA-Z\s]*$/.test(country)) throw "Country must start with an uppercase letter"
            if (!/^[A-Z][a-zA-Z\s]*$/.test(province)) throw "Province must start with an uppercase letter"
            if (!/^[A-Z][a-zA-Z\s]*$/.test(city)) throw "City must start with an uppercase letter"

            const propertyId = req.params.id
            const data = await database.property.findOne({
                where: { id: propertyId },
                include: [
                    { model: database.category },
                    {
                        model: database.facility,
                        through: { attributes: [] }
                    }
                ]
            })

            const address = `${city}, ${province}, ${country}`
            const API_KEY = process.env.GEOCODE_API_KEY;
            const responses = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                    address
                )}&key=${API_KEY}`
            );
            const dataGeocode = responses.data;
            const location = dataGeocode.results[0].geometry;
            const lat = location.lat
            const lng = location.lng
            const result = [lat, lng];

            await database.category.update({
                country: country,
                province: province,
                city: city,
                locationDetail: { type: 'Point', coordinates: result }
            }, {
                where: {
                    //harusnya id dari tenant yang login
                    id: data.tenantId
                }
            })
            res.status(200).send("Location detail updated")
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    updateRoomProperty: async (req, res) => {
        try {
            const { name, description, price } = req.body
            const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

            if (!name) throw "Name is required"
            if (!description) throw "Description is required"
            if (description.length > 300) throw 'Description is required and must be less than 500 characters'
            if(!req.file) throw "picture is required"

            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(401).send("Invalid file type. Only JPG, JPEG, WEBP and PNG are allowed.")
            }

            // Check file size
            if (req.file.size > 5000000) { // 5000000 bytes = 5MB
                return res.status(401).send("File size exceeds the allowed limit of 5MB.")
            }

            await database.room.update({
                name: name,
                description: description,
                price: price,
                picture: req.file.filename,
                //propertyId harusnya dari id tenant yang login
                propertyId: 1
            }, {
                where: {
                    id: req.params.id
                }
            })
            res.status(200).send("Rooms updated")
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    deleteAllDataProperty: async (req, res) => {
        try {
            //harusnya id di ambil dari tenantId yang sedang login
            await database.property.destroy({
                where: {
                    id: req.params.id
                }
            })
            await database.category.destroy({
                where: {
                    id: req.params.id
                }
            })
            await database.facility.destroy({
                where: {
                    id: req.params.id
                }
            })
            await database.room.destroy({
                //harusnya propertyId nanti berdasarkan propertyId yang dimana propertyId itu berdasrkan tenantId
                where: {
                    propertyId: req.params.id
                }
            })
            res.status(200).send("Property Deleted")
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    deleteDataRooms: async (req, res) => {
        try {
            await database.room.destroy({
                where: {
                    id: req.params.id
                }
            })
            res.status(201).send("rooms deleted")
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    getAllDataProperty: async (req, res) => {
        try {
            //harusnya id nya dari id tenantId yang login
            const propertyId = req.params.id
            const response = await database.property.findOne({
                where: { id: propertyId },
                include: [
                    { model: database.category },
                    {
                        model: database.facility,
                        through: { attributes: [] }
                    },
                    { model: database.room }
                ]
            })
            res.status(200).send(response)
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    getRoomPropertyById: async (req, res) => {
        try {
            const response = await database.room.findOne({
                where: {
                    id: req.params.id
                }
            })
            res.status(200).send(response)
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    getDataRoomAndImagesRoom: async (req, res) => {
        try {
            const response = await database.room.findAll({
                include: [{
                    model: database.image,
                    where: {
                        roomId: req.params.id
                    }
                }]
            })
            res.status(201).send(response)
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    deleteRoomImages: async (req, res) => {
        try {
            await database.image.destroy({
                where: {
                    id: req.params.id
                }
            })
            res.status(201).send("Deleted!")
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
    getAllPictureRoom: async (req, res) => {
        try {
            //propertyId masih di tembak
            const room = await database.room.findAll({
                where: {
                    propertyId: req.params.id
                },
                include: [{
                    model: database.image,
                    attributes: [[sequelize.col('name'), 'picture']]
                }]
            });
            const data = room.map(item => {
                return {
                    ...item.dataValues,
                    images: [{picture: item.picture}, ...item.images]
                }
            })
            res.status(200).send(data)
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }
}