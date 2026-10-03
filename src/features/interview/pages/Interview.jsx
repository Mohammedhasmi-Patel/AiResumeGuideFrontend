import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
    Code2,
    MessageSquare,
    Map,
    ArrowLeft,
    ArrowRight,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Target,
    AlertTriangle
} from "lucide-react";
import "../interview.dashboard.scss";
import { useInterview } from "../hooks/useInterview.jsx";

const parseSkillGap = (gap, technicalQuestions = []) => {
    const raw = typeof gap === "string" ? gap : (gap?.skill || "");
    const severity = (gap?.severity || "medium").toLowerCase();

    let resumeContext = "";
    if (raw.includes("(") && raw.includes(")")) {
        const match = raw.match(/\((.*?)\)/);
        if (match && match[1]) {
            resumeContext = match[1].replace(/^(resume\s*focuses\s*(heavily\s*)?on\s*)/i, "Resume focuses on ");
        }
    }

    const knownMappings = [
        {
            matches: ["node", "express"],
            name: "Node.js & Express",
            advice: "Master production Express middleware, event-loop non-blocking I/O, error handling, and RESTful routing."
        },
        {
            matches: ["redis", "caching", "cache"],
            name: "Redis Caching",
            advice: "Study Redis data structures, distributed cache invalidation, key eviction policies, and cache stampede prevention."
        },
        {
            matches: ["bullmq", "rabbitmq", "kafka", "queue", "message"],
            name: "Message Queues",
            advice: "Focus on BullMQ/RabbitMQ worker pipelines, job concurrency, retry backoffs, and dead-letter queues."
        },
        {
            matches: ["docker", "container"],
            name: "Docker Containers",
            advice: "Review multi-stage Dockerfiles, image optimization, non-root security, and Docker Compose networking."
        },
        {
            matches: ["kubernetes", "k8s"],
            name: "Kubernetes",
            advice: "Understand Pod lifecycles, Deployments, ClusterIP/Ingress services, and horizontal autoscaling (HPA)."
        },
        {
            matches: ["postgresql", "postgres", "sql"],
            name: "PostgreSQL",
            advice: "Review compound indexing rules, query plans (EXPLAIN ANALYZE), isolation levels, and migration rollbacks."
        },
        {
            matches: ["mongodb", "mongo", "nosql"],
            name: "MongoDB",
            advice: "Master aggregation pipelines, document schema design, indexing, and replica set failover."
        },
        {
            matches: ["aws", "cloud", "lambda", "s3"],
            name: "AWS Cloud",
            advice: "Focus on serverless execution, S3 storage policies, IAM least-privilege roles, and VPC architecture."
        },
        {
            matches: ["graphql", "apollo"],
            name: "GraphQL",
            advice: "Review schema definitions, query resolvers, DataLoader batching to prevent N+1 issues, and mutations."
        },
        {
            matches: ["system design", "scalability", "concurrency"],
            name: "System Design",
            advice: "Practice high-level architecture diagramming, rate limiting algorithms, load balancing, and data partitioning."
        },
        {
            matches: ["typescript"],
            name: "TypeScript",
            advice: "Strengthen generics, discriminated unions, utility types, and strict type-checking best practices."
        }
    ];

    const lower = raw.toLowerCase();
    let cleanName = "";
    let advice = "";

    for (const item of knownMappings) {
        if (item.matches.some((m) => lower.includes(m))) {
            cleanName = item.name;
            advice = item.advice;
            break;
        }
    }

    if (!cleanName) {
        const withoutParens = raw.replace(/\(.*?\)/g, "").trim();
        const cleaned = withoutParens
            .split(/[\,\:\-]/)[0]
            .replace(/\b(commercial|experience|strategies|processing|management|patterns|understanding|architecture|knowledge|foundations|fundamentals)\b/gi, "")
            .replace(/\s+/g, " ")
            .trim();

        const words = cleaned.split(" ").filter((w) => !["and", "with", "for", "in", "of", "to", "the", "heavily", "focuses"].includes(w.toLowerCase()));
        cleanName = words.slice(0, 2).join(" ") || "Core Competency";
        advice = gap?.advice && !gap.advice.startsWith("Reinforce")
            ? gap.advice
            : `Review ${cleanName} core fundamentals, architectural patterns, and production trade-offs.`;
    }

    const questionCount = (technicalQuestions || []).filter((q) => {
        const fullContent = `${q.question || ""} ${q.intention || ""} ${q.answer || ""}`.toLowerCase();
        const search = cleanName.toLowerCase();
        if (fullContent.includes(search)) return true;
        const keywords = search
            .replace(/[()/,.-]/g, " ")
            .split(/\s+/)
            .filter((word) => word.length > 2 && !["with", "from", "that", "this", "have", "and", "the", "core"].includes(word));
        return keywords.some((kw) => fullContent.includes(kw));
    }).length;

    return {
        cleanName,
        rawName: raw,
        severity,
        resumeContext,
        advice,
        questionCount
    };
};

