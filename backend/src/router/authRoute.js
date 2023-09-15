const express = require('express');
const router = express.Router();

const { getUser, registrar, login, editUser, deleteUser } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken , getUser);
router.get('/:id', verifyToken, deleteUser);
router.post('/login', login);
router.post('/registro', verifyToken, registrar);
router.post('/edit', verifyToken, editUser);

module.exports = router;