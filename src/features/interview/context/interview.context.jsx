import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    const [reports, setReports] = useState([]);
    const [currentReport, setCurrentReport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <InterviewContext.Provider
            value={{
                reports,
                setReports,
                currentReport,
                setCurrentReport,
                isLoading,
                setIsLoading,
                error,
                setError,
            }}
        >
            {children}
        </InterviewContext.Provider>
    );
};
