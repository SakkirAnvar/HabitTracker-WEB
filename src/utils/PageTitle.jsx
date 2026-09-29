import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/habits": "Habits",
  "/habits/archived": "Archived Habits",
  "/goals": "Goals",
  "/analytics": "Analytics",
  "/journal": "Journal",
  "/profile": "Profile",
  "/settings": "Settings",
  "/help": "Help & Support",
};

const PageTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const title = pageTitles[pathname];

    document.title = title ? `Aven | ${title}` : "Aven";
  }, [pathname]);

  return null;
};

export default PageTitle;
