import React, { useState } from "react";
import { getRoadmap } from "../services/api";

function Progress({ value }) {
  return (
    <div className="progress-track mt-2">
      <div className="progress-fill bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${value}%` }} />
    </div>
  );
}

function RecommendationCard({ rec, onRoadmap }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-lg font-semibold">{rec.role}</h4>
          <p className="text-sm text-slate-500 mt-1">Match Score: <span className="font-medium">{rec.match_score}%</span></p>
        </div>
        <div className="text-right">
          {rec.top_match && <div className="bg-green-100 text-green-800 px-3 py-1 text-sm rounded">Top Match</div>}
        </div>
      </div>

      <Progress value={rec.match_score} />

      <div className="mt-3">
        <div className="text-sm text-slate-600 mb-2"><strong>Missing:</strong> {rec.missing_skills.length ? rec.missing_skills.join(", ") : <span className="text-green-600">None</span>}</div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => onRoadmap(rec)} className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-sm">
            Generate Roadmap
          </button>

          {rec.missing_skills.map((s) => (
            <a key={s} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(s + " tutorial")}`} target="_blank" rel="noreferrer" className="chip">
              ▶ Learn {s}
            </a>
          ))}

        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ analysis }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  const handleRoadmap = async (rec) => {
    setLoadingRoadmap(true);
    setRoadmap(null);
    try {
      const payload = {
        career: rec.role,
        missing_skills: rec.missing_skills,
        extracted_skills: analysis.extracted_skills || []
      };
      const res = await getRoadmap(payload.career, payload.missing_skills, payload.extracted_skills);
      setRoadmap(res.data);
      // scroll to roadmap
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 200);
    } catch (err) {
      console.error(err);
      alert("Failed to generate roadmap. Check backend and OpenAI API key.");
    } finally {
      setLoadingRoadmap(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold">Extracted Skills</h3>
        <div className="mt-3">
          {(analysis.extracted_skills || []).length ? (
            <div className="flex flex-wrap gap-2">
              {analysis.extracted_skills.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          ) : (
            <p className="text-slate-500">No skills extracted.</p>
          )}

          <div className="mt-4 text-sm text-slate-600">
            <strong>Quick advice:</strong>
            <p className="mt-1">{analysis.short_advice || "Analyze to get quick personalized advice."}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Career Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(analysis.recommendations || []).map((rec) => (
            <RecommendationCard key={rec.role} rec={rec} onRoadmap={handleRoadmap} />
          ))}
        </div>
      </div>

      {loadingRoadmap && <div className="card">Generating roadmap...</div>}

      {roadmap && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">Roadmap — {roadmap.career || "Plan"}</h3>
          <pre className="whitespace-pre-wrap text-sm text-slate-700">{roadmap.roadmap}</pre>

          {roadmap.youtube_suggestions && roadmap.youtube_suggestions.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">YouTube suggestions</h4>
              <ul className="list-disc pl-5 mt-2">
                {roadmap.youtube_suggestions.map((y) => (
                  <li key={y.skill}>
                    <a className="text-indigo-600 underline" target="_blank" rel="noreferrer" href={y.youtube_results}>
                      {y.skill} — search results
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
