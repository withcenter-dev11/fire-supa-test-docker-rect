import React, { FormEventHandler } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase-setup";
import { InputElement } from "./input-element";
import { FirebaseError } from "firebase/app";

export function LoginForm() {
  const [signedIn, setSignedIn] = React.useState<string | null | undefined>();

  onAuthStateChanged(auth, () => {
    setSignedIn(auth.currentUser?.email);
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("User signed in successfully");
      })
      .catch((error) => {
        console.log(error);
        if (error instanceof FirebaseError) {
          console.log(error.message);

          if (error.message === "Firebase: Error (auth/invalid-credential).") {
            alert("Wrong email or password");
          }
        } else {
          alert("something went wrong");
        }
      });
  };
  return (
    <form
      className="bg-white p-20 rounded-lg flex flex-col items-center"
      onSubmit={(e) => handleSubmit(e)}
    >
      <section className="text-4xl mb-3 -mt-5">Login </section>

      <h1 className=" mb-[40px]">{signedIn ? `User: ${signedIn}` : ""}</h1>

      <div className="flex flex-col gap-5">
        <InputElement label="Email" type="email" name="email" required={true} />
        <InputElement
          label="Password"
          type="password"
          name="password"
          required={true}
        />
        <button
          type="submit"
          className="p-3 mt-5 bg-violet-500 rounded-lg text-white hover:bg-violet-700 cursor-pointer"
        >
          Login
        </button>
      </div>
    </form>
  );
}
