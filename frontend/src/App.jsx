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
import ParentSettingsPage from "./pages/ParentSettingsPage";
import ParentEditPersonalInfoPage from "./components/ParentSettingsPage/ParentEditPersonalInfoPage.jsx"
import ParentEditLocationPage from "./components/ParentSettingsPage/ParentEditLocationPage.jsx"
import ParentEditChildrenPage from "./components/ParentSettingsPage/ParentEditChildrenPage.jsx"
import ParentBookingHistoryPage from "./components/ParentSettingsPage/ParentBookingHistoryPage.jsx"
import ParentChangePasswordPage from "./components/ParentSettingsPage/ParentChangePasswordPage.jsx"
import ParentSupportPage from "./components/ParentSettingsPage/ParentSupportPage.jsx"
import BookingStep1 from "./components/BookingStep/BookingStep1.jsx"
import BookingStep2 from "./components/BookingStep/BookingStep2.jsx"
import BookingStep3 from "./components/BookingStep/BookingStep3.jsx"
import BookingStep4 from "./components/BookingStep/BookingStep4.jsx"
import BookingSuccess from "./components/BookingStep/BookingSuccess.jsx"
import BookingFailure from "./components/BookingStep/BookingFailure.jsx"
import AddReviewPage from "./pages/AddReviewPage.jsx"
import NannySettingsPage from "./pages/NannySettingsPage.jsx"
import NannyEditPersonalInfo from "./components/NannySettingsPage/NannyEditPersonalInfo.jsx"
import NannyEditLocationPage from "./components/NannySettingsPage/NannyEditLocationPage.jsx";
import NannyEditAboutPage from "./components/NannySettingsPage/NannyEditAboutPage.jsx";
import NannyEditLanguagesPage from "./components/NannySettingsPage/NannyEditLanguagesPage.jsx";
import NannyEditSchedulePage from "./components/NannySettingsPage/NannyEditSchedulePage.jsx";
import NannyEditWorkProcessPage from "./components/NannySettingsPage/NannyEditWorkProcessPage.jsx";
import NannyEditSpecializationPage from "./components/NannySettingsPage/NannyEditSpecializationPage.jsx";
import NannyEditSkillsPage from "./components/NannySettingsPage/NannyEditSkillsPage.jsx";
import NannyEditEducationPage from "./components/NannySettingsPage/NannyEditEducationPage.jsx";
import NannyGalleryPage from "./components/NannySettingsPage/NannyGalleryPage.jsx";
import NannySupportPage from "./components/NannySettingsPage/NannySupportPage.jsx";
import NannyChangePasswordPage from "./components/NannySettingsPage/NannyChangePasswordPage.jsx";
import NannyBookingHistoryPage from "./components/NannySettingsPage/NannyBookingHistoryPage.jsx";
import AddParentReviewPage from "./pages/AddParentReviewPage.jsx";
import axios from "./axiosConfig";

const Layout = () => {
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
      { path: "/nanny-profiles/:id", element: <NannyProfilePage />},
      { path: "nanny-profiles/user/:user_id", element: <NannyProfilePage /> },    
      { path: "nanny-profiles", element: <NannyListPage />},
      { path: "/nanny/:id", element: <NannyDetailPage /> },
      { path: "parent-profiles", element: <ParentProfilePage /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "/report/:id", element: <ReportProfilePage />},
      { path: "/all-nannies", element: <AllNanniesPage />},
      { path: "/parent/profile/edit", element: <ParentSettingsPage />},
      { path: "/parent/profile/edit/personal-info", element: <ParentEditPersonalInfoPage />},
      { path: "/parent/profile/edit/location", element: <ParentEditLocationPage />},
      { path: "/parent/profile/edit/children", element: <ParentEditChildrenPage />},
      { path: "/parent/profile/edit/orders", element: <ParentBookingHistoryPage />},
      { path: "/parent/profile/edit/password", element: <ParentChangePasswordPage />},
      { path: "/parent/profile/edit/support", element: <ParentSupportPage />},
      { path: "/booking/:id", element: <BookingStep1 /> }, // дата і час початку
      { path: "/booking/:id/end", element: <BookingStep2 /> }, // дата і час завершення
      { path: "/booking/:id/address", element: <BookingStep3 /> }, // адреса
      { path: "/booking/:id/details", element: <BookingStep4 /> }, // підтвердження
      { path: "/booking/success", element: <BookingSuccess />},     
      { path: "/booking/failure", element: <BookingFailure />},
      { path: "/add-review", element: <AddReviewPage /> },
      { path: "/add-parent-review", element: <AddParentReviewPage />},
      { path: "/nanny/profile/edit", element: <NannySettingsPage />},
      { path: "/nanny/profile/edit/personal-info", element: <NannyEditPersonalInfo />},
      { path: "/nanny/profile/edit/location", element: <NannyEditLocationPage />},
      { path: "/nanny/profile/edit/about", element: <NannyEditAboutPage />},
      { path: "/nanny/profile/edit/languages", element: < NannyEditLanguagesPage />},
      { path: "/nanny/profile/edit/schedule", element: <NannyEditSchedulePage />},
      { path: "/nanny/profile/edit/work-process", element: <NannyEditWorkProcessPage />},
      { path: "/nanny/profile/edit/specialization", element: <NannyEditSpecializationPage />},
      { path: "/nanny/profile/edit/skills", element: <NannyEditSkillsPage />},
      { path: "/nanny/profile/edit/education", element: <NannyEditEducationPage />},
      { path: "/nanny/profile/edit/gallery", element: <NannyGalleryPage />},
      { path: "/nanny/profile/edit/support", element: <NannySupportPage />},
      { path: "/nanny/profile/edit/password", element: <NannyChangePasswordPage />},
      { path: "/nanny/profile/edit/history", element: <NannyBookingHistoryPage />},
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
