export interface UserProps {
    profilePicture?: string;
    username?: string;
    email?: string;
    password?: string;
}
  
export interface UserStateProps {
    currentUser: UserProps | null;
  }
  
export interface RootStateProps {
    user: UserStateProps;
}