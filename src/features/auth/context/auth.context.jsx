import { createContext, useState, useEffect } from "react";
import { getMe } from "../services/auth.api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const data = await getMe();
                if (data?.user) {
                    setUser(data.user);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        verifyUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, setIsLoading, isCheckingAuth, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
};
