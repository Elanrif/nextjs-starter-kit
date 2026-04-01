"use server";

import { createPost, updatePost, deletePost } from "@/lib/posts/services/post.service";
import { PostCreate, PostUpdate } from "@/lib/posts/models/post.model";
import { revalidatePath } from "next/cache";

/*⚠️ We dont use await function, because we are not waiting for the result */

export async function createPostAction(data: PostCreate) {
  const result = await createPost(data);
  if (result.ok) {
    revalidatePath("/posts");
  }
  return result;
}

export async function updatePostAction(id: number, data: PostUpdate) {
  const result = await updatePost(id, data);
  if (result.ok) {
    revalidatePath("/posts");
  }
  return result;
}

export async function deletePostAction(id: number) {
  const result = await deletePost(id);
  if (result.ok) {
    revalidatePath("/posts");
  }
  return result;
}
