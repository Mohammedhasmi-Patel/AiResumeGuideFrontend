import { createBrowserRouter } from "react-router";
import App from "./App";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
]);