const database = require("../models")
const { Op, Sequelize } = require("sequelize");

module.exports = {
    landingPage: async (req, res) => {
        const {lokasi, state} = req.body
        try{
            const response = await database.property.findAll({
                attributes: ['id', 'name', 'description', 'picture'],
                include: [
                    { 
                        model: database.room,
                        attributes: ['price', 'picture', 'availability', 'propertyId'],
                        include: [
                            { 
                                model: database.transaction,
                                required: false,
                                attributes: ['id'],
                                where: {
                                    [Op.or] : [
                                        {
                                            [Op.and]: [
                                                {
                                                    checkIn: {[Op.lte]: state ? state[0].startDate : new Date()},
                                                    checkOut: {[Op.gte]: state ? state[0].endDate : new Date()},
                                                    transactionStatus: {[Op.notIn]: ['Dibatalkan', 'Gagal']}
                                                }
                                            ]
                                        },
                                        {
                                            [Op.and]: [
                                                {
                                                    checkIn: {[Op.lte]: state ? state[0].endDate : new Date()},
                                                    checkOut: {[Op.gte]: state ? state[0].startDate : new Date()},
                                                    transactionStatus: {[Op.notIn]: ['Dibatalkan', 'Gagal']}
                                                }
                                            ]
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    { 
                        attributes: ['city', 'province', 'country'],
                        model: database.category,
                        where: { city: lokasi ? lokasi : {[Op.not]: null} },
                    }, 
                    {
                        model: database.propertypicture,
                        attributes: [[Sequelize.col('name'),'picture']]
                    },
                    { 
                        model: database.facility,
                        through: 'property_facility',
                        as: 'facilities'
                    },
                ],
                order: [
                    // ['id', 'ASC'],
                    ['rooms','price', 'ASC'],
                ],
                having: [
                    {
                        [Op.and]: [
                            {
                                'rooms.transactions.id': null,
                                // 'rooms.availability': true
                            }
                        ]
                    }
                ],
            })
            
            const data = response.map(item => {
                const newData = { ...item.dataValues, propertypictures: [{ picture: item.picture }, ...item.propertypictures] }
                delete newData.picture;
                return newData;
            });
            res.status(201).send(data)
        }catch(err){
            console.log(err)
            res.status(404).send(err)
        }
    },
    getById: async (req, res) => {
        try {
            const {lokasi, state} = req.body

            const response = await database.property.findOne({
                include: [
                    { 
                        model: database.room,
                        where: { propertyId: req.params.id },
                        include: [
                            { 
                                model: database.transaction,
                                required: false,
                                where: {
                                    [Op.or] : [
                                        {
                                            [Op.and]: [
                                                {
                                                    checkIn: {[Op.lte]: state ? state[0].startDate : new Date()},
                                                    checkOut: {[Op.gte]: state ? state[0].endDate : new Date()},
                                                    transactionStatus: {[Op.notIn]: ['Dibatalkan', 'Gagal']}
                                                }
                                            ]
                                        },
                                        {
                                            [Op.and]: [
                                                {
                                                    checkIn: {[Op.lte]: state ? state[0].endDate : new Date()},
                                                    checkOut: {[Op.gte]: state ? state[0].startDate : new Date()},
                                                    transactionStatus: {[Op.notIn]: ['Dibatalkan', 'Gagal']}
                                                }
                                            ]
                                        },
                                    ],
                                },
                            },
                            {
                                model: database.image,
                            }
                        ] 
                    },
                    {
                        model: database.propertypicture,
                        attributes: [[Sequelize.col('name'),'picture']]
                    },
                    { 
                        model: database.tenant,
                        include: [
                            {
                                model: database.user,
                                attributes: ["fullName", "photo"], 
                            }
                        ]  
                    },
                    {
                        model:database.category
                    }
                ]
            })
            
            res.status(200).send(response)
        } catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    },
}