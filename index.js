
//Modules utilises
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const verify = require('./verify')
const crypto = require('crypto')
const generator = require('./generator')
const multer = require('multer')
const path = require('path')

const port = 8090
let session = null
let plats =[]
let panier = []
let prices = [0, 0]

let DynInfos = { panier, prices}



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

            //upload
    const storage = multer.diskStorage({
          destination: './public/pp/',
          filename: function(req, file, cb){
            // notre fonction  callback permet de formater le nom de notre fichier enregistrer
            // de cette faxon leNomduChamp13315431.jpg par exemple
            cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
          }
    })

    const upload = multer({
      storage : storage,
      // storage Via multer je veus stocker mes info 
      storalimits:{fileSize: 5000000},
      //  la taille maximal du fichier
      fileFilter: function(req, file, cb){
        VerifycheckFileType(file, cb);
        // VerifycheckFileType permet de verifier si tout va bien si l'extension est un /jpeg|jpg|png|gif/ sinon on affiche l'erreur 
      } 
    }).single('myImage')

//fin upload
            //Debut routes

            app.set('views', './Views').set('view engine', 'ejs')
            
            app.use(compression())
                .use('/public', express.static('public'))
                .use(morgan('dev'))
                .use(bodyParser.json())
                .use(bodyParser.urlencoded({ extended : false }));

                db.query('SELECT * FROM foods', function (error, results) {
                        if (!error)
                            plats = results
                        else
                            console.log(error)
                })
                app.get('/', (req, res) => {
                    
                        if (session) {
                            let requete = 'SELECT * FROM foods INNER JOIN commandes ON foods.id = commandes.idFood AND client = ? ORDER BY commandes.num DESC LIMIT 10'
                            db.query(requete, [session.id], (err, result) => {
                                if (!err) {
                                    let history = result
                                    res.render('indexC', {session, pageTitle: 'Maman', DynInfos, history})
                                }
                                else
                                    console.log(err.message)

                            })
                        } else
                            res.render('index', {pageTitle: 'Maman', DynInfos, plats})

                 })
                    .get('/diner', (req, res) => {
                        if (session)
                            res.render('dinerC', {session,plats, pageTitle : 'Diner', DynInfos})
                        else
                            res.render('diner', {pageTitle : 'Diner',plats, DynInfos})
                    })
                    .get('/pdej', (req, res) => {
                        if (session)
                            res.render('ptiDejC', {session,plats, pageTitle: 'P\'tit Dej', DynInfos})
                        else
                            res.render('ptiDej', {pageTitle: 'P\'tit Dej',plats, DynInfos})
                    })
                    .get('/dej', (req, res) => {
                        if (session)
                            res.render('dejC', {session, plats, pageTitle: 'Dejeuner', DynInfos})
                         else
                            res.render('dej', {plats, pageTitle: 'Dejeuner', DynInfos})
                    })
                    .get('/dessert', (req, res) => {
                        if (session)
                            res.render('dessertsC', {session, plats, pageTitle: 'Desserts', DynInfos})
                         else
                            res.render('desserts', {pageTitle: 'Desserts', plats, DynInfos})
                    })
                    .get('/boissons', (req, res) => {
                        if (session)
                            res.render('boissonsC', {session, pageTitle: 'Boissons',plats, DynInfos})
                         else
                            res.render('boissons', {pageTitle: 'Boissons',plats, DynInfos})
                    })
                    .get('/caisse', (req, res) => {
                        if (session)
                            res.render('caisse', {session, pageTitle: 'La caisse',plats, DynInfos})
                        else
                            res.render('block', {pageTitle: 'Important !!!', plats,DynInfos})
                    })
                    .get('/inscription', (req, res) => {
                        if (!session)
                            res.render('inscription', {pageTitle: 'Inscription',plats, DynInfos})
                        else
                            res.redirect('/')
                    })
                    .get('/newUser', (req,res) => {
                        if(!session)
                            res.render('new', {pageTitle: 'Inscription reussie'})
                    })
                    .get('/home', (req, res) => {
                        if (session)
                            res.render('infosC', {session, pageTitle: 'Mes infos',plats, DynInfos})
                        else
                            res.redirect('/error')
                    })
                    .get('/fact', (req, res) => {
                        if (session) {
                            let factures;
                            db.query('SELECT *, DATE_FORMAT(dateCom, "%e/%m/%Y à %T") AS dateCom FROM facture where idCli = ? ORDER BY dateCom DESC', [session.id], (err, result) => {
                                if (!err) {
                                    factures = result
                                    res.render('factures', {session, pageTitle: 'Factures', factures, DynInfos})
                                } else
                                    res.end(err.message)
                            })
                        }
                        else
                            res.render('404')

                    })
                    .get('/connexion', (req, res) => {
                        if (session) {
                            res.redirect('/')
                        }
                        else {
                            res.redirect('/')
                        }
                    })
                    .get('/livraison', (req, res) => {
                        let donnees = 'users.name, users.tel, facture.idFact, facture.livre, facture.price, facture.numComm, facture.status, DATE_FORMAT(facture.dateCom, "%e/%m/%Y à %T") AS dateCom'
                        let sql = `SELECT ${donnees}  FROM facture INNER JOIN users ON facture.idCli = users.id AND facture.status = 0 ORDER BY facture.dateCom DESC`
                        db.query(sql, (err, results) => {
                          if (!err) {
                            let factures = results
                            if (factures.length > 0)
                                res.render('livraison', {factures})
                            else {
                                res.end('Il n\' y a aucune commande pour le moment !')
                            }
                          }
                          else
                            res.end(err.message)  
                        })
                    })
                    .get('/fact/:id', (req, res) => {
                        if(session) {
                            let id = req.params.id
                            db.query('SELECT * FROM commandes INNER JOIN foods WHERE commandes.idFood = foods.id AND idFact = ?', [id], (err, results) => {
                                if (!err) {
                                    let lines = results
                                    res.render('fact', {pageTitle: 'Infos commande' ,lines, session, DynInfos})           
                                }
                            })
                        }
                    })
                    .get('/factL/:id/:mtn/:num', (req, res) => {
                        let id = req.params.id
                        let montant = req.params.mtn
                        let num = req.params.num
                            db.query('SELECT * FROM commandes INNER JOIN foods WHERE commandes.idFood = foods.id AND idFact = ?', [id], (err, results) => {
                                if (!err) {
                                    let lines = results
                                    res.render('factL', {pageTitle: 'Infos commande' ,lines, session, DynInfos, montant, num})           
                                }
                            })
                    })
                    .post('/comment', (req, res) => {
                        if (req.body.comment.length > 0) {
                            let comment = req.body.comment
                            let num = req.body.numComm
                            db.query('UPDATE facture SET commentaire = ? WHERE numComm = ?', [comment, num], (err, result) => {
                                if(!err) 
                                    res.redirect('/fact')
                                else
                                    console.log(err.message)
                            })
                        }

                    })
                    
                    .get('/validateBuy', (req, res) => {
                        res.render('validate',  {session, pageTitle: 'Commande recu', DynInfos})
                    })


                app.use(function(req, res) {
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
                        pos: ''
                    }

                    let selectedId = parseInt(data.id)
                    let result = plats.find( plat => plat.id === selectedId )
                    if (result) {
                        newBuy.id = result.id
                        newBuy.lib = result.lib
                        newBuy.price = result.price

                        panier.push(newBuy)
                        prices[0] += newBuy.price
                    }

                    prices[1] = panier.length
                    newBuy.pos = prices[1] - 1

                    socket.emit('addToCart', {panier, prices});
                });

                socket.on('deleteCart', (data) => {
                    let rm = new Promise((resolve, reject) => {
                        let minus = parseFloat(panier[data].price)
                        prices[0] -= minus
                        prices[1]--
                        let total = prices[0]
                        panier.splice(data, 1);
                        let resp = {panier: panier, prices: prices}
                        resolve(resp)
                    }).then((resp) => {
                        socket.emit('newPanier', resp)
                    })
                })
                //confirmation livraison par le client
                socket.on('confirmReception', (data) => {
                    let id = parseInt(data)
                    db.query('UPDATE facture SET livre = 1 WHERE idFact = ?', [id], (err, result) => {
                        if (!err) {
                            db.query('SELECT * FROM facture WHERE ifFact = ?', [id], (error, res) => {
                                if (!err)
                                    socket.emit('resConfirm', 1)
                                else
                                    socket.emit('resConfirm', 0)
                            })
                        }
                        else
                            socket.emit('resConfirm', 0)

                    })
                })

                //confirmation livraison par le livreur
                socket.on('confirmLivraison', (data) => {
                    let id = parseInt(data)
                    db.query('UPDATE facture SET status = 1 WHERE idFact = ?', [id], (err, result) => {
                        if (!err) {
                            db.query('SELECT * FROM facture WHERE ifFact = ?', [id], (error, res) => {
                                if (!err)
                                    socket.emit('resConfirmL', 1)
                                else
                                    socket.emit('resConfirmL', 0)
                            })
                        }
                        else
                            socket.emit('resConfirm', 0)

                    })
                })
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
                            let crypt = crypto.createHmac('sha256', mdp).update('NaNguy').digest('hex');
                            if(r.length >= 1) {
                                results.mail = 1
                                if (crypt === r[0].mdp) {
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
                });
                socket.on('deconnexion', () => {
                    let deco = new Promise((resolve, reject) => {
                        session = null
                        panier = []
                        prices = [0, 0]
                        DynInfos = { panier, prices}
                        resolve(prices)
                    }).then((data) => {
                        socket.emit('confirmDeconnexion')
                    })



                })
                //fin systeme de connexion

                let results = {
                    'name': '',
                    'fname': '',
                    'mail': '',
                    'mdp': '',
                    'tel': ''
                };
                //systeme d'inscription
                socket.on('inscriptionData', (data) => {
                    //verification champs vides
                    results.fname = (verify.required(data[0].value)) ? 1 : 0;
                    results.name = (verify.required(data[1].value)) ? 1 : 0;
                    results.mail = (verify.required(data[2].value)) ? 1 : 2;
                    results.mdp = (verify.required(data[3].value)) ? 1 : 2;
                    results.tel = (verify.required(data[5].value)) ? 1 : 2;


                    if (results.tel === 1) results.tel = (!isNaN(data[5].value)) ? 1 : 3;
                    if (results.tel === 1) results.tel = (data[5].value.length === 8) ? 1 : 4;


                    if (results.mail === 1) results.mail = (verify.mail(data[2].value)) ? 1 : 3


                    if (results.mdp === 1) results.mdp = (data[3].value.length >= 8) ? 1 : 3
                    if (results.mdp === 1) results.mdp = (data[3].value === data[4].value) ? 1 : 4

                    //results.fname == results.name == results.mail == results.mdp == results.tel == 1
                    if (results.mail === 1) {

                        let p = new Promise((resolve, reject) => {
                            let sql, inserts;
                            sql = "SELECT * FROM users WHERE mail =?";
                            inserts = [data[2].value];
                            sql = mysql.format(sql, inserts);

                            db.query(sql, (err, result) => {
                                resolve(result)
                            })
                        }).then((r) => {
                            results.mail = (r.length === 1) ? 4 : 1
                            if (results.mail === 4) socket.emit('resInscription', results)
                            

                            if (results.mail === 1) {
                                let add = new Promise((resolve, reject) => {
                                    let cryptMdp = crypto.createHmac('sha256', data[3].value).update('NaNguy').digest('hex');
                                    db.query("INSERT INTO users (name, firstname, mail, mdp, tel) VALUES (?, ?, ?, ?, ?)",
                                        [data[1].value, data[0].value, data[2].value,cryptMdp, data[4].value],
                                        function (error, result) {
                                            if (err) console.log(error)
                                            
                                        })
                                })
                                 socket.emit('resInscription', results)

                            }

                        }).catch((err) => {
                            console.log(err.message)
                        })
                       
                    } else
                        socket.emit('resInscription', results)

                })
                //Fin systeme d'inscription


                //achat
                socket.on('achat', (data) => {
                    let query = new Promise((resolve, reject) => {
                        let numCom = generator.numCom(session.id, 5)
                        prices[0] += 1000
                        db.query('INSERT INTO facture (idCli, price, numComm) VALUES (?, ?, ?)', [session.id, prices[0], numCom], function (error, results, fields) {
                            if(results)  {
                                 resolve(results.insertId)
                            }
                        })}).then((id) => {
                            panier.forEach((food) => {
                                let values = [session.id, id, food.id]
                                db.query('INSERT INTO commandes (client, idFact, idFood) VALUES (?, ?, ?)', values,function (error, results) {
                                    if (error) {
                                        console.log(error.message)
                                        socket.emit('resAchat', 0)
                                    }
                                    else {
                                        let updates = new Promise((resolve, reject) => {
                                            let ok = true
                                            panier.forEach((elt) => {
                                                let recup = new Promise((resolve, reject) => {
                                                    let id = parseInt(elt.id)
                                                    db.query('SELECT amount FROM foods WHERE id = ?', [id], (err, res) => {
                                                        if(!err) {
                                                            resolve(res[0].amount)
                                                        }
                                                    })
                                                }).then((amount) => {
                                                    let qte = parseInt(amount) - 1
                                                    let id = parseInt(elt.id)
                                                    db.query('UPDATE foods set amount = ? WHERE id = ?', [qte, id], (err, res) => {
                                                        if (err)
                                                            console.log(err.message)
                                                    })
                                                }).catch((err) => console.log(err))

                                                resolve(ok)
                                            })
                                        }).then((ok) => {
                                            socket.emit('resAchat', 1)
                                        })




                                    }
                                })
                            })
                        })
                     })

                socket.on('forceUpdate', () => {

                    let okUpdate = new Promise((resolve, reject) => {
                        db.query('SELECT * FROM foods', function (error, results) {
                            if (!error)
                                plats = results
                            else
                                console.log(error)

                            resolve(results)
                        });
                    }).then((result) => {
                        if (result)
                            prices = [0, 0]
                            panier = []
                            DynInfos = { panier, prices}
                            socket.emit('updateOk')
                    })



                })

            })

        } else {
            console.log(err.message);
        }
        http.listen(port, () => console.log('started'));
});
    
    
