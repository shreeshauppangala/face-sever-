const handleSignup =(req,res,db,bcrypt) => {
  const { email, name, password } = req.body;
  if (!email||!name||!password) {
    return res.status(400).json('fields are empty');
  }
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
}

module.exports = {
    handleSignup
};