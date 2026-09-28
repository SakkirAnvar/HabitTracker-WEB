import { Outlet } from "react-router-dom";
import { useState } from "react";
import NavBar from "../pages/NavBar";
import Sidebar from "../pages/Sidebar";
import Footer from "./Footer";

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <NavBar onMenuClick={toggleMobileSidebar} />

      <div className="flex">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={closeMobileSidebar}
        />

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-5 lg:p-7">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
