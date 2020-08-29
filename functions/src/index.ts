import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';


admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
 export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
 });

 export const listestab = functions.https.onRequest(async(request, response) => {

    const docs = await admin.firestore().collection('estabelecimentos').get()
    response.send(docs.docs.map(doc => doc.data))
 });


 export const telegram = functions.https.onRequest(async(request, response) => {

   
 })