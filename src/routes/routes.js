import {
  addNewThought,
  getThoughts,
  getThoughtByName,
  updateThought,
  deleteThought,
} from '../controllers/thoughtControllers';

const routes = (app) => {
  //users endpoint
  app
    .route('/users')
    .get((req, res) => res.send('GET request successful.'))
    .post((req, res) => res.send('POST request successful.'));

  app
    .route('/users/:userName')
    .get((req, res) => res.send('GET request successful'))
    .put((req, res) => res.send('PUT request successful.'))
    .delete((req, res) => res.send('delete request successful'));

  app.route('/thoughts').post(addNewThought).get(getThoughts);
  app
    .route('/thoughts/:thoughtName')
    .get(getThoughtByName)
    .put(updateThought)
    .delete(deleteThought);
};

export default routes;
