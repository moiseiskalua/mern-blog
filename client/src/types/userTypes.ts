export interface UserProps {
    profilePicture?: string;
    username?: string;
    email?: string;
    password?: string;
    _id?: string;
}
  
export interface UserStateProps {
    currentUser: UserProps | null;
    error?: Error | null | undefined;
  }
  
export interface RootStateProps {
    user: UserStateProps;
}