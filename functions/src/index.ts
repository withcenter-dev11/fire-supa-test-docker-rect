import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as v1 from "firebase-functions/v1";

initializeApp();

export const renSetCustomClaim = v1.auth.user().onCreate(async (user) => {
  try {
    // Set custom user claims on this newly created user.
    await getAuth().setCustomUserClaims(user.uid, { role: "authenticated" });
  } catch (error) {
    console.log(error);
  }
});
