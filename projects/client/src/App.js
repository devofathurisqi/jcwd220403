import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Pages/Home';
import VerifyEmailForm from './Pages/EmailVerification';
import LoginCard from './Pages/Login';
import ErrorPage from './Pages/ErrorPage';
import Register from './Pages/Register';
import ResetPasswordRequest from './Pages/ResetPasswordRequest';
import HomeCard from './Components/Card';
import Footer from './Components/Footer';
import RequireAuth from './Components/RequireAuth';
import ResetPassword from './Pages/ResetPassword';
import Profile from './Pages/Profile';
import PersistLogin from './Components/PersistLogin';
import HostHome from './Pages/Tenant/HostHome';
import RegisterWelcome from './Pages/Tenant/RegisterWelcome';
import VerifyForm from './Pages/Tenant/VerifyForm';
import RequireTenantRole from './Components/RequireTenantRole';
import BeTenant from './Pages/Tenant/BeTenant';
// import Dashboard from './Pages/Tenant/Dashboard';
import DetailPages from './Pages/DetailPage';
import './Styles/swall.css';
import 'animate.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Category from './Components/Category';
import BookingDetail from './Pages/Booking/BookingDetail';
import PaymentPage from './Pages/Payment/PaymentPage';
import TransactionUser from './Pages/Tenant/TransactionUser';
import ReportPages from './Pages/Tenant/Report';
import PaymentInstruction from './Pages/Payment/PaymentInstruction';
import Trips from './Pages/Trips/Trips';
import DashboardTenant from './Pages/Tenant/DashboardTenant';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/verification/:token',
        element: <VerifyEmailForm />,
      },
      {
        path: '/login',
        element: <LoginCard />,
      },
      {
        path: '/forgotpassword',
        element: <ResetPasswordRequest />,
      },
      {
        path: '/detailpage/:id',
        element: <DetailPages />,
      },
      {
        path: '/resetpassword/:id/:token',
        element: <ResetPassword />,
      },
      {
        element: <PersistLogin />,
        children: [
          {
            path: '/',
            element: [
              <Category key={1} />,
              <HomeCard key={2} />,
              <Footer key={3} />,
            ],
          },

          //booking
          {
            path: '/book/:propertyId/:index/:roomId',
            element: <BookingDetail />,
          },
          {
            element: <RequireAuth />,
            children: [
              {
                path: '/user',
                element: <Profile />,
              },
              {
                path: '/payment/:transactionId',
                element: <PaymentPage />,
              },
              {
                path: '/payment/:transactionId/:paymentId/:paymentMethodId',
                element: <PaymentInstruction />,
              },
              {
                path: '/trips',
                element: <Trips />,
              },
            ],
          },
        ],
      },
    ],
  },
  //tenant
  {
    element: <PersistLogin />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            element: <HostHome />,
            errorElement: <ErrorPage />,
            children: [
              {
                path: '/register-tenant',
                element: <RegisterWelcome />,
              },
              {
                path: '/verify-tenant',
                element: <VerifyForm />,
              },
              {
                element: <RequireTenantRole />,
                path: '/tenant',
                children: [
                  {
                    path: 'dashboard',
                    element: <DashboardTenant />,
                  },
                  {
                    path: 'dashboard/transaction',
                    element: <TransactionUser />,
                  },
                  {
                    path: 'dashboard/report',
                    element: <ReportPages />,
                  },
                  {
                    path: 'add-property',
                    element: <BeTenant />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
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
