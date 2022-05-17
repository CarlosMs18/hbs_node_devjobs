const Vacantes = require('../models/vacantes')
exports.panelAdministration = async(req, res , next) => {
    const vacantes = await Vacantes.find({autor : req.user._id})
    
    const {image} = req.user
    const path  =image.split('\\')
    const pathUrl = path[path.length -1]
    console.log(pathUrl)
   
    res.render('admin/administration',{
        pageTitle : 'Panel Administration',
        tagline : 'Publica y Administra todas tus Vacantes',
        cerrarSesion : true,
        vacantes,
        nombre : req.user.name,
        imagen : pathUrl
    })
}