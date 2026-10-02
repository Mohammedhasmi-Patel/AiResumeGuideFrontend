import { useContext } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { login, register, logout, getMe } from "../services/auth.api.js";


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const { user, setUser, isLoading, setIsLoading, isCheckingAuth, error, setError } = context;


    const handleLogin = async ({ email, password }) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await login({ email, password });
            setUser(data.user);
        }
        catch (error) {
            console.log("Login failed", error);
            setError(error?.response?.data?.message || "something went wrong");
        }
        finally {
            setIsLoading(false);
        }
    };


    const handleRegister = async ({ username, email, password }) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await register({ username, email, password });
            console.log("Register success", data);
            setUser(data.user);
            setError(null);
        } catch (error) {
            console.log("Register failed", error);
            setError(error?.response?.data?.message || "something went wrong");
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await logout();
            console.log("Logout success", data);
            setUser(null);
        } catch (error) {
            setError(error?.response?.data?.message || "something went wrong");
            console.log("Logout failed", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    return { handleLogin, handleRegister, handleLogout, isLoading, isCheckingAuth, user, error };
};