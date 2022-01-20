const express = require('express');
const router = express.Router();

const { getUser, registrar, login } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken , getUser);
router.post('/login', login);
router.post('/registro', verifyToken, registrar);

module.exports = router;