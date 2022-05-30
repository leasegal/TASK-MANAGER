const mongoose =  require ('mongoose');

const UserModel = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    id:{
        type:Number,
        unique:true
    },
    
    email:{
        type:String,
        //unique:true,
        required:true,
        trim:true,
        lowercase:true,
        minlength:7,
        //-חייב להיות מעל 7 תווים
        //-חייב לכלול ״@״ ״.״ (שטרודל ונקודה)
        // validate(value){
        //    if (value.match('@'))value.split('@')[1].match('.')? "ok": "error"
        // }

    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        // validate(value){

        // }
    },
    age:{
        type:Number,
        default:0,
        // validate(value){
        //     if(!value>=0)throw "age have to be positive"
        // }
    },
    task:{
        type:[Number],

    }
})

module.exports= mongoose.model("User",UserModel)