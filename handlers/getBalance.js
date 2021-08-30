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

        return handlerInput.responseBuilder
            .addDirective({
                "type": "Connections.StartConnection",
                "uri": "connection://AMAZON.VerifyPerson/2",
                "input": {
                    "requestedAuthenticationConfidenceLevel": {
                        "level": 400,
                        "customPolicy": {
                            "policyName": "VOICE_PIN"
                        }            
                    }
                }
            })
            .getResponse();
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