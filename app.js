// require the needed modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = 8888;

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './public/dist')));

// set up mongo
mongoose.connect('mongodb://localhost/deerCRUD');

mongoose.Promise = global.Promise;

// set up mongoose schema
const DeerSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Name is required"], minlength: [2, "Name must be at least 2 characters"]},
    age: {type: Number, required: [true, 'Age must be present']},
    gender: {type: String, required: [true, 'Please enter a gender'], maxlength: 1},
    legs: {type: Number, default: 4}
}, {timestamps: true});

mongoose.model('Deer', DeerSchema);
const Deer = mongoose.model('Deer');


// route for the CRUD operations

// index
app.get('/deers', (req, res)=>{
    Deer.find({}, (err, deer)=>{
        if(err){
            res.json({message: 'error', errors: err});
        } else {
            res.json({message: 'success', deer: deer});
        }
    })
})

// create
app.post('/deers', (req, res)=>{
    console.log(req.body);
    const newDeer = new Deer(req.body);
    newDeer.save((err, deer)=>{
        if(err){
            // build an array of errors and send to client
            let errors = [];
            for(let key in err.errors) {
                errors.push(err.errors[key].message);
            }
            res.json({message: 'error', errors: errors});
        } else {
            console.log('line 52 success', deer);
            res.json({messsage: 'success', deer: deer});
        }
    })
})

// show
app.get('/deers/:id', (req, res)=>{
    const id = req.params.id;
    Deer.findOne({_id: id}, (err, deer)=>{
        if(err){
            console.log(err);
            res.json({message: 'error', errors: err});
        } else {
            console.log('line 66 success', deer);
            res.json({messsage: 'success', deer: deer});
        }
    })
})

// update
app.put('/deers/:id', (req, res)=>{
    const id = req.params.id;
    Deer.findById(id, (err, deer)=>{
        if(err){
            res.json({message: 'error', errors: err});
        }
        deer.name = req.body.name;
        deer.age = req.body.age;
        deer.gender = req.body.gender;
        deer.legs = req.body.legs;

        deer.save((err, deer)=>{
            if(err){
                console.log(err);
                res.json({message: 'error', errors: err.errors});
            } else {
                console.log('line 89 success', deer);
                res.json({messsage: 'success', deer: deer});
            }
        })
    })
})

// delete
app.delete('/deers/:id', (req, res)=>{
    const id = req.params.id;
    Deer.deleteOne({_id: id}, (err)=>{
        if(err){
            res.json({message: 'error', errors: err});
        } else {
            res.json({message: 'success'});
        }
    })
})

app.all('*', (req, res, next)=>{
    res.sendFile(path.resolve('./public/dist/index.html'));
})

app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`);
})
