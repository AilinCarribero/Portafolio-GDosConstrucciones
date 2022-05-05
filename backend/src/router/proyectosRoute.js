const express = require('express');
const router = express.Router();

const { listProyectos, insertProyecto, updateProyecto, deleteProyecto } = require('../controllers/proyectosController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, listProyectos );
router.post('/insert', verifyToken, insertProyecto);
router.post('/update', verifyToken, updateProyecto);
router.post('/delete/:id', verifyToken, deleteProyecto);

module.exports = router;