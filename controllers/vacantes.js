const {validationResult} = require('express-validator');
const multer = require('multer');
const shortid = require('shortid');
const Vacantes  = require('../models/vacantes')

exports.subirCV  =  (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: Máximo 100kb');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            return next();
        }
    });
}


// Opciones de Multer
const configuracionMulter = {
    limits : { fileSize : 1000000 },
    storage: fileStorage = multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/cv');
        },
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'application/pdf' ) {
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            cb(null, true);
        } else {
            cb(new Error('Formato No Válido'));
        }
    }
}

const upload = multer(configuracionMulter).single('cv');


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
    const contrato = req.body.contrato
    
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
            contrato,
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


exports.editVacancie  = async(req, res , next) => {
      
        const url = req.params.url
        const vacante = await Vacantes.findOne({
            url,
           autor : req.user._id
        })

        if(!vacante){
            return res.redirect('/admin')
        }

        res.render('vacancies/edit-vacancie',{
            vacante,
            pageTitle : vacante.title,
            cerrarSesion : true,
            tagLine : 'Zona de Edicion'
        })
}


exports.postEditVacancie = async(req,res , next) => {
    
    
    const skills = req.body.skills
    const skillsArray = skills.split(',')

    const vacanteActualizada = req.body
    vacanteActualizada.skills = skillsArray
    vacanteActualizada.title = req.body.titulo
    vacanteActualizada.description = req.body.descripcion

    const url = req.params.url
    
        const vacante = await Vacantes.findOne({
            url,
           autor : req.user._id
        })

        if(!vacante){
            return res.redirect('/admin')
        }

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = errors.errors.map(e => e.msg)
        req.flash('error',error)
        return res.render('vacancies/edit-vacancie',{
            vacante,
            pageTitle : vacante.title,
            cerrarSesion : true,
            tagLine : 'Zona de Edicion',
            mensajes : req.flash()
        })
    }

    try {
        const vacanteNew = await Vacantes.findOneAndUpdate({url},vacanteActualizada,{
            new: true
        })        
        req.flash('correcto','Actualizado de manera correcta')
        res.redirect('/admin')
    } catch (error) {
        console.log(error)
    }
}

exports.deleteVacante = async(req,res , next) => {
   const id = req.params.idVacante

   const vacante = await Vacantes.findOne({
        id,
        autor : req.user._id
   })

   if(!vacante){
       req.flash('error','La vacante no existe')
       return res.redirect('/admin')
   }

   try {
        await Vacantes.findByIdAndDelete(id)
        res.status(200).send('Vacante Eliminado con exito!')

   } catch (error) {
       console.log(error)
   }
}


exports.homeJobs = async(req, res , next) => {

    const vacantes = await Vacantes.find()
    console.log(vacantes)
    res.render('vacancies/home',{
        pageTitle : 'Home',
        vacantes
    })
}

exports.VacanteInfo = async(req, res , next) => {
    const {image} = req.user
    const path  =image.split('\\')
    const pathUrl = path[path.length -1]

    const url = req.params.url
    const vacante = await Vacantes.findOne({url}).populate('autor')
    vacante.autor.image = pathUrl
    console.log(vacante)
    if(!vacante){
        req.flash('error','La vacante no existe!')
        return res.redirect('/')
    }

    
    res.render('vacancies/vacante-info',{
        pageTitle : vacante.title,
        vacante
    })
}

exports.enviarPostulacion =async(req,res , next) => {
    const nombre = req.body.nombre
    const email = req.body.email
    const cv = req.file.filename
    const url = req.params.url

    const vacante = await Vacantes.findOne({url})
    if(!vacante){
        req.flash('error','La vacante no existe!')
        return res.redirect('/')
    }

  
    try {
        const nuevoCandidato = {
            nombre,
            email,
            cv
        }
    
        vacante.candidatos.push(nuevoCandidato)
        await vacante.save()

        req.flash('correcto', 'Se envió tu Curriculum Correctamente');
        res.redirect('/');
    } catch (error) {
        console.log(error)
    }
}