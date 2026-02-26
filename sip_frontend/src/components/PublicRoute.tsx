import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const PublicRoute = ({ children }:Props) => {
  const isAuthenticated = !!localStorage.getItem('token');  
  //  localStorage.getItem('token') will return something either token or null so , 
  // when we add ! then it convert the value to boolen and filp vlaue,so if token is avalialbe  
  // then  token will be conver to boolean ie, it will be true if null then it will false , 
  // and then flip it ie true thne flase and if false the true and if we add again onemore ! then it filps the boolean again 

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;