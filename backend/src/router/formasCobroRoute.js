const express = require('express');
const router = express.Router();

const { listFormasCobro } = require('../controllers/formasCobroController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, listFormasCobro);

module.exports = router;