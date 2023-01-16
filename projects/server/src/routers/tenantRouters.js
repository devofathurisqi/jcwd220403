const router = require('express').Router();

const { tenantControllers } = require('../controllers');
const { multerUpload } = require("../middlewares/multerProperty")
const { roomUpload } = require("../middlewares/multerRoom")

router.get('/', (req, res) => {
  res.status(200).send('home');
});

//post
router.post('/api/betenant', tenantControllers.CreateFastility);
router.post('/api/category', tenantControllers.CreateCategory);
router.post('/api/properties', multerUpload.single('file'), tenantControllers.CreatePropertys)
router.post('/api/room/:id', roomUpload.single('file'), tenantControllers.createRoomData);
router.post('/api/addmanyimageroom', roomUpload.single('file'), tenantControllers.createManyImageinRoom);

//get data
router.get('/api/property/:id', tenantControllers.getAllDataProperty);
router.get('/api/roombyid/:id', tenantControllers.getRoomPropertyById);
router.get('/api/roomimages/:id', tenantControllers.getDataRoomAndImagesRoom);
router.get('/api/getallpictureroom/:id', tenantControllers.getAllPictureRoom)

//update
router.patch('/api/editpicture/:id', multerUpload.single('file'), tenantControllers.updatePictureProperty);
router.patch('/api/editname/:id', tenantControllers.updateNameProperty);
router.patch('/api/editfacility/:id', tenantControllers.updateFacility);
router.patch('/api/editdescription/:id', tenantControllers.updateDescProperty);
router.patch('/api/editlocation/:id', tenantControllers.updateLocationDetail);
router.patch('/api/editroom/:id',roomUpload.single('file'), tenantControllers.updateRoomProperty);

//delete all data property
router.delete('/api/deleteproperty/:id', tenantControllers.deleteAllDataProperty);
router.delete('/api/deleteroom/:id', tenantControllers.deleteDataRooms);
router.delete('/api/deleteroomimage/:id', tenantControllers.deleteRoomImages);

module.exports = router;
