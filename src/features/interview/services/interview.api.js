import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4500/api";

const api = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
});

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/interviews/${interviewId}`);
    return response.data;
};

export const getAllReports = async () => {
    const response = await api.get(`/interviews`);
    return response.data;
};

export const generateInterviewReport = async (formData) => {
    const response = await api.post(`/interviews`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};
