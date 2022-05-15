const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')



passport.use(new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
}, async(email, password, done) => {
    const usuario  = await User.findOne({email})
    if(!usuario){
        return done(null, false ,{
            message : 'Usuario no existente'
        })
    }
    
    const verificarPassword = usuario.comparePassword(password)
    if(!verificarPassword){
        return done(null, false, {
            message : 'Password Incorrect'
        })
    }

    return done(null, usuario)
}))

passport.serializeUser((usuario, done) => done(null, usuario._id));

passport.deserializeUser(async (id, done) => {
    const usuario = await User.findById(id).exec();
    return done(null, usuario);
});

module.exports = passport;