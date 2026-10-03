import { useContext } from "react";
import { InterviewContext } from "../context/interview.context.jsx";
import {
    generateInterviewReport,
    getInterviewReportById,
    getAllReports
} from "../services/interview.api.js";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const {
        reports,
        setReports,
        currentReport,
        setCurrentReport,
        isLoading,
        setIsLoading,
        error,
        setError,
    } = context;

    const handleGenerateReport = async (formData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await generateInterviewReport(formData);
            const reportData = response?.data || response;
            setCurrentReport(reportData);
            setReports((prev) => [reportData, ...prev]);
            return reportData;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || "Failed to generate report";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetReportById = async (interviewId) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getInterviewReportById(interviewId);
            const reportData = response?.data || response;
            setCurrentReport(reportData);
            return reportData;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || "Failed to fetch report";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetAllReports = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getAllReports();
            const reportsList = response?.data || [];
            setReports(reportsList);
            return reportsList;
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || "Failed to fetch reports";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        reports,
        currentReport,
        setCurrentReport,
        isLoading,
        error,
        handleGenerateReport,
        handleGetReportById,
        handleGetAllReports,
    };
};
