const mongoose = require("mongoose")
const userSchema= mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    pass:{
        type:String,
        required:true
    },
    rol:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model("User",userSchema)