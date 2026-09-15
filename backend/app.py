from flask import Flask, jsonify, request
from flask_cors import CORS

from services.ai_reviewer import review_code
from utils.static_analyzer import analyze_code
from db import reviews_collection


app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "AI Code Review Assistant Backend is running!"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "success",
        "message": "Backend is healthy"
    })


@app.route("/api/review", methods=["POST"])
def review():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "Request body is required"
            }), 400

        code = data.get("code", "").strip()
        language = data.get("language", "").strip()

        if not code:
            return jsonify({
                "status": "error",
                "message": "Code is required"
            }), 400

        if not language:
            return jsonify({
                "status": "error",
                "message": "Programming language is required"
            }), 400

        supported_languages = [
            "Java",
            "Python",
            "JavaScript"
        ]

        if language not in supported_languages:
            return jsonify({
                "status": "error",
                "message": "Supported languages are Java, Python and JavaScript"
            }), 400

        # --------------------------------------------------
        # STEP 1: STATIC ANALYSIS
        # --------------------------------------------------

        static_result = analyze_code(
            code,
            language
        )

        # --------------------------------------------------
        # STEP 2: AI ANALYSIS
        # --------------------------------------------------

        ai_result = review_code(
            code,
            language
        )

        # --------------------------------------------------
        # STEP 3: COMBINED SCORE
        # --------------------------------------------------

        ai_score = int(
            ai_result.get("score", 0)
        )

        static_score = int(
            static_result.get("static_score", 0)
        )

        # AI = 70%
        # Static Analysis = 30%

        final_score = round(
            (ai_score * 0.70) +
            (static_score * 0.30)
        )

        # --------------------------------------------------
        # STEP 4: REMOVE DUPLICATES
        # --------------------------------------------------

        security = list(dict.fromkeys(
            static_result.get("security_issues", [])
            +
            ai_result.get("security", [])
        ))

        quality_issues = list(dict.fromkeys(
            static_result.get("quality_issues", [])
            +
            ai_result.get("quality_issues", [])
        ))

        suggestions = list(dict.fromkeys(
            static_result.get("suggestions", [])
            +
            ai_result.get("suggestions", [])
        ))

        # --------------------------------------------------
        # STEP 5: FINAL REVIEW
        # --------------------------------------------------

        final_result = {

            "summary": ai_result.get(
                "summary",
                "Code review completed."
            ),

            "score": final_score,

            "ai_score": ai_score,

            "static_score": static_score,

            "static_analysis": static_result,

            "bugs": ai_result.get(
                "bugs",
                []
            ),

            "complexity": ai_result.get(
                "complexity",
                {}
            ),

            "security": security,

            "quality_issues": quality_issues,

            "suggestions": suggestions,

            "optimized_code": ai_result.get(
                "optimized_code",
                code
            ),

            "explanation": ai_result.get(
                "explanation",
                ""
            ),

            "test_cases": ai_result.get(
                "test_cases",
                []
            ),

            "interview_questions": ai_result.get(
                "interview_questions",
                []
            )
        }

        # --------------------------------------------------
        # STEP 6: SAVE TO MONGODB
        # --------------------------------------------------

        review_document = {
            "language": language,
            "code": code,
            "review": final_result
        }

        reviews_collection.insert_one(
            review_document
        )

        # --------------------------------------------------
        # STEP 7: RESPONSE
        # --------------------------------------------------

        return jsonify({
            "status": "success",
            "language": language,
            "review": final_result
        }), 200

    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({
            "status": "error",
            "message": "Something went wrong while reviewing the code.",
            "details": str(e)
        }), 500


@app.route("/api/history", methods=["GET"])
def history():

    try:

        reviews = list(
            reviews_collection
            .find({}, {"_id": 0})
            .sort("_id", -1)
        )

        return jsonify({
            "status": "success",
            "count": len(reviews),
            "history": reviews
        }), 200

    except Exception as e:

        print("HISTORY ERROR:", str(e))

        return jsonify({
            "status": "error",
            "message": "Could not fetch review history.",
            "details": str(e)
        }), 500


@app.route("/api/history/<int:limit>", methods=["GET"])
def limited_history(limit):

    try:

        if limit <= 0:
            return jsonify({
                "status": "error",
                "message": "Limit must be greater than 0"
            }), 400

        reviews = list(
            reviews_collection
            .find({}, {"_id": 0})
            .sort("_id", -1)
            .limit(limit)
        )

        return jsonify({
            "status": "success",
            "count": len(reviews),
            "history": reviews
        }), 200

    except Exception as e:

        print("LIMITED HISTORY ERROR:", str(e))

        return jsonify({
            "status": "error",
            "message": "Could not fetch review history.",
            "details": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )