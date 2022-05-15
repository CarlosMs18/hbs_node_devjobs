const {Schema, model} = require('mongoose')
const bcryptjs = require('bcryptjs')


const userSchema = Schema({
    email : {
        type:String,
        unique : true,
        lowerCase: true,
        trim : true,
        required : true
    },

    name : {
        type:String,
        required: true,
        trim : true
    },
    image :{
        type:String
    },
    password : {
        type :String,
        required : true
    },
    token : String,
    expirate : Date
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }

    const  hash= bcryptjs.hashSync(this.password, bcryptjs.genSaltSync())
    this.password = hash
    next()

})


userSchema.post('save', function(error, doc, next) {
    if(error.name === 'MongoError' && error.code === 11000 ){
        next('Ese correo ya esta registrado');
    } else {
        next(error);
    }
});


userSchema.methods.comparePassword = function(password){
    return bcryptjs.compareSync(password, this.password)
}
module.exports = model('User',userSchema)