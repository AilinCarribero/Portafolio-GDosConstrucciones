const { Token } = require("../../db")

exports.getTokenQRmodulos = (req, res) => {
    Token.findOne({
        where: {
            uso: 'QRmodulos'
        }
    }).then(response => {
        res.json(response);
    }).catch(err => {
        console.error(err);
        res.json(err);
        throw err;
    })
}