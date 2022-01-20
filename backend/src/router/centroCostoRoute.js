const express = require('express');
const router = express.Router();

const { listCentrosCostos } = require('../controllers/centroCostoController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, listCentrosCostos);

module.exports = router;