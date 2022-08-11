const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany()
  })
 // Run your code here, after you have insured that the connection was made
 .then(() => {
  createSingleRecipeObjectUsingModel()
  .then(() => createMultipleRecipeObjects())
  .then(() => updateOneSavedRecipeData())
  .then(() => deleteOneSaveDRecipetData())
})
  .then(() => closeConnect())
  .catch(error => {
    console.error('Error connecting to the database', error);
  });

const recipeObj = {
  title: 'menemen',
  level: 'Easy Peasy',
  ingredients: [
    '3 egges',
    '1 onion',
    '2 peppers',
    '3 tomatos',
    'salt',
    '1 tablespoons olive oil'
  ],
  cuisine: 'Turkish',
  dishType: 'breakfast',
  image: 'https://images.media-allrecipes.com/images/75131.jpg',
  duration: 20,
  creator: 'Ece',
};

// CREATE ONE
const createSingleRecipeObjectUsingModel = () =>
  Recipe.create(recipeObj)
    .then((results) => console.log(`Saved new recipe: ${results.title}`))
    .catch((saveErr) => console.error(`Save failed: ${saveErr}`));

// CREATE MANY
const createMultipleRecipeObjects = () =>
  Recipe.insertMany(data)
    .then((results) => results.forEach((recipe) => console.log(recipe.title)))
    .catch((saveErr) => console.error(`Save failed: ${saveErr}`));

// UPDATE
const updateOneSavedRecipeData = () =>
  Recipe.findOneAndUpdate(
    { title: 'Rigatoni alla Genovese' },
    { duration: 100 }
  )
    .then(() => console.log(`Recipe is updated: duration has been changed`))
    .catch((saveErr) => console.error(`Save failed: ${saveErr}`));

// DELETE
const deleteOneSaveDRecipetData = () =>
  Recipe.deleteOne({ title: 'Carrot Cake' })
    .then(() => console.log(`Recipe successfully deleted`))
    .catch((saveErr) => console.error(`Save failed: ${saveErr}`));

const closeConnect = () =>
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log(`Mongo connection disconnected`);
      process.exit(0);
    });
  });