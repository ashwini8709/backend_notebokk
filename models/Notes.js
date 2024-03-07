import mongoose from 'mongoose';
import {Schema }from 'mongoose';


const noteSchema= new Schema({
    user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    tag:{
        type:String,
        default:"General"
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const note = mongoose.model('note', noteSchema);
export default note