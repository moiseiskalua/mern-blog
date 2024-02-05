import { useAppSelector } from "../hooks/useAppSelector";
import { RootStateProps } from "../types/userTypes";
import { Outlet, Navigate } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {
  const { currentUser } = useAppSelector((state: RootStateProps) => state.user)
  return currentUser && currentUser?.isAdmin ? <Outlet/> : <Navigate to='/sign-in'/>
}

export default OnlyAdminPrivateRoute;