const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkId(request, response, next) {
  const { id } = request.params;
  repositoryIndex = repositories.findIndex((repository) => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'id not found' });
  }

  request.index = repositoryIndex;

  return next();
}

app.get('/repositories', (request, response) => {
  response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  response.json(repository);
});

app.put('/repositories/:id', checkId, (request, response) => {
  const { title, url, techs } = request.body;
  const { index } = request;

  repositories[index].title = title;
  repositories[index].url = url;
  repositories[index].techs = techs;

  response.json(repositories[index]);
});

app.delete('/repositories/:id', checkId, (request, response) => {
  const { index } = request;

  repositories.splice(index, 1);

  response.status(204).send();
});

app.post('/repositories/:id/like', checkId, (request, response) => {
  const { index } = request;

  repositories[index].likes++;

  response.json(repositories[index]);
});

module.exports = app;
