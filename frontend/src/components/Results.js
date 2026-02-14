import React from "react";

function Results({ data }) {
  return (
    <div className="results">
      <h2>Extracted Skills</h2>
      <p>{data.extracted_skills.join(", ")}</p>

      <h2>Career Recommendations</h2>
      {data.recommendations.map((rec, idx) => (
        <div key={idx} className="card">
          <h3>{rec.role}</h3>
          <p>Match Score: {rec.match_score}%</p>
          <p>Missing Skills: {rec.missing_skills.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

export default Results;
