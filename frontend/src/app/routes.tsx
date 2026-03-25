import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Landing } from "./pages/landing";
import { JobListings } from "./pages/job-listings";
import { JobDetails } from "./pages/job-details";
import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { Dashboard } from "./pages/dashboard";
import { Admin } from "./pages/admin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: "/jobs", element: <JobListings /> },
      { path: "/jobs/:id", element: <JobDetails /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/admin", element: <Admin /> },
    ],
  },
]);
