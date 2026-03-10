// JSONPlaceholder types
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
}

// Task representation (mapped from Post)
export interface Task {
  id: number;
  userId: number;
  title: string;
  body: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  createdAt: string;
}

export interface CreateTaskInput {
  title: string;
  body: string;
  userId: number;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: number;
}

export type SortField = "id" | "title" | "status" | "priority" | "userId";
export type SortDirection = "asc" | "desc";
export type FilterStatus = "all" | "todo" | "in-progress" | "done";
export type FilterPriority = "all" | "low" | "medium" | "high";
