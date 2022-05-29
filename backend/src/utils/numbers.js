exports.desformatNumber = (number) => {
    let newNumber = number;
    newNumber = number.toString().replace(/\./g, '');
    newNumber = newNumber.replace(/\,/g, '.');
    newNumber = parseFloat(newNumber);
    return newNumber
}