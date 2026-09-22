import { Outlet } from "react-router-dom";
import NavBar from "../pages/NavBar";
import Sidebar from "../pages/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <NavBar />

      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1 p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;