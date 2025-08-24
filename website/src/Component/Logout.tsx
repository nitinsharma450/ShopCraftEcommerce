 
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
let navigate=useNavigate()

 const handleLogout = () => {
     localStorage.removeItem("auth_token");
     navigate('/login')
  }

  useEffect(()=>{
handleLogout()
  },[])

  return (
    <div>
      
    </div>
  )
}
