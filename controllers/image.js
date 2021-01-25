const Clarifai= require('clarifai');

const app = new Clarifai.App({
  apiKey: '56423ede5d1c4b469a6fa9123a548d71s'
});
const handleApi=(req,res)=>{
    app.models
    .predict('c0c0ac362b03416da06ab3fa36fb58e3',req.body.input)
    .then(data=> {
        res.json(data);
    })
    .catch(err=>res.status(400).json('API is not working'))
}

const handleImage=(req, res,db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries',1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(_err => res.status(400).json('unable to get entries'))
}

module.exports={
    handleImage,
    handleApi
}