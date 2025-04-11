import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "../database.types";
import { auth } from "./firebase-setup";
import { FormEvent } from "react";
import { v4 as uuid } from "uuid";

export const supabase = createClient<Database>(
  "https://sgtuktfdkktaxhbkcswy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndHVrdGZka2t0YXhoYmtjc3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwODMwNDksImV4cCI6MjA1OTY1OTA0OX0.2eAQIx2HAMTDZfedP6x6w_l847RwZYwYOOp67f5ViB0",
  {
    accessToken: async () => {
      return (
        (await auth.currentUser?.getIdToken(/* forceRefresh */ false)) ?? null
      );
    },
  }
);

export async function addUser(firebase_uid: string) {
  const { data, error } = await supabase
    .from("user")
    .insert([{ firebase_uid }]);

  return { data, error };
}

export async function getPosts(firebase_user_id: string) {
  const { data, error } = await supabase
    .from("post")
    .select()
    .eq("user_id", firebase_user_id);

  return { data, error };
}

export async function addPost(
  event: FormEvent<HTMLFormElement>,
  firebase_user_uid: string
) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const post_image = formData.get("post_image") as File;

  //TODO: need to implement trasaction here.
  //TODO: need to handle the errors more
  //does not upload image if there is no image provided

  let imageUrl;
  if (post_image.size !== 0) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(`${firebase_user_uid}/${uuid()}`, post_image);
    imageUrl = uploadData?.path;
    if (uploadError) {
      return {
        error: `${uploadError.name} ${uploadError.message}`,
        data: null,
      };
    }
  }

  //get public url of uploaded image
  //if there is, set it to the imageUrl variable
  if (imageUrl) {
    const { data: publicUrl } = supabase.storage
      .from("uploads")
      .getPublicUrl(imageUrl);

    imageUrl = publicUrl.publicUrl;
  }

  const { data, error } = await supabase
    .from("post")
    .insert([
      {
        post_title: title,
        post_body: body,
        user_id: firebase_user_uid,
        post_image: imageUrl,
      },
    ])
    .select();

  if (error) {
    //delete the image if there is error uploading post
    await supabase.storage.from("uploads").remove([imageUrl]);
    return { error: `${error.code}: ${error.message}`, data: null };
  }

  return { error: null, data };
}

export async function deletePost(
  postId: number,
  imagePath: string | undefined
) {
  //TODO: need to handle the errors here more efficiently
  const { data, error } = await supabase
    .from("post")
    .delete()
    .eq("id", postId)
    .select("id");

  if (imagePath) {
    await supabase.storage.from("uploads").remove([imagePath]);
  }

  return { data, error };
}
