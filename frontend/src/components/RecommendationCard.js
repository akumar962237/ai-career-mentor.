import React from "react";
import { careerResources } from "../services/mockResources";
import { skillRoadmap } from "../services/mockRoadmap";

export default function RecommendationCard({ role, match, missing }) {
  const missingSkills = missing || [];
  const matchScore = match ?? 0;
  const resources = careerResources[role] || [];

  return (
    <div className="card my-3 p-4">
      <h3 className="font-bold text-lg mb-2">{role}</h3>
      <p className="mb-2">
        Match Score: <span className="font-semibold">{matchScore}%</span>
      </p>

      <div className="mb-2">
        <h4 className="font-semibold mb-1">Missing Skills:</h4>
        {missingSkills.length > 0 ? (
          missingSkills.map(skill => (
            <span key={skill} className="chip mr-2 mb-1">{skill}</span>
          ))
        ) : (
          <span className="text-green-600 font-medium">None</span>
        )}
      </div>

      {resources.length > 0 && (
        <div className="mb-2">
          <h4 className="font-semibold mb-1">YouTube Resources:</h4>
          <ul className="list-disc list-inside">
            {resources.map((res, index) => (
              <li key={index}>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {res.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {missingSkills.length > 0 && (
        <div className="mt-3">
          <h4 className="font-semibold mb-1">Roadmap to Learn Missing Skills:</h4>
          {missingSkills.map(skill => {
            const roadmap = skillRoadmap[skill.replace(/\s+/g, "_")] || ["No roadmap available"];
            return (
              <div key={skill} className="mb-2">
                <p className="font-medium">{skill}</p>
                <ul className="list-decimal list-inside ml-4 text-slate-700">
                  {roadmap.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
