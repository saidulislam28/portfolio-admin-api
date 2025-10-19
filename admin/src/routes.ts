import { lazy } from "react";


const MySkills = lazy(
  () => import("./pages/my-skills")
);
const Projects = lazy(
  () => import("./pages/projects")
);
const Education = lazy(
  () => import("./pages/education")
);
const Competencies = lazy(
  () => import("./pages/competencies")
);
const Experience = lazy(
  () => import("./pages/experience")
);
const Dashboard = lazy(
  () => import("./pages/Home")
);
const Settings = lazy(
  () => import("./pages/setting")
);

const routes = [
  { path: "/", element: Dashboard },
  { path: "/skills", element: MySkills },
  { path: "/projects", element: Projects },
  { path: "/education", element: Education },
  { path: "/competencies", element: Competencies },
  { path: "/experience", element: Experience },
  { path: "/setting", element: Settings },
];

export default routes;
