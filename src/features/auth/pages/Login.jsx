import { useState } from "react";
import { Link } from "react-router";
import "../auth.form.scss";

const Login = () => {


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submit")
    };
    return (
        <main>
            <div className="form-container">
                <div className="form-header">
                    <h1>Login</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder='Enter your email' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder='Enter your password' />
                    </div>
                    <button className="button primary-button" type="submit">Login</button>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </form>
            </div>
        </main >
    );
};

export default Login;