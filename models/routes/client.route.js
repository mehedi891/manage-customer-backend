const router = require('express').Router();
const {getAllClient, createAclient, getOneClientByStoreUrlOrID, updateAClient, updateAllClient, deleteAClient, getClientCount} = require('../controller/client.controller');

router.get('/',getAllClient);
router.get('/allclientcount',getClientCount);
router.post('/',createAclient);
router.get('/:idOrStore',getOneClientByStoreUrlOrID);
router.put('/:id',updateAClient);
router.put('/',updateAllClient);
router.delete('/:id',deleteAClient);



module.exports = router;