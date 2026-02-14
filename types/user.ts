export interface User {
  id: string;
  clerk_id: string;
  role: 'USER' | 'ADMIN';
}

export interface Profile {
  id: number;
  user_id: number; 
  username: string;
  bio: string;
  // array of interests
  interests: string[];
  avatar_url: string;
}

