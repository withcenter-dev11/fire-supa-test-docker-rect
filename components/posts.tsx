import { signOut } from "firebase/auth";
import React, { FormEvent } from "react";
import { auth } from "../lib/firebase-setup";
import { createClient } from "@supabase/supabase-js";

import { Database } from "../database.types";
import { InputElement } from "./input-element";

const supabase = createClient<Database>(
  "https://sgtuktfdkktaxhbkcswy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndHVrdGZka2t0YXhoYmtjc3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwODMwNDksImV4cCI6MjA1OTY1OTA0OX0.2eAQIx2HAMTDZfedP6x6w_l847RwZYwYOOp67f5ViB0",
  {
    accessToken: async () => {
      console.log("auth: " + (await auth.currentUser?.getIdToken()));
      return (
        (await auth.currentUser?.getIdToken(/* forceRefresh */ false)) ?? null
      );
    },
  }
);

const Posts = () => {
  interface Post {
    created_at: string;
    id: number;
    post_body: string | null;
    post_title: string | null;
  }

  const [posts, setPosts] = React.useState<Post[]>([]);

  async function getInstruments(firebase_user_id: string) {
    console.log("firebase_user_id: " + firebase_user_id);
    const { data, error } = await supabase.from("post").select();

    console.log(data);

    console.log(error);

    if (data) {
      setPosts(data);
    }
  }

  async function addPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const firebase_user_uid = auth.currentUser?.uid;

    if (!firebase_user_uid) {
      alert("firebase user id is missing");
      return;
    }

    const { data: newData, error } = await supabase
      .from("post")
      .insert([
        { post_title: title, post_body: body, user_id: firebase_user_uid },
      ])
      .select();

    if (newData) {
      setPosts([...posts, newData[0]]);
    }

    if (error) {
      throw error;
    } else {
      alert("post inserted successfully");
    }
  }

  React.useEffect(() => {
    if (auth.currentUser?.uid) {
      getInstruments(auth.currentUser?.uid);
    }

    auth.currentUser
      ?.getIdTokenResult()
      .then((token) => console.log({ token }));
  }, []);

  return (
    <div className="bg-white p-20 rounded-lg flex flex-col items-center">
      <div className="flex flex-col gap-2">
        {posts.map((post, index) => (
          <div className="border border-gray-500 p-1" key={index}>
            {JSON.stringify(post)}
          </div>
        ))}
      </div>

      <form
        className="bg-white p-20 rounded-lg flex flex-col items-center"
        onSubmit={(e) => addPost(e)}
      >
        <section className="text-4xl mb-[40px]  -mt-5">Add Post</section>

        <div className="flex flex-col gap-5">
          <InputElement
            label="Post Title"
            type="text"
            name="title"
            required={true}
          />
          <InputElement
            label="Post Body"
            type="text"
            name="body"
            required={true}
          />
          <button
            type="submit"
            className="p-3 mt-5 bg-violet-500 rounded-lg text-white hover:bg-violet-700 cursor-pointer"
          >
            Submit
          </button>

          <button
            type="button"
            onClick={() => signOut(auth)}
            className="p-3 mt-5 bg-violet-500 rounded-lg text-white hover:bg-violet-700 cursor-pointer"
          >
            Log out
          </button>
        </div>
      </form>
    </div>
  );
};

export default Posts;
