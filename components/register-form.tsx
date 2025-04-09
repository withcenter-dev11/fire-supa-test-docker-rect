"use client";
import React, { FormEventHandler } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase-setup";
import { InputElement } from "./input-element";

export function RegisterForm() {
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
      .then((user) => {
        alert("User created successfully");

        // setCustomClaim(user.user.uid);
      })
      .catch((error) => {
        alert(error);
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
