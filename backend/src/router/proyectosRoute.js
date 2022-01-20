const express = require('express');
const router = express.Router();

const { listProyectos, insertProyecto } = require('../controllers/proyectosController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, listProyectos );
router.post('/insert', verifyToken, insertProyecto);

module.exports = router;