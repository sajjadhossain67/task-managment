import type { Post, Task } from "./types";

// Deterministic mock enrichment based on post id
const STATUSES: Task["status"][] = ["todo", "in-progress", "done"];
const PRIORITIES: Task["priority"][] = ["low", "medium", "high"];

export function enrichPost(post: Post): Task {
  return {
    ...post,
    status: STATUSES[post.id % 3],
    priority: PRIORITIES[post.id % 3],
    createdAt: new Date(
      Date.now() - post.id * 24 * 60 * 60 * 1000,
    ).toISOString(),
  };
}

export function enrichPosts(posts: Post[]): Task[] {
  return posts.map(enrichPost);
}
