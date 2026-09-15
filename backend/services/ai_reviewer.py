import json
import requests

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
MODEL_NAME = "qwen2.5-coder:3b"


def review_code(code, language):

    prompt = f"""
You are reviewing {language} code.

CODE:
{code}

Return ONLY valid JSON using exactly this structure:

{{
  "summary": "short review",
  "score": 0,
  "bugs": [],
  "complexity": {{
    "time": "",
    "space": "",
    "explanation": ""
  }},
  "security": [],
  "quality_issues": [],
  "suggestions": [],
  "optimized_code": "",
  "explanation": "",
  "test_cases": [
    {{
      "input": "",
      "expected_output": "",
      "purpose": ""
    }},
    {{
      "input": "",
      "expected_output": "",
      "purpose": ""
    }},
    {{
      "input": "",
      "expected_output": "",
      "purpose": ""
    }}
  ],
  "interview_questions": []
}}

Rules:
- score must be between 0 and 100
- identify real bugs only
- do not invent bugs
- provide time and space complexity
- check basic security risks
- check code quality
- provide practical suggestions
- provide improved code
- explain the main improvement briefly
- generate exactly 3 useful test cases
- every test case MUST contain input, expected_output and purpose
- generate exactly 3 short interview questions
- keep all text concise
- return JSON only
"""

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "format": "json",
        "keep_alive": "10m",
        "options": {
            "temperature": 0.1,
            "num_predict": 500
        }
    }

    try:
        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=120
        )

        response.raise_for_status()

        data = response.json()
        result = data.get("response", "").strip()

        if not result:
            raise Exception("AI returned an empty response")

        return json.loads(result)

    except requests.exceptions.ConnectionError:
        raise Exception(
            "Ollama is not running. Please open Ollama and try again."
        )

    except requests.exceptions.Timeout:
        raise Exception(
            "AI review timed out. Please try again."
        )

    except json.JSONDecodeError:
        raise Exception(
            "AI returned an invalid JSON response."
        )

    except requests.exceptions.RequestException as e:
        raise Exception(
            f"Ollama request failed: {str(e)}"
        )