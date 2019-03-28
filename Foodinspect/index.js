const path = require('path');
//permet de prendre en compte la syntaxe de javascript ES6
require('babel-register');
//va nous permettre de creer les route et presque toute la logiue de notre app nodejs
const express = require('express');
const morgan = require('morgan');
//initialisation de notre variabe app a partir du require express fait a la rigne 2
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
//appelle du module mysql pour nous permettre de faire de sinteractions vers notre bd
const mysql = require('mysql');
var fs = require("fs");
var fileUpload = require('express-fileupload');
var formidable = require('formidable');
const PORT = 3000 ;
var fs = require("fs");

//initialisation du model de template (moi j'utilise ejs et s'est ce qui est conseiller pour les nouveaux mais vous pouvez utiliser celui que vous voulez)
app.set('view engine', 'hbs');
//indiquez ou es ce que votre serveur doit aller chercher les pages (html) que vous renvoyez au travers de vos requetes
app.set('views', './views');
app.set('views',path.join(__dirname,'views'));

//appel des middlewares 
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use('/public',express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));


//je vais d'abord en premiere position initialiser le coordonnées de la base de données pour pouvoir me connecter a la bd
const db = mysql.createConnection({
    host: 'localhost', 
    database:'nodejs', 
    user: 'root', 
    password: '' ,
    // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
})

db.connect((err)=>{
    if(err){
        console.log(err.message); 
    }else{
    	
        console.log('Vous êtes connecté a la base de donnée')
    }
})

//je vais maintenant creer mes routes avec express au travers de ma variable app

app.get('/', (req, res) => {
   let titre = "FoodRegistre"
    res.status(200).render('index', {
        title: titre,
    })
});



app.get('/ajout', (req, res) => {
   let titre = "FoodRegistre"
    res.status(200).render('ajout', {
        title: titre,
    })
});
app.get('/liste', (req, res)=>{
    let titre = "FoodRegistre"
    let sql = "SELECT * FROM recette";
    let query = db.query(sql, (err, results) => {
    if(err) throw err;
    res.status(200).render('liste',{
      results: results, title: titre
    });
  });


});



//route pour inserer recette
app.post('/save',(req, res) => {
  
  let data = {nom: req.body.nom,ingredients: req.body.ingredients, preparation: req.body.preparation, type:req.body.value, image:req.body.image};
  let sql = "INSERT INTO recette SET ?";
  let query = db.query(sql, data,(err, results) => {
    if(err) throw err;

    if (true) {}
    res.redirect('/liste');
  });
});

//uploader image
app.post('/image', function (req, res) {

   var file = __dirname + "/public" + req.files.file.name;
   fs.readFile( req.files.file.path, function (err, data) {
        fs.writeFile(file, data, function (err) {
         if( err ){
              console.log( err );
         }else{
               response = {
                   message:'File uploaded successfully',
                   filename:req.files.file.name
              };
          }
        
          res.end( JSON.stringify( "") );
       });
   });
})


//route pour supprimer recette
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM recette WHERE id="+req.body.id+"";
  let query = db.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/liste');
  });
});

 
//lancer l'application sur un port quelconque ! par default nodejs ecoute sur le 3000
app.listen(PORT, () => {
    console.log(`le serveur est lancé sur le port ${PORT}`) //syntaxe ES6
    console.log('le serveur est lancé sur le port ' + PORT) //syntaxe javascript basique
})
