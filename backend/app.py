from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os

app = Flask(__name__)
CORS(app)

# ✅ Home route (IMPORTANT for Render health check)
@app.route("/")
def home():
    return {"status": "AI Career Mentor API running 🚀"}


@app.route("/analyze", methods=["POST"])
def analyze_resume():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    resume_text = data.get("text", "").lower()

    # Skill list
    all_skills = [
        "python","java","c++","sql","html","css","javascript","react",
        "flask","django","node.js","express","aws","docker","kubernetes",
        "machine learning","deep learning","pytorch","tensorflow","data analysis",
        "pandas","numpy","matplotlib","tailwind","ui/ux","git","rest api",
        "responsive design","json","mongodb","mysql","postgresql"
    ]

    extracted_skills = sorted(list(set([s for s in all_skills if s in resume_text])))

    # CSV path fix (works in Render)
    csv_path = os.path.join(os.path.dirname(__file__), "job_roles.csv")

    job_roles = {}

    try:
        with open(csv_path, "r", encoding="utf-8") as file:
            reader = csv.reader(file)
            next(reader)
            for row in reader:
                if len(row) > 1:
                    role_name = row[0].strip()
                    skills = [s.strip().lower() for s in row[1:] if s.strip()]
                    job_roles[role_name] = skills

    except FileNotFoundError:
        return jsonify({"error": "job_roles.csv not found"}), 500


    results = []
    for role, skills in job_roles.items():
        matched = [s for s in extracted_skills if s in skills]
        missing = [s for s in skills if s not in extracted_skills]
        score = int((len(matched)/len(skills))*100) if skills else 0

        results.append({
            "role": role,
            "match": score,
            "missing": missing
        })


    return jsonify({
        "skills": extracted_skills,
        "recommendations": results
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
