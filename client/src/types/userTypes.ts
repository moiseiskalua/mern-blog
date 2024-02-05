export interface UserProps {
    profilePicture?: string;
    username?: string;
    email?: string;
    password?: string;
    _id?: string;
    isAdmin?: boolean;
}
  
export interface UserStateProps {
    currentUser: UserProps | null;
    error?: Error | null | undefined;
    loading: boolean;
  }
  
export interface RootStateProps {
    user: UserStateProps;
}