import { useAppSelector } from "../hooks/useAppSelector";
import { RootStateProps } from "../types/userTypes";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser } = useAppSelector((state: RootStateProps) => state.user)
  return currentUser ? <Outlet/> : <Navigate to='/sign-in'/>
}

export default PrivateRoute;