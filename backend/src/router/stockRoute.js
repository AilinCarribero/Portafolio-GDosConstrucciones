const express = require('express');
const router = express.Router();

const {  } = require('../controllers/');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, );
router.get('/', verifyToken, );

module.exports = router;