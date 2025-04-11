"use client";
import React, { FormEventHandler, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase-setup";
import { InputElement } from "./input-element";
import { addUser } from "../lib/supabase-functions";

export function RegisterForm() {
  const [pageError, setPageError] = useState<string>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (user) => {
        const { data, error } = await addUser(user.user.uid);

        if (error) {
          //delete firebase user if supabase user is not created
          auth.currentUser?.delete();
          setPageError(`${error.code}: ${error.name} - ${error.message}`);
        }

        if (data) {
          alert("User created successfully");
        }
      })
      .catch((error) => {
        setPageError(error);
      });
  };
  return (
    <form
      className="bg-white p-20 rounded-lg flex flex-col items-center"
      onSubmit={(e) => handleSubmit(e)}
    >
      <section className="text-4xl mb-[40px]  -mt-5">Register User</section>

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
          Submit
        </button>
      </div>
    </form>
  );
}
