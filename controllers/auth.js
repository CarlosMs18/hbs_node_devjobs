const User = require('../models/user')
const passport = require('passport')
const {validationResult} = require('express-validator')
const crypto = require('crypto')
exports.formSignUp = (req, res, next)=>{
   
    res.render('auth/signup',{
        pageTitle : 'Sign Up'
    })
}

exports.postSignUp = async(req, res, next)=>{
    
    const name =req.body.nombre
    const email  =req.body.email
    const password = req.body.password
    const confirmar = req.body.confirmar
   
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        
        const errorMessage = errors.errors.map(e => e.msg)
        req.flash('error',errorMessage)
        res.render('auth/signup',{
            pageTitle : 'Sign Up',
            mensajes : req.flash(),
            oldInput :{
                name,
                email,
                password,
                confirmar
            }
        })
        return
    }
    
    try {
        const usuario = new User({
            name,
            email,
            password
        })
        
        await usuario.save()
        
        res.redirect('/auth/signin')
    } catch (error) {
    
        error.message = 'El Correo electronico ya se encuentra en uso'
        req.flash('error',error.message)
        res.redirect('/auth/signup') 
    }
}


exports.formSignIn = (req, res , next) => {
     
        res.render('auth/signin',{
            pageTitle : 'Sign In'
        })
}



exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect : '/admin',
    failureRedirect :'/auth/signin',
    failureFlash : true,
    badRequestMessage : 'Ambos campos son obligatorios'
})


exports.signOff = (req, res , next) => {
    req.logout()
    req.flash('correcto','Cerraste la sesion de manera correcta')
    return res.redirect('/auth/signin')
}


exports.forgotPassword = (req, res , next) =>{
    res.render('auth/forgot-password',{
        pageTitle : 'Forgot Password'
    })
}


exports.postForgotPassword = async(req, res, next) => {
        const email = req.body.email

        const usuario  = await User.findOne({email})

        if(!usuario){
            req.flash('error','No existe esta cuenta')
            return res.redirect('/auth/signup')
        }

        usuario.token = crypto.randomBytes(20).toString('hex')
        usuario.expirate = Date.now() + 3600000

        await usuario.save()

        const resetUrl = `http://${req.headers.host}/auth/reset-password/${usuario.token}`

        console.log(resetUrl)

        req.flash('correcto','El email se ha enviando de manera correcta!')
        res.redirect('/auth/signin')
}


exports.formNewPassword = async(req, res , next) => {
    const token = req.params.token
    const usuario = await User.findOne({
        token
    })

    if(!usuario){
        req.flash('error','Error, reenvia la solicitud de nuevo')
        return res.redirect('/auth/signin')
    }
    
    res.render('auth/new-password',{
        pageTitle : 'New Password'
    })
}

exports.newPassword = async(req, res , next) => {   
        const password = req.body.password
        const token = req.params.token
        const errors = validationResult(req)
       
        if(!errors.isEmpty()){
            console.log('hay error')
            const error = errors.array()[0].msg            
            req.flash('error',error)
            return res.render('auth/new-password',{
                pageTitle : 'New Password',
                mensajes :req.flash()
            })
        }


        const usuario = await User.findOne({
            token
        })
        
        usuario.password = password
        usuario.token = undefined
        usuario.expirate = undefined
        await usuario.save()

        req.flash('correcto','La contraseña se actualizo de manera correcta')
        res.redirect('/auth/signin')
}



exports.editPerfil = async(req, res , next) => {
        res.render('auth/edit-perfil',{
            pageTitle : 'Edit Perfil',
            usuario : req.user
        })
}