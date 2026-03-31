"use server";

import { createPost, updatePost, deletePost } from "@/lib/posts/services/post.service";
import { PostCreate, PostUpdate } from "@/lib/posts/models/post.model";

/*⚠️ We dont use await function, because we are not waiting for the result */

export async function createPostAction(data: PostCreate) {
  return createPost(data);
}

export async function updatePostAction(id: number, data: PostUpdate) {
  return updatePost(id, data);
}

export async function deletePostAction(id: number) {
  return deletePost(id);
}
