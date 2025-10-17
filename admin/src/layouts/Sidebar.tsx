import {
  AppstoreOutlined,
  BellOutlined,
  BookFilled,
  CalendarFilled,
  ContactsFilled,
  DashboardFilled,
  FileAddFilled,
  GiftFilled,
  SnippetsOutlined,
  SolutionOutlined,
  UserAddOutlined,
  UsergroupDeleteOutlined,
  VideoCameraFilled,
} from "@ant-design/icons";
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
    label: "User",
    key: "/users",
    icon: <ContactsFilled />,
  },
  {
    label: "Skills",
    key: "/skills",
    icon: <ContactsFilled />,
  },

  {
    label: "Package",
    key: "/package",
    icon: <GiftFilled />,
  },

  {
    label: "Book",
    icon: <BookFilled />,
    children: [
      {
        label: "Book List",
        key: "/books",
        // icon: <BookFilled />,
      },
      {
        label: "Book Vendor",
        key: "/book-vendor",
        // icon: <BookFilled />,
      },
      {
        label: "Book Order",
        key: "/bookOrder",
        // icon: <ShoppingFilled />,
      },
    ],
  },
  {
    label: "Exam",
    // key: "/eRegistration",
    icon: <FileAddFilled />,
    children: [
      {
        label: "All Submission",
        key: "/exam-egistration",
        // icon: <FileAddFilled />,
      },
      {
        label: "Center",
        key: "/exam-center",
        // icon: <GiftFilled />,
      },
      {
        label: "Description",
        key: "/ielts-test-reg",
        // icon: <FileExclamationFilled />,
      },
    ],
  },
  {
    label: "Online Class",
    // key: "/onlineClassRequest",
    icon: <VideoCameraFilled />,
    children: [
      {
        label: "All Submission",
        key: "/onlineClassRequest",
        // icon: <VideoCameraFilled />,
      },
      {
        label: "Description",
        key: "/online-course-reg",
        // icon: <VideoCameraFilled />,
      },
    ],
  },
  // {
  //   label: "Study Abroad",
  //   key: "/study-abroad",
  //   icon: <PlayCircleOutlined />,
  // },
  {
    label: "Study Abroad",
    icon: <BookFilled />,
    children: [
      {
        label: "All Submission",
        key: "/study-abroad",
        // icon: <PlayCircleOutlined />,
      },
      {
        label: "Description",
        key: "/study-abroad-reg",
        // icon: <BookFilled />,
      },
    ],
    // key: "/study-abroad",
    // icon: <PlayCircleOutlined />,
  },
  // {
  //   label: "Spoken Request",
  //   key: "/spokenRequest",
  //   icon: <AudioFilled />,
  // },
  // {
  //   label: "Book Order",
  //   key: "/bookOrder",
  //   icon: <ShoppingFilled />,
  // },
  {
    label: "Coupon",
    key: "/coupon",
    icon: <SolutionOutlined />,
  },
  {
    label: "Help Request",
    key: "/web-help-req",
    icon: <SolutionOutlined />,
  },
  // {
  //   label: "Consultants",
  //   key: "/consultants",
  //   icon: <SolutionOutlined />,
  // },
  {
    label: "Consultants",
    // key: "/consultants",
    icon: <SolutionOutlined />,
    children: [
      {
        label: "All Consultants",
        key: "/consultants",
        // icon: <SolutionOutlined />,
      },
      {
        label: "Schedule",
        key: "/consultant-schedule",
        // icon: <SolutionOutlined />,
      },
    ],
  },
  // {
  //   label: "Bookings",
  //   key: "/bookings",
  //   icon: <CalendarFilled />,
  // },
  {
    label: "Appointment",
    // key: "/appointments",
    icon: <UsergroupDeleteOutlined />,
    children: [
      {
        label: "Mocktest",
        key: "/appointments/mocktest",
      },
      {
        label: "Conversation",
        key: "/appointments/conversation",
      },
      {
        label: "Conversation Comments",
        key: "/conversation-comments",
      },
      {
        label: "Mocktest Comments",
        key: "/mocktest-comments",
      },
    ],
  },
  // {
  //   label: "Conversation",
  //   // key: "/appointments",
  //   icon: <VideoCameraAddOutlined />,
  //   children: [

  //   ],
  // },
  {
    label: "Live Appointments",
    key: "/live-appointments",
    icon: <CalendarFilled />,
  },

  {
    label: "Admin Users",
    key: "/admin-users",
    icon: <UserAddOutlined />,
  },
  {
    label: "Notification",
    key: "/notification",
    icon: <BellOutlined />,
  },
  {
    label: "Reports",
    // key: "/appointments",
    icon: <SnippetsOutlined />,
    children: [
      {
        label: "Orders",
        key: "/reports/orders",
      },
      {
        label: "Consultants",
        key: "/reports/consultants",
      },
    ],
  },
  {
    label: "App Settings",
    icon: <AppstoreOutlined />,
    children: [
      {
        label: "Home Slider",
        key: "/app-home-slider",
      },
      {
        label: "Home Video Slider",
        key: "/app-home-video",
      },

      {
        label: "Settings",
        key: "/setting",
      },
    ],
  },
  {
    label: "Web Settings",
    icon: <AppstoreOutlined />,
    children: [
      {
        label: "Settings",
        key: "/web-setting",
      },
      {
        label: "Faq",
        key: "/web-faq",
      },
      {
        label: "Testimonial",
        key: "/web-testimonial",
      },
    ],
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
      // openKeys={openKeys}
      // onOpenChange={onOpenChange}
      // style={{ width: 256 }}
      items={menuItems as any}
    />
  );
};

export default SideBar;
