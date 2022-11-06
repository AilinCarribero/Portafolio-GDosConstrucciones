const generator = require('generate-password');
const { Token } = require('../../db');

exports.createToken = () => {
    const token = generator.generate({
        length: 10,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true,
        exclude:"~¬"
    });

    Token.update({token: token}, {
        where: {
            uso: 'QRmodulos'
        }
    }).then(res => {
        console.log('Se actualizó el token correctamente');
    }).catch(err => {
        console.error(err);
    })
}