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

app.get('/:id', (request, response) => {

  // get json from specified file
  jsonfile.readFile(FILE, (err, obj) => {
    // obj is the object from the pokedex json file
    // extract input data from request
    let inputId = parseInt( request.params.id );

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

      response.send(pokemon);
    }
  });
});

app.get('/', (request, response) => {
  response.send('Hello......');
});

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
        pokemonEntry.num = request.body.num;
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

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

// app.post('/animals',(request,response)=>{

//     console.log(request.body);
//     response.send(request.body);
//     jsonfile.readFile('data.json', (err, obj)=>{
//         let thing = {};

//         thing.submit = request.body;
//         obj.stuff.push(thing);

//         jsonfile.writeFile('data.json',obj, (err) =>{
//             if(err !== null){
//                 console.log(err);
//             }
//         })
//     })
// });