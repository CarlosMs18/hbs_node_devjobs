const isAuth =  require('../middlewares/is-auth')
const adminController = require('../controllers/admin')
const Router = require('express')
const router = Router()

router.get('/admin',isAuth,adminController.panelAdministration)

module.exports = router