import axios from "axios";
import toast from "react-hot-toast";

/* eslint-disable @typescript-eslint/no-explicit-any */

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return "https://career-backend-he9u.onrender.com/api";
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 15000, // 15s timeout
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Dynamic self-correction: if running on production (Vercel) but API points to localhost, redirect to Render
      const hostname = window.location.hostname;
      if (hostname !== "localhost" && hostname !== "127.0.0.1") {
        if (config.baseURL?.includes("localhost") || !config.baseURL) {
          config.baseURL = "https://career-backend-he9u.onrender.com/api";
        }
      }

      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      if (!error.response) {
        // Severe Network Outage / ERR_CONNECTION_REFUSED / Timeout
        toast.error("Network Error: CareerPath server is offline. Please start your backend or try again later.", {
          id: "network-error-toast",
          duration: 5000
        });
      } else if (error.response.status === 401) {
        localStorage.removeItem("token");
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }
      } else if (error.response.status >= 500) {
        toast.error(`Server Error: ${error.response.data?.message || "Internal server exception occurred."}`, {
          id: "server-500-toast",
          duration: 4000
        });
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginAPI = async (data: { email: string; password: string }) => {
  const res = await API.post("/auth/login", data);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res;
};

export const logoutAPI = () => {
  localStorage.removeItem("token");
  return API.post("/auth/logout");
};

export const getMeAPI = () => {
  return API.get("/auth/me");
};

// Blog APIs
export const getBlogsAPI = (params?: string) => API.get(`/blogs${params ? `?${params}` : ""}`);
export const getBlogBySlugAPI = (slug: string) => API.get(`/blogs/${slug}`);
export const createBlogAPI = (data: any) => API.post("/blogs", data);
export const updateBlogAPI = (id: string, data: any) => API.put(`/blogs/update/${id}`, data);
export const deleteBlogAPI = (id: string) => API.delete(`/blogs/delete/${id}`);

// Job APIs
export const getJobsAPI = (params?: string) => API.get(`/jobs${params ? `?${params}` : ""}`);
export const getJobAPI = (id: string) => API.get(`/jobs/${id}`);
export const createJobAPI = (data: any) => API.post("/jobs", data);
export const updateJobAPI = (id: string, data: any) => API.put(`/jobs/${id}`, data);
export const deleteJobAPI = (id: string) => API.delete(`/jobs/${id}`);

// College APIs
export const getCollegesAPI = (params?: string) => API.get(`/colleges${params ? `?${params}` : ""}`);
export const getCollegeBySlugAPI = (slug: string) => API.get(`/colleges/slug/${slug}`);
export const getCollegeAPI = (id: string) => API.get(`/colleges/${id}`);
export const createCollegeAPI = (data: any) => API.post("/colleges", data);
export const updateCollegeAPI = (id: string, data: any) => API.put(`/colleges/${id}`, data);
export const deleteCollegeAPI = (id: string) => API.delete(`/colleges/${id}`);

// Program APIs
export const getProgramsAPI = (params?: string) => API.get(`/programs${params ? `?${params}` : ""}`);
export const getProgramAPI = (id: string) => API.get(`/programs/${id}`);
export const createProgramAPI = (data: any) => API.post("/programs", data);
export const updateProgramAPI = (id: string, data: any) => API.put(`/programs/${id}`, data);
export const deleteProgramAPI = (id: string) => API.delete(`/programs/${id}`);

// Inquiry APIs
export const submitInquiryAPI = (data: any) => API.post("/inquiry", data);
export const getInquiriesAPI = (params?: string) => API.get(`/inquiry${params ? `?${params}` : ""}`);
export const deleteInquiryAPI = (id: string) => API.delete(`/inquiry/${id}`);

// Partner APIs
export const submitCollegePartnerAPI = (data: any) => API.post("/partners/college", data);
export const getCollegePartnersAPI = () => API.get("/partners/college");
export const deleteCollegePartnerAPI = (id: string) => API.delete(`/partners/college/${id}`);

export const submitConsultantPartnerAPI = (data: any) => API.post("/partners/consultant", data);
export const getConsultantPartnersAPI = () => API.get("/partners/consultant");
export const deleteConsultantPartnerAPI = (id: string) => API.delete(`/partners/consultant/${id}`);

// Testimonial APIs
export const getTestimonialsAPI = () => API.get("/testimonials");
export const createTestimonialAPI = (data: any) => API.post("/testimonials", data);
export const deleteTestimonialAPI = (id: string) => API.delete(`/testimonials/${id}`);

// Stats API
export const getStatsAPI = () => API.get("/stats");

// News APIs
export const getNewsAPI = (params?: string) => API.get(`/news${params ? `?${params}` : ""}`);
export const getNewsBySlugAPI = (slug: string) => API.get(`/news/${slug}`);
export const getNewsByIdAPI = (id: string) => API.get(`/news/id/${id}`);
export const createNewsAPI = (data: any) => API.post("/news", data);
export const updateNewsAPI = (id: string, data: any) => API.put(`/news/update/${id}`, data);
export const deleteNewsAPI = (id: string) => API.delete(`/news/delete/${id}`);

// Internship APIs
export const getInternshipsAPI = (params?: string) => API.get(`/internships${params ? `?${params}` : ""}`);
export const getInternshipByIdAPI = (id: string) => API.get(`/internships/${id}`);
export const createInternshipAPI = (data: any) => API.post("/internships", data);
export const updateInternshipAPI = (id: string, data: any) => API.put(`/internships/${id}`, data);
export const deleteInternshipAPI = (id: string) => API.delete(`/internships/${id}`);

// Mock Test APIs
export const getMockTestsAPI = (params?: string) => API.get(`/mock-tests${params ? `?${params}` : ""}`);
export const getMockTestBySlugAPI = (slug: string) => API.get(`/mock-tests/slug/${slug}`);
export const getMockTestByIdAPI = (id: string) => API.get(`/mock-tests/id/${id}`);
export const createMockTestAPI = (data: any) => API.post("/mock-tests", data);
export const updateMockTestAPI = (id: string, data: any) => API.put(`/mock-tests/${id}`, data);
export const deleteMockTestAPI = (id: string) => API.delete(`/mock-tests/${id}`);

// Mock Test Registration APIs
export const createMockTestRegistrationAPI = (data: any) => API.post("/mock-test-registrations", data);
export const getMockTestRegistrationsAPI = (params?: string) => API.get(`/mock-test-registrations${params ? `?${params}` : ""}`);
export const deleteMockTestRegistrationAPI = (id: string) => API.delete(`/mock-test-registrations/${id}`);

// Question APIs
export const getQuestionsAPI = (params?: string) => API.get(`/questions${params ? `?${params}` : ""}`);
export const getQuestionsForTestAPI = (testId: string) => API.get(`/questions/test/${testId}`);
export const createQuestionAPI = (data: any) => API.post("/questions", data);
export const updateQuestionAPI = (id: string, data: any) => API.put(`/questions/${id}`, data);
export const deleteQuestionAPI = (id: string) => API.delete(`/questions/${id}`);
export const uploadQuestionAudioAPI = (data: FormData) => API.post("/upload/audio", data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const uploadQuestionVideoAPI = (data: FormData) => API.post("/upload/video", data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Mock Test Attempt APIs
export const submitMockTestAttemptAPI = (data: any) => API.post("/attempts/submit", data);
export const getMockTestAttemptAPI = (id: string) => API.get(`/attempts/${id}`);

// PYQ APIs
export const getPYQsAPI = (params?: string) => API.get(`/pyqs${params ? `?${params}` : ""}`);

// Certification APIs
export const getCertificationsAPI = (params?: string) => API.get(`/certifications${params ? `?${params}` : ""}`);

// Govt Job APIs
export const getGovtJobsAPI = (params?: string) => API.get(`/govt-jobs${params ? `?${params}` : ""}`);

// Tool APIs
export const analyzeResumeAPI = (data: any) => API.post("/tools/resume-analyzer", data);

export default API;
