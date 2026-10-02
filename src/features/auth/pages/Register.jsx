import { Link } from "react-router";

const Register = () => {


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submit");
    };

    return (
        <main>
            <div className="form-container">
                <div className="form-header">
                    <h1>Register</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" placeholder='Enter your username' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder='Enter your email' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder='Enter your password' />
                    </div>
                    <button className="button primary-button" type="submit">Login</button>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        </main >
    );
};

export default Register;