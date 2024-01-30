import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Loading } from "../components/loading";



interface PrivateProps{
  children: ReactNode;
}

export function Private({children}: PrivateProps){
  const { signed, loadingAuth } = useContext(AuthContext);

  if(loadingAuth){
    return <Loading />
  }
  if(!signed){
    return <Navigate to="/login"/>

  }

  return children;
}