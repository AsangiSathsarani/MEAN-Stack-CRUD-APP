import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Issue from './models/Issue';


const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/issues');

const connection = mongoose.connection;

connection.once('open' ,()=>{
    console.log('MongoDB database connection establish succsufully!');
});

router.route('/issue').get((req , res)=>{
    Issue.find((err ,issues)=>{
        if(err)
            console.log(err);

        else 
            res.json(issues);
    });
});

router.route('/issue/:id').get((req ,res)=>{
    Issue.findById(req.params.id ,(err , issue)=>{
        if(err)
            console.log(err)
        else
            res.json(issue);
    });
});

router.route('/issue/add').post((req , res)=>{
    let issue = new Issue(req.body);
    issue.save()
        .then(issue=>{
            res.status(200).json({'issue':'Added successfully!'});
        })
        .catch(err=>{
            res.status(400).send('Failed create new record!');
        });

});

router.route('/issue/update/:id').post((req , res)=>{
    Issue.findById(req.params.id ,(err , issue)=>{
        if(!issue)
            return next(new Error('Could not load document!'));

        else
            issue.title = req.body.responsible;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.serverity = req.body.serverity;
            issue.status = req.body.status;

            issue.save().then(issue =>{
                res.json('Update done!');
            }).catch(err=>{
                res.status(400).send('Update failed!');
            });
    });
});

router.route('/issue/delete/:id').get((req ,res )=>{
    Issue.findByIdAndRemove({_id: req.params.id} ,(err ,issue)=>{
        if(err)
            console.log(err);
        else
            res.json('remove succsesfully!');
    })
})

app.use('/' ,router);


app.listen(4000 ,()=> console.log("Express server runing on port 4000"));