const Interview = () => {
    const { interviewId } = useParams();

    const [activeTab, setActiveTab] = useState("technical");
    const [selectedSkillGap, setSelectedSkillGap] = useState("all");
    const [openAnswers, setOpenAnswers] = useState({});

    const toggleAnswer = (key) => {
        setOpenAnswers((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const { currentReport, handleGetReportById, isLoading, error } = useInterview();

    const report = currentReport;

    useEffect(() => {
        if (!interviewId) return;

        handleGetReportById(interviewId).catch((err) => {
            console.error("Failed to load interview report:", err);
        });
    }, [interviewId]);

    const parsedSkillGaps = (report?.skillGaps || []).map((gap) =>
        parseSkillGap(gap, report?.technicalSkills || [])
    );

    const activeGap = selectedSkillGap !== "all"
        ? parsedSkillGaps.find((g) => g.cleanName.toLowerCase() === selectedSkillGap.toLowerCase())
        : null;

    const filteredTechnicalQuestions = (report?.technicalSkills || []).filter((q) => {
        if (selectedSkillGap === "all") return true;
        const search = selectedSkillGap.toLowerCase();
        const fullContent = `${q.question || ""} ${q.intention || ""} ${q.answer || ""}`.toLowerCase();

        if (fullContent.includes(search)) return true;

        const keywords = search
            .replace(/[()/,.-]/g, " ")
            .split(/\s+/)
            .filter((word) => word.length > 2 && !["with", "from", "that", "this", "have", "and", "the", "core"].includes(word));

        return keywords.some((keyword) => fullContent.includes(keyword));
    });

    if (isLoading) {
        return (
            <main className="interview-dashboard">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", gap: "1rem" }}>
                    <div style={{ width: "42px", height: "42px", border: "3px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: 600 }}>Loading Interview Report...</p>
                </div>
            </main>
        );
    }

    if (!report) {
        return (
            <main className="interview-dashboard">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", gap: "1.25rem", textAlign: "center", padding: "2rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" }}>Report Not Found</h2>
                    <p style={{ color: "#64748b", maxWidth: "420px" }}>{error || "We could not find the requested interview report. You can create a new report from the generator."}</p>
                    <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", backgroundColor: "#2563eb", color: "#ffffff", borderRadius: "10px", fontWeight: 600, textDecoration: "none" }}>
                        <ArrowLeft size={16} />
                        <span>Back to Generator</span>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="interview-dashboard">
            <div className="dashboard-layout">
                <aside className="left-sidebar">
                    <div className="sidebar-section">
                        <Link to="/reports" className="view-reports-btn" title="View All Reports">
                            <span>View All Reports</span>
                            <ArrowRight size={15} />
                        </Link>

                        <div className="match-score-card">
                            <div className="score-circle">
                                <span>{report.matchScore || 0}</span>
                                <span className="percent">%</span>
                            </div>
                            <div className="score-info">
                                <span className="score-label">Resume Match</span>
                                <span className="score-status">Match Score</span>
                            </div>
                        </div>

                        <span className="nav-label">Navigation</span>

                        <nav className="nav-menu">
                            <button
                                className={`nav-item ${activeTab === "technical" ? "active" : ""}`}
                                onClick={() => setActiveTab("technical")}
                            >
                                <div className="nav-item-content">
                                    <span className="nav-icon"><Code2 size={18} /></span>
                                    <span>Technical Questions</span>
                                </div>
                                <span className="nav-count">{report.technicalSkills?.length || 0}</span>
                            </button>

                            <button
                                className={`nav-item ${activeTab === "behaviour" ? "active" : ""}`}
                                onClick={() => setActiveTab("behaviour")}
                            >
                                <div className="nav-item-content">
                                    <span className="nav-icon"><MessageSquare size={18} /></span>
                                    <span>Behaviour Questions</span>
                                </div>
                                <span className="nav-count">{report.behaviouralQuestions?.length || 0}</span>
                            </button>

                            <button
                                className={`nav-item ${activeTab === "roadmap" ? "active" : ""}`}
                                onClick={() => setActiveTab("roadmap")}
                            >
                                <div className="nav-item-content">
                                    <span className="nav-icon"><Map size={18} /></span>
                                    <span>Roadmap</span>
                                </div>
                                <span className="nav-count">{report.preparationPlan?.length || 0} Days</span>
                            </button>
                        </nav>
                    </div>

                    <div className="sidebar-footer">
                        <div className="target-role-badge">
                            <span className="role-caption">Target Role</span>
                            <span className="role-name" title={report.jobDescription}>
                                {report.jobDescription || "Fullstack Engineer"}
                            </span>
                        </div>
                    </div>
                </aside>

                <section className="middle-content">
                    <div className="content-header">
                        <div className="header-top">
                            <h2>
                                {activeTab === "technical" && "Technical Questions"}
                                {activeTab === "behaviour" && "Behaviour Questions"}
                                {activeTab === "roadmap" && "Preparation Roadmap"}
                            </h2>
                        </div>
                        <p>
                            {activeTab === "technical" && "Core technical concepts, architecture, and suggested model answers based on your background and the target role."}
                            {activeTab === "behaviour" && "Situational, teamwork, and leadership questions with structured model answers."}
                            {activeTab === "roadmap" && "Structured day-by-day plan to bridge skill gaps and prepare for your upcoming interviews."}
                        </p>

                        {activeGap ? (
                            <div className={`selected-gap-detail-card ${activeGap.severity}`}>
                                <div className="gap-detail-header">
                                    <div className="gap-detail-title-group">
                                        <span className={`severity-indicator-dot ${activeGap.severity}`}></span>
                                        <span className="gap-detail-badge">{activeGap.cleanName}</span>
                                        <span className="gap-detail-status">Skill Gap Focus</span>
                                    </div>
                                    <button
                                        className="close-detail-btn"
                                        onClick={() => setSelectedSkillGap("all")}
                                        title="Clear filter and view all questions"
                                    >
                                        View All Questions ×
                                    </button>
                                </div>

                                {activeGap.resumeContext && (
                                    <div className="gap-detail-context">
                                        <AlertTriangle size={15} className="context-icon" />
                                        <span className="context-text">{activeGap.resumeContext}</span>
                                    </div>
                                )}

                                <div className="gap-detail-advice-box">
                                    <span className="advice-label">Interview Preparation Strategy</span>
                                    <p className="advice-text">{activeGap.advice}</p>
                                </div>

                                <div className="gap-detail-footer">
                                    <span>Showing <strong>{filteredTechnicalQuestions.length}</strong> related interview questions below</span>
                                </div>
                            </div>
                        ) : selectedSkillGap !== "all" ? (
                            <div className="active-filter-tag">
                                <span>Filtered by: <strong>{selectedSkillGap}</strong></span>
                                <button
                                    className="clear-filter-btn"
                                    onClick={() => setSelectedSkillGap("all")}
                                    title="Clear filter"
                                >
                                    ×
                                </button>
                            </div>
                        ) : null}
                    </div>

                    {activeTab === "technical" && (
                        <div className="questions-list">
                            {filteredTechnicalQuestions.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                                    <p>No technical questions found matching <strong>{selectedSkillGap}</strong>.</p>
                                    <button
                                        className="button secondary-button"
                                        style={{ marginTop: "1rem" }}
                                        onClick={() => setSelectedSkillGap("all")}
                                    >
                                        Show All Questions
                                    </button>
                                </div>
                            ) : (
                                filteredTechnicalQuestions.map((q, idx) => {
                                    const key = `tech-${idx}`;
                                    const isOpen = !!openAnswers[key];
                                    return (
                                        <article key={idx} className={`question-card ${isOpen ? "open" : ""}`}>
                                            <div
                                                className="question-header-row"
                                                onClick={() => toggleAnswer(key)}
                                                title="Click to toggle suggested answer"
                                            >
                                                <div className="card-meta">
                                                    <span className="q-badge">Question #{idx + 1}</span>
                                                    <span className="toggle-hint">
                                                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    </span>
                                                </div>

                                                <h3 className="question-title">{q.question}</h3>
                                            </div>

                                            {q.intention && (
                                                <div className="intention-box">
                                                    <span className="intention-header">
                                                        <Sparkles size={14} /> Why Interviewers Ask This
                                                    </span>
                                                    <p>{q.intention}</p>
                                                </div>
                                            )}

                                            {isOpen && q.answer && (
                                                <div className="answer-box">
                                                    <span className="answer-header">Suggested Answer</span>
                                                    <p>{q.answer}</p>
                                                </div>
                                            )}
                                        </article>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {activeTab === "behaviour" && (
                        <div className="questions-list">
                            {(report.behaviouralQuestions || []).map((q, idx) => {
                                const key = `behav-${idx}`;
                                const isOpen = !!openAnswers[key];
                                return (
                                    <article key={idx} className={`question-card ${isOpen ? "open" : ""}`}>
                                        <div
                                            className="question-header-row"
                                            onClick={() => toggleAnswer(key)}
                                            title="Click to toggle suggested answer"
                                        >
                                            <div className="card-meta">
                                                <span className="q-badge" style={{ backgroundColor: "#fdf4ff", color: "#a855f7" }}>
                                                    Behavioural #{idx + 1}
                                                </span>
                                                <span className="toggle-hint" style={{ color: "#a855f7" }}>
                                                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </span>
                                            </div>

                                            <h3 className="question-title">{q.question}</h3>
                                        </div>

                                        {q.intention && (
                                            <div className="intention-box" style={{ borderLeftColor: "#a855f7" }}>
                                                <span className="intention-header" style={{ color: "#9333ea" }}>
                                                    <Sparkles size={14} /> Evaluation Focus
                                                </span>
                                                <p>{q.intention}</p>
                                            </div>
                                        )}

                                        {isOpen && q.answer && (
                                            <div className="answer-box">
                                                <span className="answer-header" style={{ color: "#9333ea" }}>Suggested Model Response</span>
                                                <p>{q.answer}</p>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === "roadmap" && (
                        <div className="roadmap-container">
                            <div className="timeline-list">
                                {(report.preparationPlan || []).map((dayPlan, dayIdx) => (
                                    <article key={dayIdx} className="day-card">
                                        <div className="day-header">
                                            <span className="day-badge">Day {dayPlan.day || dayIdx + 1}</span>
                                            <h3>{dayPlan.focus}</h3>
                                        </div>

                                        <ul className="tasks-list">
                                            {(dayPlan.tasks || []).map((task, taskIdx) => (
                                                <li key={taskIdx} className="task-item">
                                                    <span className="task-dot"></span>
                                                    <span className="task-text">{task}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                <aside className="right-sidebar">
                    <div className="right-header">
                        <div className="title-row">
                            <div className="title-with-icon">
                                <Target size={18} className="target-icon" />
                                <h3>Skill Gaps</h3>
                            </div>
                            <span className="gap-count-pill">
                                {parsedSkillGaps.length} Areas
                            </span>
                        </div>
                        <p>Identified areas from the job description to reinforce before interview day.</p>
                    </div>

                    <div className="skill-pills-list">
                        <button
                            className={`skill-pill-item all-pill ${selectedSkillGap === "all" ? "active" : ""}`}
                            onClick={() => setSelectedSkillGap("all")}
                        >
                            <span className="pill-title">All Questions</span>
                            <span className="pill-count">{report.technicalSkills?.length || 0}</span>
                        </button>

                        {parsedSkillGaps.map((gap, idx) => {
                            const isSelected = selectedSkillGap.toLowerCase() === gap.cleanName.toLowerCase();
                            return (
                                <button
                                    key={idx}
                                    className={`skill-pill-item ${gap.severity} ${isSelected ? "active" : ""}`}
                                    onClick={() => {
                                        if (isSelected) {
                                            setSelectedSkillGap("all");
                                        } else {
                                            setSelectedSkillGap(gap.cleanName);
                                            setActiveTab("technical");
                                        }
                                    }}
                                >
                                    <div className="pill-left">
                                        <span className={`pill-dot ${gap.severity}`}></span>
                                        <span className="pill-title">{gap.cleanName}</span>
                                    </div>
                                    {gap.questionCount > 0 && (
                                        <span className="pill-count">{gap.questionCount}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default Interview;