import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import VerifyEmailForm from "./Pages/EmailVerification";
import LoginCard from "./Pages/Login";
import ErrorPage from "./Pages/ErrorPage";
import Register from "./Pages/Register";
import ResetPasswordRequest from "./Pages/ResetPasswordRequest";
import HomeCard from "./Components/Card";
import Footer from "./Components/Footer";
import RequireAuth from "./Components/RequireAuth";
import ResetPassword from "./Pages/ResetPassword";
import Profile from "./Pages/Profile";
import Users from "./Pages/TestingUsers";
import PersistLogin from "./Components/PersistLogin";
import BeTenant from "./Pages/BeTenant";
import Dashboard from "./Pages/Dashboard";
import BasicUsage from "./Components/AlertSuccess";
import "./Styles/swall.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: [<HomeCard />, <BasicUsage />, <Footer />],
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verification/:token",
        element: <VerifyEmailForm />,
      },
      {
        path: "/login",
        element: <LoginCard />,
      },
      {
        path: "/forgotpassword",
        element: <ResetPasswordRequest />,
      },
      {
        path: "/resetpassword/:id/:token",
        element: <ResetPassword />,
      },
      //protected routes
      {
        element: <PersistLogin />,
        children: [
          {
            element: <RequireAuth />,
            children: [
              {
                path: '/user',
                element: <Profile />,
              },
              {
                path: "/users",
                element: <Users />,
              },

            ],
          },
        ],
      },
    ],
  },
  {
    path: "/tenant",
    element: <BeTenant />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/app",
    element: <App />,
  },
]);

function App() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
