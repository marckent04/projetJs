
//Modules utilises
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const mysql = require('mysql');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Promise = require('bluebird');
const verify = require('./verify');

const port = 8090;

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'maman'
  });

app.use('/public', express.static('public'));
app.set('views', './Views');
app.set('view engine', 'ejs');

app.use(morgan('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended : false }));
        
    //APPLICATION
    db.connect((err) => {
        if (!err) {
            //Debut routes
            app.get('/', (req, res) => {
                res.render('index', {pageTitle: 'Maman'});
            })
                .get('/diner', (req, res) => {
                    res.render('diner', {pageTitle: 'Diner'});
                })
                .get('/pdej', (req, res) => {
                    res.render('ptidej', {pageTitle: 'P\'tit Dej'});
                })
                .get('/dej', (req, res) => {
                    res.render('dej', {pageTitle: 'Dejeunr'});
                })
                .get('/dessert', (req, res) => {
                    res.render('desserts', {pageTitle: 'Desserts'});
                })
                .get('/boissons', (req, res) => {
                    res.render('boissons', {pageTitle: 'Boissons'});
                })
                .get('/inscription', (req, res) => {
                    res.render('inscription', {pageTitle: 'Inscription'})
                })
                .get('/newUser', (res, req) => {
                    res.render('welcome')
                })
            //Fin routes

            io.on('connect', (socket) => {
                socket.on('rochel', (data) => {
                    console.log(data);
                    socket.emit('ryu', data);
                });

                //systeme de connexion
                socket.on('connexionData', (data) => {

                    let mail = data[0].value;
                    let mdp = data[1].value;

                    var results = {
                        mail: '',
                        mdp: ''
                    }
                    //console.log('debut mail' + mailR);
                    //console.log('debut' + mdpR);
                    results.mail = (verify.required(mail)) ? 1 : 3

                    if (results.mail === 1) results.mail = (verify.mail(mail)) ? 1 : 4

                    if (results.mail === 1) {
                        console.log('entrer')
                        let verif = new Promise((resolve,reject) => {
                            let sql, inserts;
                            sql = " SELECT * FROM users WHERE mail =?";
                            inserts = [mail];
                            sql = mysql.format(sql, inserts);
                            db.query(sql, (err, result) => {
                                resolve(result)
                            })
                        }).then((r) => {
                            console.log(r)
                            if(r.length >= 1) {
                                results.mail = 1
                                if (mdp === r[0].mdp) results.mdp = 1
                                else  results.mdp = 2
                            }
                            else results.mail = 2

                            console.log(results)
                            socket.emit('resConnexion', results);
                        }).catch((err) => console.log(err))
                    }
                    console.log('fin : ' + results.mail)
                    if (results.mail !== 1) {
                    socket.emit('resConnexion', results);
                    }
                });

                //systeme d'inscription
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
                    console.log(results.mail)
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
                            console.log(r)
                            results.mail = (r.length > 0) ? 4 : 1
                            if (results.mail === 1) {
                                db.query(" INSERT INTO users (name, firstname, mail, mdp) VALUES (?, ?, ?,?)",
                                    [data[1].value, data[0].value, data[2].value, data[3].value],
                                    function (error, results) {
                                            if (err) console.log(error)
                                            else console.log(results)
                                        })
                            }}

                        ).catch((err) => {
                            console.log(err)
                        })
                    } else
                        socket.emit('resInscription', results)

                })
                //Fin systeme d'inscription
            })
        } else {
            console.log(err.message);
        }
        http.listen(port, () => console.log('started'));
});
    
    
