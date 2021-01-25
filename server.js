const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'pace@123',
    database : '_smart-brain_'
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res)=> {
  res.send(db.users);
})
app.post('/Signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/Signup', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(async logInEmail => {
        const user = await trx('users')
              .returning('*')
              .insert({
                  email: logInEmail[0],
                  name: name,
                  joined: new Date()
              });
          res.json(user[0]);
          })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(_err => res.status(400).json('unable to Signup'))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(_err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries'+1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(_err => res.status(400).json('unable to get entries'))
})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})