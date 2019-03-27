exports.numCom = function (id, nbCharacters) {
    let numCommande = `${id}-`
    let characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let min = 0
    let max = 36

    for (var i = 1; i <= nbCharacters; i++) {
        let a = Math.floor(Math.random() * (max - min)) + min;
        numCommande += characters[a]
    }
    return numCommande
}