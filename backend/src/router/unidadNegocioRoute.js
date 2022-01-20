const express = require('express');
const router = express.Router();

const { listUnidadesNegocio } = require('../controllers/unidadNegocioController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, listUnidadesNegocio);

module.exports = router;