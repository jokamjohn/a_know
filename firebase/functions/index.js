// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const googleAssistanceRequest = "google";

const ACRONYMS = 'acronyms';

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  // Initialize Firebase Admin SDK.
  let db = admin.firestore();

  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  const parameters = request.body.queryResult.parameters;

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
}

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
   function yourFunctionHandler(agent) {
     agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
     agent.add(new Card({
         title: `Title: Andela know`,
         imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
         text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
         buttonText: 'This is a button',
         buttonUrl: 'https://assistant.google.com/'
       })
     );
     agent.add(new Suggestion(`Quick Reply`));
     agent.add(new Suggestion(`Suggestion`));
     agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
   }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', getAcronymInFull);`
  // // below to get this function to be run when a Dialogflow intent is matched
   function getAcronymInFull(agent) {
     let nameRef = db.collection(ACRONYMS).doc(parameters.Acronym);
     return nameRef.get()
         .then(doc => {
           if (!doc.exists) {
             agent.add('Sorry we cannot find that acronym')
           } else {
             agent.add(doc.data().description)
           }
         })
         .catch(err => {
           console.log('Error getting document', err);
         });
   }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('GetTeamByName', yourFunctionHandler);
  intentMap.set('GetAcronymMeaning', getAcronymInFull);
  agent.handleRequest(intentMap);
});
