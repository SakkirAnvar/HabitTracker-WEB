import { Outlet } from "react-router-dom";
import NavBar from "../pages/NavBar";
import Sidebar from "../pages/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#F6F7F9]">

      <NavBar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 min-w-0 p-5 lg:p-7">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;
