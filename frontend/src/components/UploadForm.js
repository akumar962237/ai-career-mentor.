import React, { useState } from "react";
import { analyzeResume } from "../services/api";
import RecommendationCard from "./RecommendationCard";

export default function UploadForm() {
  const [resume, setResume] = useState("");
  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await analyzeResume(resume);
      const data = response.data;
      setSkills(data.skills || []);
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume. Check backend connection.");
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="header-glass mb-6">
        <h1 className="text-2xl font-bold">AI Career Mentor 💼</h1>
        <p>Paste your resume to get matched career roles, missing skills, and roadmap.</p>
      </div>

      <form onSubmit={handleSubmit} className="card mb-6">
        <textarea
          className="w-full p-3 border rounded-md mb-3"
          rows={10}
          placeholder="Paste your resume here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {skills.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-bold mb-2">Extracted Skills:</h2>
          <div className="flex flex-wrap">
            {skills.map(skill => (
              <span key={skill} className="chip mr-2 mb-2">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <h2 className="font-bold text-xl mb-3">Career Recommendations:</h2>
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.role}
              role={rec.role}
              match={rec.match}
              missing={rec.missing}
            />
          ))}
        </div>
      )}
    </div>
  );
}
