import { signOut } from "firebase/auth";
import React, { FormEvent, useState } from "react";
import { auth } from "../lib/firebase-setup";
import { InputElement } from "./input-element";
import { addPost, deletePost, getPosts } from "../lib/supabase-functions";

interface Post {
  created_at: string;
  id: number;
  post_body: string | null;
  post_image: string | null;
  post_title: string | null;
  user_id: string;
}

const Posts = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [pageError, setPageError] = useState<string>();
  const [fetchPostsLoading, setFetchPostsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  async function handleAddPost(e: FormEvent<HTMLFormElement>) {
    setLoading(true);
    const firebase_user_uid = auth.currentUser?.uid;

    if (!firebase_user_uid) {
      console.log("firebase uid is required");
      return;
    }

    const { data, error } = await addPost(e, firebase_user_uid);

    if (error) {
      setPageError(error);
      throw error;
    }

    if (data) {
      setPosts([...posts, data[0]]);
    }

    setLoading(false);
  }

  async function handleDeletePost(
    postId: number,
    imagePath: string | undefined
  ) {
    setLoading(true);
    const { data, error } = await deletePost(postId, imagePath);

    if (error) {
      setPageError(`: ${error.name} - ${error.message}`);
      throw error;
    }

    if (data) {
      const _posts = posts.filter((item) => item.id !== postId);
      setPosts(_posts);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    (async () => {
      if (auth.currentUser?.uid) {
        setFetchPostsLoading(true);
        const { data, error } = await getPosts(auth.currentUser.uid);

        if (error) {
          setPageError(`${error.code}: ${error.name} - ${error.message}`);
          throw error;
        }

        if (data) {
          setPosts(data);
        }
        setFetchPostsLoading(false);
      } else {
        console.log("cannot fetch posts, missing firebase uid");
      }
    })();
  }, []);

  return (
    <div className="bg-white p-20 rounded-lg flex flex-col items-center max-w-[80%] max-h-[80%] overflow-x-scroll">
      <form
        className="bg-white p-20 rounded-lg flex flex-col items-center"
        onSubmit={(e) => handleAddPost(e)}
      >
        <section className="text-4xl mb-[40px] -mt-10">Add Post</section>

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

          <input name="post_image" type="file" />
          <button
            type="submit"
            disabled={loading}
            className={
              loading
                ? "p-3 mt-5 bg-violet-900 rounded-lg text-white hover:bg-violet-700 cursor-pointer"
                : "p-3 mt-5 bg-violet-500 rounded-lg text-white hover:bg-violet-700 cursor-pointer"
            }
          >
            {loading ? "Loading" : "Submit"}
          </button>

          {pageError && (
            <div className="text-red-500 bg-red-500/20">{pageError}</div>
          )}

          <button
            type="button"
            onClick={() => signOut(auth)}
            className="p-3 mt-5 bg-violet-500 rounded-lg text-white hover:bg-violet-700 cursor-pointer"
          >
            Log out
          </button>
        </div>
      </form>

      <PostsSection
        posts={posts}
        handleDeletePost={handleDeletePost}
        loading={loading}
        fetchPostsLoading={fetchPostsLoading}
      />
    </div>
  );
};

type PostContainerType = {
  posts: Post[];
  handleDeletePost: (
    postId: number,
    imageUrl: string | undefined
  ) => Promise<void>;
  loading: boolean;
  fetchPostsLoading: boolean;
};

function PostsSection({
  posts,
  handleDeletePost,
  fetchPostsLoading,
}: PostContainerType) {
  return (
    <div className="flex gap-3 items-center flex-wrap">
      {posts.map((singlePost, index) => (
        <PostItem
          post={singlePost}
          index={index}
          handleDelete={handleDeletePost}
        />
      ))}

      {fetchPostsLoading && <div>Loading...</div>}

      {posts.length === 0 && <div> No Posts</div>}
    </div>
  );
}

function PostItem({
  post,
  index,
  handleDelete,
}: {
  post: Post;
  index: number;
  handleDelete: (id: number, url: string | undefined) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>();
  return (
    <div className="border border-gray-500 p-1 rounded-md" key={index}>
      {isEdit ? (
        <div>
          {post.post_image ? (
            <section className="h-[250px] w-[350px]">
              <img
                height={500}
                width={500}
                src={
                  selectedImage ||
                  post.post_image + "?Date=" + new Date().getMilliseconds()
                }
              />
              <input
                type="file"
                multiple={false}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];

                    const reader = new FileReader();
                    reader.onload = (res) => {
                      if (res.target) {
                        setSelectedImage(res.target.result as string);
                      }
                    };

                    reader.readAsDataURL(file);
                  }
                }}
              />
            </section>
          ) : (
            <section className="w-[350px] h-[200px] flex items-center justify-center">
              <h2>no image</h2>
            </section>
          )}
          <div className="flex flex-col [&>section]:flex [&>section]:justify-between [&>section]:w-[70%] [&>section]:items-center  gap-1">
            <section>
              <label>Title: </label>
              <input type="text" defaultValue={post.post_title || ""} />
            </section>
            <section>
              <label>Body: </label>
              <input type="text" defaultValue={post.post_body || ""} />
            </section>
          </div>
        </div>
      ) : (
        <div>
          {post.post_image ? (
            <section className="h-[200px] w-[350px] ">
              <img
                height={500}
                width={500}
                src={post.post_image + "?Date=" + new Date().getMilliseconds()}
              />
            </section>
          ) : (
            <section className="w-[350px] h-[200px] flex items-center justify-center">
              <h2>no image</h2>
            </section>
          )}
          <section>{post.post_title}</section>
          <section className=" indent-2.5">
            {post.post_body?.substring(0, 15)}
          </section>
        </div>
      )}

      <button
        disabled={loading}
        onClick={() =>
          handleDelete(
            post.id,
            post.post_image
              ? `${
                  post.post_image?.split("/")[
                    post.post_image.split("/").length - 2
                  ]
                }/${
                  post.post_image?.split("/")[
                    post.post_image.split("/").length - 1
                  ]
                }`
              : undefined
          )
        }
        className="delete-button"
      >
        Delete
      </button>

      <button
        onClick={() => setIsEdit(!isEdit)}
        className="edit-button"
        disabled={loading}
      >
        {isEdit ? "Save" : "Edit"}
      </button>

      {isEdit && (
        <button
          onClick={() => setIsEdit(false)}
          className="edit-button"
          disabled={loading}
        >
          Cancel
        </button>
      )}
    </div>
  );
}

function ViewItem() {}

export default Posts;
