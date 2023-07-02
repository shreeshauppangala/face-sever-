const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const Signup = require('./controllers/Signup');
const Signin = require('./controllers/Signin');
const Profile = require('./controllers/Profile');
const image = require('./controllers/image')

const db = knex({
  client: 'pg',
  connection: {
    host : 'postgresql-flexible-85917',
    user : 'postgres',
    password : '',
    database : '_smart-brain_'
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/',(req,res)=> {res.send(db.users) });
app.post('/Signin',(req,res)=>{Signin.handleSignIn(req,res,db,bcrypt)});
app.post('/Signup',(req,res)=>{Signup.handleSignup(req,res,db,bcrypt)});
app.get('/profile/:id',(req,res)=>{profile.handleProfile(req,res,db)});
app.put('/image',(req,res)=>{image.handleImage(req,res,db)});
app.post('/imageurl',(req,res)=>{image.handleApi(req,res)});

app.listen (process.env.PORT||3000,()=>{
  console.log(`app is running on port ${process.env.PORT}`)
});