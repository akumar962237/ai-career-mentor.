import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <div className="app-container">
      <header className="header-glass mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">AI Career Mentor 💼</h1>
            <p className="mt-1 text-indigo-100 max-w-xl">
              Paste your resume to get matched career roles, missing skills, curated YouTube resources and a step-by-step roadmap.
            </p>
          </div>
          <div className="text-sm opacity-90">
            <div>Portfolio-ready UI</div>
            <div className="mt-1 text-xs">Built with React + Tailwind</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UploadForm setAnalysis={setAnalysis} />
        </div>

        <div className="lg:col-span-2">
          {analysis ? (
            <Dashboard analysis={analysis} />
          ) : (
            <div className="card">
              <h2 className="text-xl font-semibold">How it works</h2>
              <ol className="mt-3 list-decimal ml-5 text-slate-600">
                <li>Paste your resume into the box and click <span className="font-medium">Analyze</span>.</li>
                <li>See extracted skills and career recommendations.</li>
                <li>Click <span className="font-medium">Generate Roadmap</span> to get step-by-step learning plan and YouTube resources.</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
