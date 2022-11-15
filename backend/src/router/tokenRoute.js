const express = require('express');
const router = express.Router();

const { getTokenQRmodulos } = require('../controllers/tokenController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/qr/modulos', verifyToken, getTokenQRmodulos);

module.exports = router;