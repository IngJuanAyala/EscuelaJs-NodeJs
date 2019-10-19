const express = require('express');
const app = express();

const { config } = require('./config/index');

const moviesApi  = require('./routes/movies.js');

moviesApi(app);

// app.get('/', function(req, res){
//     res.send('hello world');
// });

// app.get('/json', function(req, res){
//     res.json({hello: 'world'});
// });

// app.get('/year', function(req, res){
//     const year = req.params.year;
  
//    let isLeapYear='El año ${year} no es bisiesto';
  
//     if((year % 4 === 0)&&((year % 100 !== 0)||(year % 400 === 0))){
//       isLeapYear = 'El año ${year} es bisiesto';
//     }
//     res.send(isLeapYear);
//   });


app.listen(config.port, function(){
    console.log('Listening http://localhost:${config.port}')
});