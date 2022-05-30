const mongoose = require('mongoose');
const UserModel = require('./UserModel')

const TaskModel = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    id:{
        type:Number,
        required:true
    },
    users:{
        type:[Number]
    }
})

module.exports=mongoose.model("Task",TaskModel)