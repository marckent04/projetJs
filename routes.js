exports.routesApp = function (app, session, DynInfos, plats) {
    app.get('/', (req, res) => {
        if (session) {
            res.render('indexC', {session, pageTitle: 'Maman', DynInfos})
        } else
            res.render('index', {pageTitle: 'Maman', DynInfos})
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
                res.render(404)
        })
        .get('/home', (req, res) => {
            if (session)
                res.render('infosC', {session, pageTitle: 'Mes infos',plats, DynInfos})
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
            res.send('ok')
        });
}