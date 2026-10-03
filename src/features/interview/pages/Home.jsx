import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import "../interview.form.scss";
import { useInterview } from "../hooks/useInterview.jsx";

const Home = () => {
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [resumeFile, setResumeFile] = useState(null);

    const { handleGenerateReport, isLoading, error } = useInterview();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobDescription || !resumeFile || !selfDescription) {
            return;
        }

        const formData = new FormData();
        formData.append("jobDescription", jobDescription);
        formData.append("selfDescription", selfDescription);
        formData.append("resume", resumeFile);

        try {
            const data = await handleGenerateReport(formData);
            if (data?._id) {
                navigate(`/interview/${data._id}`);
            }
        } catch (err) {
            console.error("Report generation error:", err);
        }
    };

    return (
        <div className="home-page">
            <header className="home-header">
                <Link to="/" className="brand">
                    <div className="brand-badge">
                        <Sparkles size={18} />
                    </div>
                    <span className="brand-text">AI Interview Prep</span>
                </Link>

                <Link to="/reports" className="view-reports-btn">
                    <span>View All Reports</span>
                    <ArrowRight size={15} />
                </Link>
            </header>

            <main className="home">
                <div className="left">
                    <textarea
                        name="jobDescription"
                        id="jobDescription"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Enter Job Description"
                        required
                    ></textarea>
                </div>

                <div className="right">
                    {error && (
                        <div style={{
                            backgroundColor: "#fee2e2",
                            color: "#dc2626",
                            padding: "0.75rem 1rem",
                            borderRadius: "10px",
                            fontSize: "0.875rem",
                            textAlign: "center"
                        }}>
                            {error}
                        </div>
                    )}
                    <div className="input-group">
                        <label htmlFor="resume">Upload Resume</label>
                        <input
                            type="file"
                            accept=".pdf"
                            name="resume"
                            id="resume"
                            onChange={(e) => setResumeFile(e.target.files[0] || null)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="selfDescription">Enter your Details</label>
                        <input
                            type="text"
                            name="selfDescription"
                            id="selfDescription"
                            value={selfDescription}
                            onChange={(e) => setSelfDescription(e.target.value)}
                            placeholder="Enter your Details"
                            required
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Generating Report..." : "Generate Report"}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;