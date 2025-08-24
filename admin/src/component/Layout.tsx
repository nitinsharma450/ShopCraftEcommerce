import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./Header";
import { useEffect, useState } from "react";
import { AuthenticationService } from "../services/AuthenticationService ";

export default function Layout() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();

  useEffect(() => {
    AuthenticationService.isAuthenticated()
      .then((success) => {
        if (success) {
          setIsAuthenticated(true);
        } else {
          navigate("/");
        }
      })
      .catch(() => {
        navigate("/");
      });
  }, []);

  if (isAuthenticated === undefined) {
    return "Loading...";
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
