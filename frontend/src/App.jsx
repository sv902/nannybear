import React, { useEffect } from "react";
import { RouterProvider, createBrowserRouter, Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import { Marketing } from "./components/Marketing/Marketing.jsx";
import ParentProfileForm from "./components/ParentProfile/ParentProfileForm.jsx";
import NannyProfileForm from "./components/NannyProfile/NannyProfileForm.jsx";
import RegistrationLogin from "./pages/RegistrationLogin.jsx";
import EmailPasswordForm from "./pages/EmailPasswordForm.jsx";
import EmailConfirmation from "./pages/EmailConfirmation.jsx";
import ParentSurveyForm from "./components/ParentSurvey/ParentSurveyForm.jsx"
import EmailVerified from "./pages/EmailVerified.jsx"
import Main from "./screens/Main/Main.jsx";
import NannyProfilePage from "./pages/NannyProfilePage.jsx";
import NannyListPage from "./pages/NannyListPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx"; 
import ResetPassword from "./pages/ResetPassword.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ParentProfilePage from "./pages/ParentProfilePage.jsx";
import NannyDetailPage from "./pages/NannyDetailPage.jsx";
import ReportProfilePage from "./pages/ReportProfilePage.jsx";
import { FavoritesProvider } from "./context/FavoritesContext";
import AllNanniesPage from "./pages/AllNanniesPage.jsx";
import axios from "./axiosConfig";

const Layout = ({resetFilters}) => {
  const location = useLocation();
  const path = location.pathname;

  // Умови для показу хедера та футера
  const isSurveyPageWithParam = path === "/registration/parent/survey" && new URLSearchParams(location.search).get("from") === "nanny-list";
  const isLoginPage = path === "/registrationlogin"; 
  const isEmailPage = path === "/registration/email";
  
  
  useEffect(() => {
    axios.get('/sanctum/csrf-cookie');
  }, []);

  return (
    <div>
      {/* Виведення хедера */}
      {isSurveyPageWithParam ? (
        <div className="marketing-container">
          <Marketing />
        </div>
      ) : (
        <>        
          {/* Для сторінок входу та реєстрації, показуємо маркетинг та хедер */}
          {(isLoginPage || isEmailPage) && (
            <>
              <Marketing />
              <Header />
            </>
          )}
        </>
      )}
      {/* Виведення контенту */}
      <Outlet />      
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Main /> },
      { path: "registrationlogin", element: <RegistrationLogin /> },
      { path: "registration/email", element: <EmailPasswordForm /> },
      { path: "registration/email-confirmation", element: <EmailConfirmation /> },
      { path: "registration/parent/profile", element: <ParentProfileForm />,},
      { path: "registration/nanny/profile", element: <NannyProfileForm />,},
      { path: "registration/parent/survey", element: <ParentSurveyForm />,},
      { path: "email-verified", element: <EmailVerified /> },
      { path: "nanny/profile", element: <NannyProfilePage />},
      { path: "nanny-profiles", element: <NannyListPage />},
      { path: "nanny/:id", element: <NannyDetailPage /> },
      { path: "parent-profiles", element: <ParentProfilePage /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "/report/:id", element: <ReportProfilePage />},
      { path: "/all-nannies", element: <AllNanniesPage />},
      { path: "*", element: <NotFoundPage /> },
    ],
    errorElement: <NotFoundPage />
  },
]);

export const App = () => {
  return (
    <FavoritesProvider>
      <RouterProvider router={router} />
    </FavoritesProvider>
  );
};

export default Layout;
