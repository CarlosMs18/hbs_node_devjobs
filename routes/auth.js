const authController = require('../controllers/auth')
const {check} = require('express-validator')
const Router = require('express')
const router = Router()

router.get('/signup',authController.formSignUp)

router.post('/signup',[
    check('nombre','El nombre debe de tener un minimo de 3 caracteres')
    .not().isEmpty()
    .isLength({min:3}),
    check('email','Debe de ingresar un email valido')
    .isEmail(),
    check('password','El password debe de tenner un minimo de 5 caracteres')
    .not().isEmpty()
    .isLength({min : 5}),
   
    check('confirmar','Las contraseñas no coinciden')
    .trim()
    .custom((value, {req}) =>{
        if(value !== req.body.password){
            throw new Error('Passwords have to match!');
        }
        return true
    })
],authController.postSignUp)


router.get('/signin',authController.formSignIn)

router.post('/signin',authController.autenticarUsuario)

router.get('/signoff',authController.signOff)

router.get('/forgorpassword',authController.forgotPassword)


router.post('/reset-password',authController.postForgotPassword)

router.get('/reset-password/:token',authController.formNewPassword)

router.post('/reset-password/:token',[
    check('password','La contraseña debe de tener un minimo de 5 digitos')
    .not().isEmpty().trim()
    .isLength({min:5})

],authController.newPassword)


router.get('/edit-perfil',authController.editPerfil)
module.exports = router