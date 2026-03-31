"use server";

import {
  createComment,
  updateComment,
  deleteComment,
} from "@/lib/comments/services/comment.service";
import { CommentCreate, CommentUpdate } from "@/lib/comments/models/comment.model";

/*⚠️ We dont use await function, because we are not waiting for the result */

export async function createCommentAction(data: CommentCreate) {
  return createComment(data);
}

export async function updateCommentAction(id: number, data: CommentUpdate) {
  return updateComment(id, data);
}

export async function deleteCommentAction(id: number) {
  return deleteComment(id);
}
