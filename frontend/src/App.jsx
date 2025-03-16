import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Main from "./screens/Main/Main.jsx";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <Main />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
