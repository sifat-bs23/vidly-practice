const expree = require('express');
const Joi = require('@hapi/joi');
const app = expree();
app.use(expree.json());

let allGenres = [
    {
        id: 1,
        name: 'Action'
    },
    {
        id: 2,
        name: 'Drama'
    },
    {
        id: 3,
        name: 'Romance'
    },
];

function getGenreById(id){
    for(let i=0; i < allGenres.length ; i++){
        if(allGenres[i]['id'] === id){
            return allGenres[i];
        }
    }
    return null;
}

function getGenreIndexById(id){
    for(let i=0; i < allGenres.length ; i++){
        if(allGenres[i]['id'] === id){
            return i;
        }
    }
    return null;
}

function validateData(genre){

    const schema = Joi.object({
        id: Joi.number().integer(),
        name: Joi.string().min(3).max(50).required(),
    });
    const currentSchema = schema.validate(genre);
    if(!currentSchema.error)
        return {
            status: 'valid'
        }
    else
        return {
            status: 'invalid',
            error: currentSchema.error.details[0].message
        }
}

function updateGenre(genre){
    for (let i=0; i < allGenres.length ; i++){
        if(genre['id'] === allGenres[i]['id']){
            allGenres[i]['name'] = genre['name'];
            return true;
        }
    }
    return false;
}

app.get('/', (request, response)=>{
    response.send('Welcome to movie!!!');
});

app.get('/api/genres', (request, response) => {
    response.send(allGenres);
});

app.get('/api/genres/:id', (request, response) => {
    const genreId = parseInt(request.params.id);
    var currentGenre = getGenreById(genreId);
    if(currentGenre){
        response.send(currentGenre);
    }
    return response.status(400).send('Can not Find');

});

app.post('/api/genres', (request, response) => {
    let newGenre = {
        id: allGenres.length + 1,
        name: request.body.name
    };
    let checkValidation = validateData(newGenre);
    if(checkValidation['status'] === 'valid'){
        allGenres.push(newGenre);
        response.send(newGenre);
    }else{
        return response.status(400).send(checkValidation['error']);
    }
});

app.put('/api/genres/:id', (request, response) => {
    let genreId = parseInt(request.params.id);
    let name = request.body.name;
    let currentGenre = getGenreById(genreId);
    if(currentGenre){
        let updatedGenreData = {
            id: currentGenre['id'],
            name: name
        };
        let checkValid = validateData(updatedGenreData);
        if(checkValid['status'] == 'valid'){
            if(updateGenre(updatedGenreData)){
                response.send(updatedGenreData);
            }else{
                return response.status(400).send(`Can not update the genre`);
            }
        }else{
            return response.status(400).send(checkValid['error']);
        }
    }else{
        return response.status(400).send(`Genre doesn't exist`);
    }
});

app.delete('/api/genres/:id', (request, response) => {
    let genreId = parseInt(request.params.id);
    let genreIndex = getGenreIndexById(genreId);
    if(genreIndex){
        let currentGenre = allGenres[genreIndex];
        allGenres.splice(genreIndex, 1);
        response.send(currentGenre);
    }else{
        return response.status(400).send('Genre not found');
    }

});

const port = process.env.PORT || 3000;
app.listen(port);