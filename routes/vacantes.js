const Router = require('express')
const router = Router()
const vacantController = require('../controllers/vacantes')
const isAuth = require('../middlewares/is-auth')
const {check} = require('express-validator')


router.get('/new-vacante',isAuth,vacantController.formNewVacant)

router.post('/new-vacante',isAuth,[
    check('titulo','El titulo debe de tener un  minimo de 8 digitos')
    .not().isEmpty().trim()
    .isLength({min :8}),
    check('empresa','La empresa debe de tener un minimo de 5 digitos')
    .not().isEmpty().trim()
    .isLength({min :5}),
    check('ubicacion','La ubicacion debe de tener un  minimo de 4 digitos')
    .not().isEmpty().trim()
    .isLength({min :4}),
    check('descripcion','La descripcion no puede ir vacia!')
    .not().isEmpty().trim(),
    check('contrato','El contrato no puede ir vacio!')
    .not().isEmpty().trim()
    
    
],vacantController.postNewVacant)

module.exports = router