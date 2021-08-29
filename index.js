const express = require('express');
const Alexa = require('ask-sdk-core');
const morgan = require('morgan');

const { ExpressAdapter } = require('ask-sdk-express-adapter');
const GetBalanceHandler = require('./handlers/getBalance.js');
const ErrorHandler = require('./handlers/error.js');

const skill_id = "amzn1.ask.skill.432b47cb-0fc5-43e5-99c8-6a17257c437c";

const LogRequestInterceptor = {
    process(handlerInput) {
        // Log Request
        console.log("==== REQUEST ======");
        console.log(JSON.stringify(handlerInput.requestEnvelope, null, 2));
    }
}
 
const LogResponseInterceptor = {
    process(handlerInput, response) {
        // Log Response
        console.log("==== RESPONSE ======");
        console.log(JSON.stringify(response, null, 2));
    }
}

const app = express();
const skillBuilder = Alexa.SkillBuilders.custom();
const skill = skillBuilder.withSkillId(skill_id)
    .addRequestHandlers(GetBalanceHandler)
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LogRequestInterceptor)
    .addResponseInterceptors(LogResponseInterceptor)
    .create();
const adapter = new ExpressAdapter(skill, true, true);

app.use(morgan('combined'));
app.post('/', adapter.getRequestHandlers());  
app.listen(3000);