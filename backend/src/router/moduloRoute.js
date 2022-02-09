const express = require('express');
const router = express.Router();

const { insertModulo, listModulos } = require('../controllers/moduloController');
const { verifyToken } = require('../middlewares/authVerify');

router.post('/insert', verifyToken, insertModulo );
router.get('/', verifyToken, listModulos);

module.exports = router;