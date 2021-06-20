import { Schema, model } from 'mongoose';

const ClientSchema = new Schema({
// attributes
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    surname: {
        type: String,
        required: true,
        lowercase: true
    },

    age: {
        type: Number,
        required: true,

    },

    phone: {
        type: String,
        required: true,
        lowercase: true
    }
});



export default model('Client', ClientSchema );