module.exports = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
        .speak('Sorry, Some error occurred while processing your request. Please try again later')
        //.reprompt('Sorry, I don\'t understand your command. Please say it again.')
        .getResponse();
    }
};
