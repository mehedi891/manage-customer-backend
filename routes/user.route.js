const { getAllUsers, createAUser, loginUser, getAUserByEmail, updateUserByEmailOrID, deleteAUser, getUsersOnlineStatus } = require('../controller/user.controller');

const router = require('express').Router();

router.get('/',getAllUsers);
router.get('/:email',getAUserByEmail);
router.get('/online/useronline',getUsersOnlineStatus);
router.put('/:emailOrId',updateUserByEmailOrID);
router.delete('/:id',deleteAUser);
router.post('/register',createAUser);
router.post('/login',loginUser);

module.exports = router;