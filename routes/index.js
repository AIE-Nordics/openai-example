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
  let messages = generateMessagesFromPrompt(req.body.prompt)
  console.log(`prompt:`, messages)
  let answer = await sendRequest(messages)
  console.log(`answer:`, answer)
  console.log(`answer:`, answer.message)
  res.render('index', { title: 'OpenAI Demo', answer: answer.message.content });
});

function generateMessagesFromPrompt(_prompt){
  return [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": _prompt},
  ]
}

// prepare and make the call to openAI
async function sendRequest(_messages){
  const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: _messages,
      temperature: 0.6,
      max_tokens: 600,
    });
  return response.data.choices[0]
}

module.exports = router;
