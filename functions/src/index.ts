import * as admin from "firebase-admin";
import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Initialize the Firebase Admin SDK.
// This is required for any backend function that needs to interact
// with Firebase services like Authentication or Firestore.
admin.initializeApp();

/**
 * A simple "Hello World" callable function.
 *
 * This function can be called from your client-side code and demonstrates
 * how to use v2 callable functions with App Check enforcement.
 *
 * @see https://firebase.google.com/docs/functions/callable
 */
export const helloWorld = onCall(
  {
    // Enforce App Check, rejecting requests with invalid or missing tokens.
    // This is a crucial security measure for protecting your backend.
    enforceAppCheck: true,
  },
  (request) => {
    // Log the incoming request for debugging purposes.
    logger.info("Executing 'helloWorld' function", {
      auth: request.auth,
      data: request.data,
      app: request.app, // App Check token details
    });

    // You can access authenticated user's details from the request context.
    const uid = request.auth?.uid;
    const email = request.auth?.token.email || "Guest";

    // Data passed from the client, with a default value.
    const clientMessage = request.data.text || "No message sent";

    // Construct and return the response object.
    return {
      reply: `Hello, ${email}! Your Cloud Function received the message: "${clientMessage}"`,
      serverTimestamp: new Date().toISOString(),
      userId: uid,
    };
  },
);
