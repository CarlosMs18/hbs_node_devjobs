const {validationResult} = require('express-validator')
const Vacantes  = require('../models/vacantes')
exports.formNewVacant = (req, res , next) => {
    res.render('vacancies/new-vacancies',{
        pageTitle : 'New Vacancies',
        tagline : 'Publica y Administra todas tus Vacantes',
        cerrarSesion : true
    })
}

exports.postNewVacant = async(req, res, next) => {
    

    const title = req.body.titulo
    const empresa =req.body.empresa
    const ubicacion = req.body.ubicacion 
    const salario = req.body.salario
    const description = req.body.descripcion
    
    const skills = req.body.skills
    const skillsArray = skills.split(',')


    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const error = errors.errors.map( e => e.msg)
        req.flash('error',error)
        return res.render('vacancies/new-vacancies',{
            pageTitle : 'New Vacancies',
            tagline : 'Publica y Administra todas tus Vacantes',
            cerrarSesion : true,
            mensajes : req.flash()
        })
    }
    
    try {
        const vacante = new Vacantes({
            title,
            empresa,
            ubicacion,
            salario,
            description,
            skills : skillsArray,
            autor : req.user._id

        })

        await vacante.save()
        req.flash('correcto','Vacante creada con exito')
        res.redirect('/admin')
    } catch (error) {
        console.log(error)
    }


   

}

