var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'OpenAI Demo' });
});


// to keep API hidden in .env
const env = require("dotenv").config();

// OpenAI START
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// take care of the submit
router.post('/', async function(req, res) {
  let prompt = req.body.prompt
  console.log(`prompt:`, prompt)
  let answer = await sendRequest(prompt)
  console.log(`answer:`, answer)
  res.render('index', { title: 'OpenAI Demo', answer: answer.text });
});

// prepare and make the call to openAI
async function sendRequest(_prompt){
  const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: _prompt,
      temperature: 0.6,
      max_tokens: 600,
    });
  return response.data.choices[0]
}

module.exports = router;
