import { Router, Request, Response } from 'express';
const router = Router();


// Model

import Client from '../models/Client';
import Appointment from '../models/Appointment';


// CRUD
//create a new client
router.route('/create')  
    .get((req: Request, res: Response) => {

         // render the create client view
        res.render('registry/create'); 
    })

    .post(async (req: Request, res: Response) => {
        try{
         //get all the fields
        const {name,surname,age,phone} = req.body;
        let _name : String = name;
        let _surname : String = surname;
        let _age : number = age;
        let _phone : String = phone;
        let n : String = _name.replace(/\s/g,  "");
        let sn : String = _surname.replace(/\s/g,  "");
        // phone is a string for special character like + in the prefix
        let p : String = _phone.replace(/\s/g,  "");
        const client = new Client({name : n,surname : sn,age: _age,phone : p});  
         //save the client
        await client.save(); 

        console.log(client)

        // redirect to client registry view
        res.redirect('/registry/list');  
        }
        catch(e){
            //if user doesn't insert all the fields, render the error view
            res.render('registry/errorValidation'); //

        }
    });

 // get all the clients with find() method and render the client registry view
router.route('/list') 
    .get(async (req: Request, res: Response) => {
        const clients = await Client.find();  // 
        res.render('registry/list', { clients });
    });

 // get all the appointments with find() method and render the appointment registry view
router.route('/listAppointments') 
.get(async (req: Request, res: Response) => {
    const appointments = await Appointment.find();
    res.render('registry/listAppuntamenti', { appointments });
});

// delete the clients 
router.route('/delete/:id') 
    .get(async (req: Request, res: Response) => {
        const { id } = req.params;
        // find the client with the chosen id and delete it
        await Client.findByIdAndDelete(id);
        res.redirect('/registry/list');
    });

// delete the appointment
router.route('/deleteAppointments/:id')  
.get(async (req: Request, res: Response) => {
    const { id } = req.params;
    // find the appointments with the chosen id and delete it
    await Appointment.findByIdAndDelete(id);
    res.redirect('/registry/listAppointments');
});



// edit the client
router.route('/edit/:id') 
    .get(async (req: Request, res: Response) => {
        const { id } = req.params;
        // find the client with the chosen id
        const client = await Client.findById(id);
        console.log(client)
        // render the client edit view
        res.render('registry/edit', { client });
    })
    .post(async (req: Request, res: Response) => {
        try{

        const { id } = req.params;
        const {name,surname,age,phone} = req.body;
        let _nameEdit : String = name;
        let _surnameEdit : String = surname;
        let _ageEdit : number = age;
        let _phoneEdit : String = phone;
        let nEdit : String = _nameEdit.replace(/\s/g,  "");
        let snEdit : String = _surnameEdit.replace(/\s/g,  "");
        let pEdit : String = _phoneEdit.replace(/\s/g,  "");
        // update the client
        if (nEdit != ''  && snEdit != '' && age != '' && pEdit != ''){
          
            await Client.findByIdAndUpdate(id, {name: nEdit,surname: snEdit, age : _ageEdit ,phone: pEdit})

            res.redirect('/registry/list');
        }
        else{

            res.render('registry/errorValidation');

        }
        }
        catch(e){

            res.render('registry/errorValidation');


        }
        
    });


// create the appointment 
router.route('/add/:id/appuntamenti')
    .get(async (req: Request, res: Response) => {
        const { id } = req.params;
         // render the create appointment view
    res.render('registry/createAppuntamenti',{id});

})

    .post(async (req: Request, res: Response) => {
    try{
        const { id } = req.params;

        // get the name of the client requesting the appointment
        const name = await Client.findById(id,"name");
        // get the surname of the client requesting the appointment
        const surname = await Client.findById(id,"surname");
        let a: String = name.get("name");
        let s: String =  surname.get("surname");
        const {date,hour} = req.body;
        let _date: String = date;
        let _hour: String = hour;
        // delete empty spaces
        console.log('prima')
        console.log('prima')
        console.log(_date.length)
        let d : String = _date.replace(/\s/g,  "");
        let h : String =  _hour.replace(/\s/g,  "");
        console.log('dopo')
        console.log(h.length)
        // find if there is another appointment with same date and hour
        var check1 = await Appointment.find({date: d, hour : h});
        console.log(check1)
        // check the length of the result: if is 0 create a new appointment
        if (check1.length == 0){
            const _Appointment = new Appointment({id : id ,name: a ,surname: s,date: d, hour: h});
            await _Appointment.save();
            console.log(_Appointment);

            res.redirect('/registry/listAppointments');
        }
        else{
            // if length > 0 there is another appointment with same date and hour and render the error view
            res.render('registry/error');
        }
    }
    catch(e){

        res.render('registry/errorValidation');

    }

});
// edit the appointment
router.route('/editAppointments/:id')
    .get(async (req: Request, res: Response) => {
        const { id } = req.params;
        const app = await Appointment.findById(id);
        console.log(app)
        res.render('registry/editAppointments', { app });
    })
    .post(async (req: Request, res: Response) => {
        try{
        const { id } = req.params;
        const {date,hour} = req.body;
        let _date: String = date;
        let _hour: String = hour;
        let d : String = _date.replace(/\s/g,  "");
        let h : String =  _hour.replace(/\s/g,  "");
        //same procedure as create
        const check1 = await Appointment.find({date: d, hour : h});
        if(_date != '' && _hour != ''){

            if (check1.length == 0){ 

                // update only if length == 0
                await Appointment.findByIdAndUpdate(id, {
                date: d, hour: h
                })
                res.redirect('/registry/listAppointments');
                }
            else{

                res.render('registry/error');
            }
        }

        else{

            res.render('registry/errorValidation');


        }

        }
        catch(e){

            res.render('registry/errorValidation');

        }
});

export default router;
