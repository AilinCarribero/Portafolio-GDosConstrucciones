const express = require('express');
const router = express.Router();

const { listFormasPago } = require('../controllers/formasPagosController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, listFormasPago);

module.exports = router;