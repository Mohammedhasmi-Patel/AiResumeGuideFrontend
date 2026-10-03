import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { 
    Plus, 
    ArrowRight, 
    Calendar, 
    Briefcase, 
    Sparkles, 
    Search,
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    TrendingUp
} from "lucide-react";
import { useInterview } from "../hooks/useInterview.jsx";
import "../reports.scss";

const cleanRoleTitle = (rawText) => {
    if (!rawText) return "Full Stack Developer";
    const firstLine = rawText.split("\n")[0] || rawText;
    const cleaned = firstLine
        .replace(/^(job\s*title\s*:\s*|role\s*:\s*|position\s*:\s*)/i, "")
        .trim();
    return cleaned.length > 50 ? cleaned.slice(0, 47) + "..." : cleaned;
};

const extractCleanSkillBadge = (text) => {
    if (!text) return "General";
    
    const knownSkills = [
        "Node.js", "Express.js", "React.js", "React", "Next.js", "TypeScript", "JavaScript",
        "Redis", "BullMQ", "RabbitMQ", "Kafka", "Docker", "Kubernetes", "PostgreSQL",
        "MongoDB", "MySQL", "AWS", "GraphQL", "REST APIs", "Microservices", "System Design",
        "CI/CD", "Message Queue", "Caching", "Authentication", "JWT", "Laravel", "ASP.NET Core"
    ];

    for (const skill of knownSkills) {
        const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, "i");
        if (regex.test(text)) {
            return skill;
        }
    }

    const cleaned = text
        .split(/[\(\,\:\-]/)[0]
        .replace(/\b(commercial|experience|strategies|processing|management|patterns|understanding|architecture|knowledge)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();
    
    const words = cleaned.split(" ").filter((w) => !["and", "with", "for", "in", "of", "to", "the"].includes(w.toLowerCase()));
    return words.slice(0, 2).join(" ") || "Architecture";
};

const getMatchDetails = (score) => {
    if (score >= 80) return { label: "Strong Match", theme: "high", desc: "High alignment with requirements" };
    if (score >= 65) return { label: "Good Match", theme: "medium", desc: "Solid candidate foundation" };
    return { label: "Moderate Match", theme: "low", desc: "Growth areas identified" };
};

const Reports = () => {
    const navigate = useNavigate();
    const { reports, handleGetAllReports, isLoading, error } = useInterview();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        handleGetAllReports().catch((err) => {
            console.error("Failed to load reports:", err);
        });
    }, []);

    const filteredReports = (reports || []).filter((r) => {
        if (!searchTerm.trim()) return true;
        const query = searchTerm.toLowerCase();
        const role = (r.jobDescription || "").toLowerCase();
        const skills = (r.skillGaps || []).map((s) => (s.skill || "").toLowerCase()).join(" ");
        return role.includes(query) || skills.includes(query);
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return "Recent";
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });
        } catch {
            return "Recent";
        }
    };

    return (
        <main className="reports-page">
            <div className="reports-container">
                <header className="reports-header">
                    <div className="header-left">
                        <Link to="/" className="back-link">
                            <ArrowLeft size={16} />
                            <span>Back to Generator</span>
                        </Link>
                        <h1>All Interview Reports</h1>
                        <p>Browse your resume evaluations, match analyses, and personalized interview roadmaps.</p>
                    </div>

                    <div className="header-actions">
                        <button 
                            className="create-btn"
                            onClick={() => navigate("/")}
                        >
                            <Plus size={18} />
                            <span>New Report</span>
                        </button>
                    </div>
                </header>

                <div className="toolbar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input 
                            type="text"
                            placeholder="Filter by target position or skill gap..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="report-count">
                        <span>{filteredReports.length} {filteredReports.length === 1 ? "Report" : "Reports"} Found</span>
                    </div>
                </div>

                {isLoading && (
                    <div className="loading-state">
                        <div className="spinner" />
                        <p>Loading reports...</p>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="error-banner">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {!isLoading && filteredReports.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon-circle">
                            <Briefcase size={36} />
                        </div>
                        <h3>{searchTerm ? "No matching reports" : "No interview reports yet"}</h3>
                        <p>
                            {searchTerm 
                                ? `No reports matched "${searchTerm}". Try another search term.`
                                : "Upload your resume and paste a job description to generate your first analysis."}
                        </p>
                        {searchTerm ? (
                            <button 
                                className="button secondary-button"
                                onClick={() => setSearchTerm("")}
                            >
                                Clear Search
                            </button>
                        ) : (
                            <button 
                                className="button primary-button"
                                onClick={() => navigate("/")}
                            >
                                <Sparkles size={16} />
                                <span>Create First Report</span>
                            </button>
                        )}
                    </div>
                )}

                {!isLoading && filteredReports.length > 0 && (
                    <div className="reports-grid">
                        {filteredReports.map((report) => {
                            const score = report.matchScore || 0;
                            const match = getMatchDetails(score);
                            const roleTitle = cleanRoleTitle(report.jobDescription);
                            const gaps = report.skillGaps || [];

                            return (
                                <article 
                                    key={report._id} 
                                    className="modern-report-card"
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div className="card-top-bar">
                                        <div className="target-badge">
                                            <Briefcase size={12} />
                                            <span>Target Role</span>
                                        </div>
                                        <div className="date-badge">
                                            <Calendar size={12} />
                                            <span>{formatDate(report.createdAt)}</span>
                                        </div>
                                    </div>

                                    <h3 className="position-title" title={report.jobDescription}>
                                        {roleTitle}
                                    </h3>

                                    <div className={`match-banner ${match.theme}`}>
                                        <div className="banner-left">
                                            <div className="score-circle-mini">
                                                <span className="score-val">{score}</span>
                                                <span className="score-pct">%</span>
                                            </div>
                                            <div className="banner-text">
                                                <span className="banner-heading">Match Score</span>
                                                <span className="banner-sub">{match.desc}</span>
                                            </div>
                                        </div>
                                        <span className="status-badge">{match.label}</span>
                                    </div>

                                    <div className="gaps-container">
                                        <div className="gaps-title-row">
                                            <span className="gaps-label">Skill Gaps</span>
                                            <span className="gaps-counter">{gaps.length}</span>
                                        </div>

                                        <div className="badges-list">
                                            {gaps.length === 0 ? (
                                                <div className="no-gaps-pill">
                                                    <CheckCircle2 size={13} />
                                                    <span>No major skill gaps identified</span>
                                                </div>
                                            ) : (
                                                gaps.slice(0, 4).map((gap, i) => {
                                                    const sev = (gap.severity || "medium").toLowerCase();
                                                    const badgeName = extractCleanSkillBadge(gap.skill);
                                                    return (
                                                        <span key={i} className={`skill-badge ${sev}`}>
                                                            {badgeName}
                                                        </span>
                                                    );
                                                })
                                            )}
                                            {gaps.length > 4 && (
                                                <span className="more-badge">+{gaps.length - 4} more</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card-action-footer">
                                        <span className="action-label">Open Full Analysis</span>
                                        <div className="action-circle">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Reports;
