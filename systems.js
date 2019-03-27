exports.inscription = function (socket, verify, db, mysql) {
    socket.on('inscriptionData', (data) => {
        console.log(data);
        let results = {
            'name': '',
            'fname': '',
            'mail': '',
            'mdp': ''
        };
        //verification champs vides
        results.fname = (verify.required(data[0].value)) ? 1 : 0;
        results.name = (verify.required(data[1].value)) ? 1 : 0;
        results.mail = (verify.required(data[2].value)) ? 1 : 2;
        results.mdp = (verify.required(data[3].value)) ? 1 : 2;

        if (results.mail === 1) results.mail = (verify.mail(data[2].value)) ? 1 : 3
        if (results.mdp === 1) results.mdp = (data[3].value.length >= 8) ? 1 : 3
        if (results.mdp === 1) results.mdp = (data[3].value === data[4].value) ? 1 : 4
        if (results.mail === 1) {
            let p = new Promise((resolve, reject) => {
                let sql, inserts;
                sql = " SELECT * FROM users WHERE mail =?";
                inserts = [data[2].value];
                sql = mysql.format(sql, inserts);

                db.query(sql, (err, result) => {
                    resolve(result)
                })
            }).then((r) => {
                results.mail = (r.length === 1) ? 4 : 1
                if (results.mail === 1) {
                    db.query(" INSERT INTO users (name, firstname, mail, mdp) VALUES (?, ?, ?,?)",
                        [data[1].value, data[0].value, data[2].value, data[3].value],
                        function (error, results) {
                            if (error) console.log(error)
                        })
                }
                socket.emit('resInscription', results)
            }).catch((err) => {
                console.log(err)
            })
        } else
            socket.emit('resInscription', results)

    })
}

exports.connexion = function (socket, verify, db, mysql, session) {
    socket.on('connexionData', (data) => {

        let mail = data[0].value;
        let mdp = data[1].value;

        var results = {
            mail: '',
            mdp: ''
        }

        results.mail = (verify.required(mail)) ? 1 : 3

        if (results.mail === 1) results.mail = (verify.mail(mail)) ? 1 : 4

        if (results.mail === 1) {
            let verif = new Promise((resolve,reject) => {
                let sql, inserts;
                sql = " SELECT * FROM users WHERE mail =?";
                inserts = [mail];
                sql = mysql.format(sql, inserts);
                db.query(sql, (err, result) => {
                    resolve(result)
                })
            }).then((r) => {
                if(r.length >= 1) {
                    results.mail = 1
                    if (mdp === r[0].mdp) {
                        results.mdp = 1
                        session = r[0]
                    }
                    else  results.mdp = 2
                }
                else results.mail = 2

                socket.emit('resConnexion', results);

            }).catch((err) => console.log(err))
        }
        if (results.mail !== 1) {
            socket.emit('resConnexion', [results, 'send']);
        }
    })
}