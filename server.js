const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const article = require('../backend2/models/article');
const { find } = require('../backend2/models/article');
const MongoClient = require('mongodb').MongoClient 
// newly added
const passport = require('passport');
const auth = require('./auth')(passport);
// newly added

app.set('view engine', 'ejs')
//app.set('views', path.join(__dirname, 'client side'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'))

MongoClient.connect('mongodb+srv://ja123:ja123@cluster0.k3ytz.mongodb.net/ja-articles?retryWrites=true&w=majority'
,{
  useUnifiedTopology: true
}).then(client => {
    console.log('Connected to Database');
    const db = client.db('ja-articles');
    const articlesCollection = db.collection('article');
    const authorCollection = db.collection('author');
    
    app.get('/',(req,res)=>{
        db.collection('article').find().toArray()
    .then(results => {
      res.render('index',{article:results})
      })
    .catch(error => console.error(error))
    
  })
    //to add an article
    app.get('/articles',(req,res)=>{
      //     db.collection('article').find().toArray()
      // .then(results => {
        //res.render('index')
        res.sendFile(__dirname + '/index.html');
        //})
      //.catch(error => console.error(error))
        
    });

    //to add an author
    app.get('/authors',(req,res)=>{
      //     db.collection('article').find().toArray()
      // .then(results => {
        //res.render('index')
        res.sendFile(__dirname + '/addAuthor.html');
        //})
      //.catch(error => console.error(error))
        
    });

    app.post('/aricles', (req,res)=>{ 
        articlesCollection.insertOne(req.body)
            .then(result=>res.redirect('/'))
            .catch(error=>console.log(error));
        
    })
    app.post('/authors', (req,res)=>{ 
      authorCollection.insertOne(req.body)
          .then(result=>res.redirect('/'))
          .catch(error=>console.log(error));
      
  });
    app.get('/articles/:id', (req,res)=>{
      //{_id:ObjectId(req.params.id)}
     // console.log(req.params.id.typeof)
      db.collection('article').find({_id:req.params.id.toString()}).toArray()
      .then(result=>res.render('articles',{article:result}))
            .catch(error=>console.log(error));
    })
    app.listen(3000, ()=>{
        console.log("server's up")
    });
    // newly added
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get("/auth/google/callback",passport.authenticate('google'));
    // newly added
  })
  .catch(error => console.error(error));
