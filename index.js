const _ = require('lodash');
const express = require('express');
const jsonfile = require('jsonfile');

const FILE = 'pokedex.json';

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

/**
 * ===================================
 * Routes
 * ===================================
 */

// app.get('/:id', (request, response) => {

//   // get json from specified file
//   jsonfile.readFile(FILE, (err, obj) => {
//     // obj is the object from the pokedex json file
//     // extract input data from request
//     let inputId = parseInt( request.params.id );

//     var pokemon;

//     // find pokemon by id from the pokedex json file
//     for( let i=0; i<obj.pokemon.length; i++ ){

//       let currentPokemon = obj.pokemon[i];

//       if( currentPokemon.id === inputId ){
//         pokemon = currentPokemon;
//       }
//     }

//     if (pokemon === undefined) {

//       // send 404 back
//       response.status(404);
//       response.send("not found");
//     } else {

//       response.send(pokemon);
//     }
//   });
// });
//
app.get('/pokemon/:id', (request, response) => {
  // get json from specified file
  jsonfile.readFile(FILE, (err, obj) => {
    let inputId = parseInt( request.params.id );
    let chooseType =        '<form method="POST" action="/pokemon/test">'+
                            'What type is this? ' + '<br>' +
                            'Type:     <input type="text" name="type">'+ '<br>' +
                            'ID:     <input type="text" name="id" value="'+ inputId +'">'+ '<br>' +
                            '<input type="submit" value="Submit">'+ '<br>' +
                            '</form>';
    // obj is the object from the pokedex json file
    // extract input data from request


    var pokemon;

    // find pokemon by id from the pokedex json file
    for( let i=0; i<obj.pokemon.length; i++ ){

      let currentPokemon = obj.pokemon[i];

      if( currentPokemon.id === inputId ){
        pokemon = currentPokemon;
      }
    }

    if (pokemon === undefined) {

      // send 404 back
      response.status(404);
      response.send("not found");
    } else {
        console.log(pokemon.id);
      response.send(chooseType + '<br>'+ 'Name: '+pokemon.name +'<br>' +'id: '+pokemon.id);
      // chooseType + '<br>' +
    }
  });
});

app.post('/pokemon/test', (request,response)=>{

    jsonfile.readFile(FILE, (err,obj)=>{

        let pokemonId = parseInt(request.body.id)-1;
        let target = obj.pokemon[pokemonId];
        console.log(target);
        if(target === undefined){
            response.send('Id not found. Is this a new pokemon?');
        }
        obj.pokemon[pokemonId].type = request.body.type;

    response.send('Added type:' + request.body.type + '. To ' + obj.pokemon[pokemonId].name +'. Gotta catch some more?');
    jsonfile.writeFile(FILE, obj, (err)=>{
            if(err !== null){
                console.log(err);
            }
        });
    });
})
//intercepts a GET request. responses with a form. User fills inputs. Submits to /pokemon
app.get('/pokemon/new', (request,response)=>{
    let newRespondForm  = '<h1>Fake PokeDex</h1>'+
                            '<form method="POST" action="/pokemon">'+
                            'Choose your PokeMon:' + '<br>' +
                            'Pokemon ID:     <input type="text" name="id">'+ '<br>' +
                            'Pokemon Number: <input type="text" name="num">'+ '<br>' +
                            'Pokemon Name:   <input type="text" name="name">'+ '<br>' +
                            'How does it look like? (put an img link dude): <input type="text" name="img">'+ '<br>' +
                            'Height: <input type="text" name="height">'+ '<br>' +
                            'Weight: <input type="text" name="weight">'+ '<br>' +
                            '<input type="submit" value="Submit">'+ '<br>' +
                            '</form>';

    response.send(newRespondForm);
});

//accepts a POST request. Dissects request to read and write into a json file. Responses to browser with input provided.
app.post('/pokemon', (request,response)=>{
    console.log(request.body);
    let returnForm  = '<div> <h1>Fake PokeDex Display</h1>'+
                            '<div>' + request.body.id + '</div>' +
                            '<div>' + request.body.num + '</div>' +
                            '<div>' + request.body.name + '</div>' +
                            // '<div>' + request.body. + '</div>' +
                            '<div>' + request.body.height + '</div>' +
                            '<div>' + request.body.weight + '</div></div>';

    response.send(returnForm);
    jsonfile.readFile(FILE, (err,obj)=>{
        let pokemonEntry = {};

        pokemonEntry.id = request.body.id;
        pokemonEntry.num = parseInt(request.body.num);
        pokemonEntry.name = request.body.name;
        pokemonEntry.img = request.body.img;
        pokemonEntry.height = request.body.height;
        pokemonEntry.weight = request.body.weight;

        obj.pokemon.push(pokemonEntry);

        jsonfile.writeFile(FILE, obj, (err)=>{
            if(err !== null){
                console.log(err);
            }
        });
    });
})



// not too efficient on root path. readfile in each conditional. Could look into having readfile first, conditionals all inside.
app.get('/', (request, response) => {
    console.log(request.query.sortby);

    jsonfile.readFile(FILE, (err,obj)=>{
        let sortButton = ' <form method="GET" > '+
                    '<select name="sortby">' +
                    '<option value="">Choose an Option</option>' +
                    '<option value="id">By id</option>' +
                    '<option value="name">By Name </option>'+
                    '<option value="num">By num</option>'+
                    '</select>'+
                    '<input type="submit" value="Sort by">'+
                    '</form>';
        let pokemonListArr = [];
        let stringList = "";

        if(request.query.sortby == undefined){
        console.log('dude wtf');
        response.send(sortButton + 'hello. Choose an option.');
        }else if(request.query.sortby === 'id' || request.query.sortby === 'num'){
        console.log('dude wtf over here');
        for(i=0; i<obj.pokemon.length;i++){//id and name into a string, push string into array
            pokemonListArr.push(obj.pokemon[i].id + '. ' + obj.pokemon[i].name);
        }
        console.log(pokemonListArr);
        //creates empty string variable. Adds each item on the array to the string. To make a longer string.
        for(let i=0; i<pokemonListArr.length;i++){
            stringList = stringList + pokemonListArr[i] + '<br>' + " " ;
        }
        response.send(sortButton + '<br>' + stringList);
        } else if(request.query.sortby === 'name'){
        for(i=0; i<obj.pokemon.length ;i++){
            //creates a new object. for id and name.
            let pokemonListObj = {};
            pokemonListObj.id = obj.pokemon[i].id;
            pokemonListObj.name = obj.pokemon[i].name;
            // pushes object into arr.
            pokemonListArr.push(pokemonListObj);
        }
        //sorts based on alphabet
        pokemonListArr.sort(function(a, b) {
          return a.name.localeCompare(b.name);
        });
        console.log(pokemonListArr);
        ////creates empty string variable. Adds each object key as a string to the empty string variable. To make a longer string.
        for(let i=0; i<pokemonListArr.length;i++){
            stringList = stringList + '~' + pokemonListArr[i].name + "<p>  </p>(" + 'Pokedex Id. '+ pokemonListArr[i].id + ')' + '<br>' + " " ;
        }
        response.send(sortButton + '<br>' + stringList);
        }
    });
});



/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));