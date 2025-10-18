import { ContactsFilled, DashboardFilled } from "@ant-design/icons";
import { Menu } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    key: "/",
    icon: <DashboardFilled />,
  },
  {
    label: "Skills",
    key: "/skills",
    icon: <ContactsFilled />,
  },
  {
    label: "Education",
    key: "/education",
    icon: <ContactsFilled />,
  },
  {
    label: "Competencies",
    key: "/competencies",
    icon: <ContactsFilled />,
  },
  {
    label: "Projects",
    key: "/projects",
    icon: <ContactsFilled />,
  },
  {
    label: "Experience",
    key: "/experience",
    icon: <ContactsFilled />,
  },
  {
    label: "Settings",
    key: "/setting",
    icon: <ContactsFilled />,
  },
];

const SideBar: React.FC = () => {
  const [openKeys, setOpenKeys] = useState(["sub1"]);

  const navigate = useNavigate();

  return (
    <Menu
      onClick={({ key }) => navigate(key)}
      theme={"dark"}
      mode="inline"
      items={menuItems as any}
    />
  );
};

export default SideBar;
