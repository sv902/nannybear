import React, { useEffect } from "react";
import { RouterProvider, createBrowserRouter, Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import { Marketing } from "./components/Marketing/Marketing.jsx";
import ParentProfileForm from "./components/ParentProfile/ParentProfileForm.jsx";
import NannyProfileForm from "./components/NannyProfile/NannyProfileForm.jsx"
import RegistrationLogin from "./pages/RegistrationLogin.jsx";
import EmailPasswordForm from "./pages/EmailPasswordForm";
import EmailConfirmation from "./pages/EmailConfirmation.jsx";
import ParentSurveyForm from "./components/ParentSurvey/ParentSurveyForm.jsx"
import EmailVerified from "./pages/EmailVerified.jsx"
import Main from "./screens/Main/Main.jsx";
import NannyProfilePage from "./pages/NannyProfilePage.jsx";
import NannyListPage from "./pages/NannyListPage";
import ForgotPassword from "./pages/ForgotPassword.jsx"; 
import ResetPassword from "./pages/ResetPassword.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import axios from "./axiosConfig";

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;
  
   const surveyPages = [
    "/registration/parent/survey", 
  ];

  const isHomePage = path === "/";
  const isSurveyPage = surveyPages.includes(path);

  useEffect(() => {
    axios.get('/sanctum/csrf-cookie');
  }, []);

  return (
    <div className={isSurveyPage ? "hide-menu no-border" : ""}>
      {!isHomePage && <Marketing />}
      {!isHomePage && <Header />}
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Main /> },  // Головна сторінка
      { path: "registrationlogin", element: <RegistrationLogin /> }, // Сторінка реєстрації - входу
      { path: "registration/email", element: <EmailPasswordForm /> }, // Сторінка введення email
      { path: "registration/email-confirmation", element: <EmailConfirmation /> }, // Сторінка підтвердження емейлу
      { path: "registration/parent/profile", element: <ParentProfileForm />,}, // Сторінка профіля батька
      { path: "registration/nanny/profile", element: <NannyProfileForm />,}, // Сторінка профілю няні
      { path: "registration/parent/survey", element: <ParentSurveyForm />,}, // Сторінка опитувальника батька
      { path: "email-verified", element: <EmailVerified /> },
      { path: "nanny/profile", element: <NannyProfilePage />},
      { path: "nanny-profiles", element: <NannyListPage />},
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "*", element: <NotFoundPage /> },
    ],
    errorElement: <NotFoundPage />  // Обробка помилок на рівні маршруту
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
