const Vacantes = require('../models/vacantes')
exports.panelAdministration = async(req, res , next) => {
    const vacantes = await Vacantes.find({autor : req.user._id})
    console.log(vacantes)
    res.render('admin/administration',{
        pageTitle : 'Panel Administration',
        tagline : 'Publica y Administra todas tus Vacantes',
        cerrarSesion : true,
        vacantes
    })
}