import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import PasswordInput from "../components/PasswordInput";

const Register = () => {
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const { handleRegister, isLoading, isCheckingAuth, error, user } = useAuth();

    if (isCheckingAuth) {
        return null;
    }

    if (user) {
        return <Navigate to={from} replace />;
    }

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleRegister(formData);
    };

    return (
        <main>
            <div className="form-container">
                <div className="form-header">
                    <h1>Register</h1>
                </div>
                {error && (
                    <div style={{
                        backgroundColor: "#fee2e2",
                        color: "#dc2626",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        textAlign: "center"
                    }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder='Enter your username'
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <PasswordInput
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder='Enter your password'
                            required
                        />
                    </div>
                    <button className="button primary-button" type="submit" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        </main>
    );
};

export default Register;