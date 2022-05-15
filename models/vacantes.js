const {Schema, model} = require('mongoose')
const shortid = require('shortid')
const slug = require('slug')
const vacantesSchema = Schema({
    title : {
        type :String,
        trim : true,
        required : true
    },

    empresa : {
        type : String,
        required : true
    },

    ubicacion : {
        type : String,
        required: true
    },
    salario : {
        type : Number,
        defautl : 0,
        required :true
    },

    contrato : {
        type :String,
        trim : true
    },

    description :{
        type : String,
        trim: true
    },
    url : {
        type : String,
        lowecase : true
    },
    skills : [String],
    candidatos : [{
        nombre : String,
        email : String,
        cv : String
    }],
    autor : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
})

vacantesSchema.pre('save',function(next){
    const url = slug(this.title)
    this.url = `${url}-${shortid.generate()}`

    next()
})
module.exports = model('Vacantes',vacantesSchema)