export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
