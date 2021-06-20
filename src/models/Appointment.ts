import { Schema, model, Mongoose } from 'mongoose';


const AppointmentSchema = new Schema({

    cliente: {

        type: String,
    },


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


    date: {
        type: String,
        required: true,
    },

    hour: {
        type: String,
        required: true,
    }


});



export default model('Appointment', AppointmentSchema);