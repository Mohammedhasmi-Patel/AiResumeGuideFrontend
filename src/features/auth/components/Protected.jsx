import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";


const Protected = ({ children }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (!user) {
        return <Navigate to="/login" />
    }
    return children;
}
export default Protected