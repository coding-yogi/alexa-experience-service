const Alexa = require('ask-sdk-core');
const axios = require('axios');

module.exports = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'getBalance';
    },
    handle(handlerInput) {
        //log the trigger of intent
        console.log("request received for get balance intent")

        //Get token and validate it
        const scope = 'getbalance';
        const token = Alexa.getAccountLinkingAccessToken(handlerInput.requestEnvelope)
        console.log("token retrieved from request " + token);

        //validate token
        return validateToken(token, scope)
        .then((isTokenValid) => {
            console.log("token status is " + isTokenValid);

            if (isTokenValid) {
                //check if token is active
                speechText = 'Your balance is S$2175.32';
                return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();
            } else  {
                console.log("error occured while introspecting token " + err);
                return handlerInput.responseBuilder
                .speak("Sorry, error occurred while processing your request, please try again later")
                .getResponse();
            }
        })
        .catch((err) => {
            console.log("error occured while introspecting token " + err);
                return handlerInput.responseBuilder
                .speak("Sorry, error occurred while processing your request, please try again later")
                .getResponse();
        });
    }
};

function validateToken(token, scope) {
    console.log("checking validity of the token " + token);
    const tokenEndpoint = "http://localhost:9001/oauth2/introspect"
    const params = new URLSearchParams()
    params.append('token', token)
    params.append('scope', scope)

    const headers = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    return axios.post(tokenEndpoint, params, headers)
        .then((result) => result.data.active)
        .catch((err) => false);
};