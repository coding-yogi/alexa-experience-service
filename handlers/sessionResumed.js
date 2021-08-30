const Alexa = require('ask-sdk-core');
const axios = require('axios');

module.exports = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionResumedRequest';
    },
    handle(handlerInput) {

        const scope = 'getbalance';
        const person = handlerInput.requestEnvelope.context.System.person;

        //Check if person is identified
        if(person == undefined) {
            return handlerInput.responseBuilder
                .speak("Sorry, you are not authorized to use this skill")
                .getResponse();
        }

        const token = person.accessToken;
        const confidenceLevel = person.authenticationConfidenceLevel.level;

        console.log("token retrieved from request " + token);

        //check if token exists
        if(token == undefined) {
            return handlerInput.responseBuilder
                .speak("Sorry, I am not authorized to serve this request")
                .getResponse();
        }

        console.log("confidence level is " + confidenceLevel);

        //check if confidence level with Voice + PIN == 400
        if(confidenceLevel < 400) {
            return handlerInput.responseBuilder
                .speak("Sorry, I am unable to verify your identity")
                .getResponse();
        }

        //validate token
        return validateToken(token, scope)
        .then((data) => {
            isTokenValid = data.active;
            console.log("token status is " + isTokenValid);
            speechText = "Sorry, I am not authorized to serve this request"

            if (isTokenValid) {
                console.log("getting balance for user " + data.sub);
                speechText = 'Your balance is S$2175.32';
            } else  {
                console.log("token is invalid");
            }
            
            //respond
            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();

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
    const tokenEndpoint = process.env.INTROSPECT_ENDPOINT
    const params = new URLSearchParams()
    params.append('token', token)
    params.append('scope', scope)

    const headers = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    return axios.post(tokenEndpoint, params, headers)
        .then((result) => result.data)
        .catch((err) => {
            console.log("error occured while instrospecting the token " + err);
            false
        });
};