import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-career-mentor-1ffo.onrender.com"

});

export const analyzeResume = (text) => API.post("/analyze", { text });

export const getRoadmap = (career, missing_skills, extracted_skills) =>
  API.post("/roadmap", { career, missing_skills, extracted_skills });
