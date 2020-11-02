const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient 
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret : "Our little Secret Here",
  resave : false,
  saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());


MongoClient.connect('mongodb+srv://ja123:ja123@cluster0.k3ytz.mongodb.net/ja-articles?retryWrites=true&w=majority'
,{
  useUnifiedTopology: true
}).then(client => {
    console.log('Connected to Database');
    const db = client.db('ja-articles');
    const articlesCollection = db.collection('article');
    const authorCollection = db.collection('author');
    const commentCollection = db.collection('comment')
  app.listen(3000, ()=>{
        console.log("server's up")
  }); 

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new GoogleStrategy({
      clientID        : '986762757676-2pq35rlfhh2t1u17gcgliquuuq6vgfn9.apps.googleusercontent.com',
      clientSecret    : '3Os8QiwahxzJsJNk7VhrFB4F',
      callbackURL     : 'http://localhost:3000/auth/google/callback',
      userProfileURL  : 'https://www.googleapis.com/oauth2/v3/userinfo'
    },
    function(token, refreshToken, profile, done) {
      console.log('HI');
      db.collection('users').findOne({ googleid : profile.id } , function(err, user) { 
          if (err)
              return done(err);
          else if (user) {
              console.log('user');
              return done(null, user);
          } 
          else {
              console.log('ELSE');
              db.collection('users').insertOne({
              "googleid" : profile.id,
              "token" : token,
              "name"  : profile.displayName,
              "email" : profile.emails[0].value,
              "photo" : profile.photos[0].value
              })
              console.log(profile.emails[0].value);
              return done(null, user);
          }
      })
    }
  ));  

  app.get('/', (req,res)=>{
    db.collection('author').find().toArray() 
    .then(result3=>{
      db.collection('article').find().toArray()
<<<<<<< HEAD
      .then(result2=>{res.render('index',{article:result2, isLogged : req.isAuthenticated(), author:result3,user: req.user})})
=======
      .then(result2=>{res.render('index',{article:result2, user: req.user, isLogged : req.isAuthenticated(), author:result3})})
>>>>>>> 56652e24ac7c9726e255c638a64ae645bd181be4
      .catch(error=>console.log(error+"1"));
    }).catch(error=>console.log(error+"2"));
   
  });

  app.get('/studentlife', (req,res)=>{
    db.collection('article').find({ category: "Studentlife" }).toArray()
    .then(results => {
      console.log(req.user)
      res.render('category',{article:results, user: req.user, isLogged: req.isAuthenticated(), cat:"Student Life"})
    })
    .catch(error => console.error(error))  
  });

  app.get('/career', (req,res)=>{
    db.collection('article').find({ category: "Career" }).toArray()
    .then(results => {
      console.log(req.user)
      res.render('category',{article:results, user: req.user, isLogged: req.isAuthenticated(), cat:"Career" })
    })
    .catch(error => console.error(error))  
  });

  app.get('/alumni', (req,res)=>{
    db.collection('article').find({ category: "Alumni" }).toArray()
    .then(results => {
      console.log(req.user)
      res.render('category',{article:results, user: req.user, isLogged: req.isAuthenticated(), cat: "Alumni" })
    })
    .catch(error => console.error(error))  
  });

  app.get('/scitech', (req,res)=>{
    db.collection('article').find({ category: "SciTech" }).toArray()
    .then(results => {
      console.log(req.user)
      res.render('category',{article:results, user: req.user, isLogged: req.isAuthenticated(), cat:"Science and Technology" })
    })
    .catch(error => console.error(error))  
  });

  app.get('/cult', (req,res)=>{
    db.collection('article').find({ category: "Cult" }).toArray()
    .then(results => {
      console.log(req.user)
      res.render('category',{article:results, user: req.user, isLogged: req.isAuthenticated(), cat:"Cultural" })
    })
    .catch(error => console.error(error))  
  });

  app.get('/sports', (req,res)=>{
    db.collection('article').find({ category: "Sports" }).toArray()
    .then(results => {
      console.log(req.user)
      res.render('category',{article:results, user: req.user, isLogged: req.isAuthenticated(), cat:"Sports" })
    })
    .catch(error => console.error(error))  
  });  
 
  app.get('/articles/:id', (req,res)=>{
   
    db.collection('comment').find().toArray()
    .then(result1=> {db.collection('author').find().toArray() 
                    .then(result3=>{
                      db.collection('article').find({id:req.params.id.toString()}).toArray()
                      .then(result2=>{res.render('articles',{article:result2, user: req.user, isLogged : req.isAuthenticated(), id:req.params.id , comment:result1 , author:result3});console.log(result1)})
                      .catch(error=>console.log(error+"1"));
                    }).catch(error=>console.log(error+"2"));

    }
    )
    .catch(error=>console.log(error+"3"));
    
    
    
 
  })

  app.get('/auth/google', 
    passport.authenticate('google', { scope : ['profile', 'email'] })
  );

  app.get('/auth/google/callback', 
      passport.authenticate('google', {
          failureRedirect: '/auth/google'
      }) ,
        (req, res) => {
            console.log("login done");
            res.redirect('/');
        }
  );
  
  app.get('/logout', (req, res) => {
    if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
  })

  // //to add an article
  app.get('/articles',(req,res)=>{
    //     db.collection('article').find().toArray()
    // .then(results => {
      //res.render('index')
      res.sendFile(__dirname + '/index.html');
      //})
    //.catch(error => console.error(error))
  });

  // //to add an author
  // app.get('/authors',(req,res)=>{
  //   //     db.collection('article').find().toArray()
  //   // .then(results => {
  //     //res.render('index')
  //     res.sendFile(__dirname + '/addAuthor.html');
  //     //})
  //   //.catch(error => console.error(error))
  // });

  app.post('/articles', (req,res)=>{ 
      articlesCollection.insertOne(req.body)
          .then(result=>res.redirect('/'))
          .catch(error=>console.log(error)); 
  })
  // app.post('/authors', (req,res)=>{ 
  //   authorCollection.insertOne(req.body)
  //       .then(result=>res.redirect('/'))
  //       .catch(error=>console.log(error));
  // });

    app.post('/comments/:id',(req,res)=>{
      commentCollection.insertOne({comment: req.body.comment,_id: req.body._id, name:req.user.name, article_id:req.params.id, date:req.body.startdate, photo:req.user.photo })
        .then(result=>{console.log(req.user);res.redirect('/articles/'+req.params.id)})
        .catch(error=>console.log(error));

    })
    app.get('/author/:id',(req,res)=>{
      res.render('author.ejs',{user: req.user, isLogged: req.isAuthenticated() });
    })

  })
  .catch(error => console.error(error));
