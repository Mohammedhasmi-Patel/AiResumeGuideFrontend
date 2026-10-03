import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";

const Protected = ({ children }) => {
    const { user, isCheckingAuth } = useAuth();
    const location = useLocation();

    if (isCheckingAuth) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                <div style={{ width: "36px", height: "36px", border: "3px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default Protected;