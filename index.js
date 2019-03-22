
//Modules utilises
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const Promise = require('bluebird')
const verify = require('./verify')
const expressSession = require('express-session')
const cookieParser = require('cookie-parser')
const port = 8090;
let session = null;

let plats =[]
let panier = []

let totalPrice = 0
let cartSize = 0

let DynInfos = { panier, totalPrice, cartSize}
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))


const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'maman'
  });



    //APPLICATION
    db.connect((err) => {
        if (!err) {
            //recuperation des donnees de base
            db.query('SELECT * FROM foods', function (error, results) {
                if (!error)
                    plats = results
                else
                    console.log(error)
        });



            //Debut routes

            app.use('/public', express.static('public'))
                .set('views', './Views')
                .set('view engine', 'ejs')
                .use(morgan('dev'))
                .use(bodyParser.json())
                .use(bodyParser.urlencoded({ extended : false }))
                .get('/', (req, res) => {
                    if (session) {
                        console.log('existe')
                        res.render('indexC', {session, pageTitle: 'Maman', DynInfos})
                    } else
                        res.render('index', {pageTitle: 'Maman', DynInfos})
                })
                .get('/diner', (req, res) => {
                    if (session)
                        res.render('dinerC', {session, pageTitle : 'Diner', DynInfos})
                    else
                        res.render('diner', {pageTitle : 'Diner', DynInfos})


                })
                .get('/pdej', (req, res) => {
                    if (session)
                        res.render('ptiDejC', {session, pageTitle: 'P\'tit Dej', DynInfos})
                    else
                        res.render('ptiDej', {pageTitle: 'P\'tit Dej', DynInfos})
                })
                .get('/dej', (req, res) => {
                    if (session)
                        res.render('dejC', {session, plats, pageTitle: 'Dejeuner', DynInfos})
                     else
                        res.render('dej', {plats, pageTitle: 'Dejeuner', DynInfos})

                })
                .get('/dessert', (req, res) => {
                    if (session)
                        res.render('dessertsC', {session, pageTitle: 'Desserts', DynInfos})
                     else
                        res.render('desserts', {pageTitle: 'Desserts', DynInfos})
                })
                .get('/boissons', (req, res) => {
                    if (session)
                        res.render('boissonsC', {session, pageTitle: 'Boissons', DynInfos})
                     else
                        res.render('boissons', {pageTitle: 'Boissons', DynInfos})
                })
                .get('/inscription', (req, res) => {
                    if (!session)
                        res.render('inscription', {pageTitle: 'Inscription', DynInfos})
                    else
                        res.render(404)
                })
                .get('/home', (req, res) => {
                    if (session)
                        res.render('infosC', {session, pageTitle: 'Mes infos', DynInfos})
                    else
                        res.redirect('/error')
                })
                .get('/connexion', (req, res) => {
                    if (session) {
                        res.redirect('/home')
                    }
                    else {
                        res.redirect('/error')
                    }
                    })
                .get('/disconnect', (res, req) => {
                    session = null
                    res.redirect('/')
                })
                .use(function(req, res, next) {
                    res.status(404).render('404');
                });

            //Fin routes

            io.on('connect', (socket) => {

                //systeme de panier backend
                socket.on('cart', (data) => {
                    let newBuy = {
                        id : '',
                        lib: '',
                        price: '',
                    }

                    let selectedId = parseInt(data.id)
                    let result = plats.find( plat => plat.id === selectedId )
                    if (result) {
                        newBuy.id = result.id
                        newBuy.lib = result.lib
                        newBuy.price = result.price
                        panier.push(newBuy)
                        totalPrice += result.price
                    }

                    cartSize = panier.length


                    console.log(totalPrice)
                    socket.emit('addToCart', {newBuy, cartSize, totalPrice});
                });

                //systeme de connexion
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
                            //console.log(r[0])
                            if(r.length >= 1) {
                                results.mail = 1
                                if (mdp === r[0].mdp) {
                                    results.mdp = 1
                                    session = r[0]
                                }
                                else  results.mdp = 2
                            }
                            else results.mail = 2

                            console.log(results)
                            socket.emit('resConnexion', results);

                        }).catch((err) => console.log(err))
                    }
                    if (results.mail !== 1) {
                    socket.emit('resConnexion', [results, 'send']);
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
                    console.log(`Resultats : ${results.mail}`)
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
                                            if (err) console.log(error)
                                        })
                            }
                            socket.emit('resInscription', results)
                        }).catch((err) => {
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
    
    
