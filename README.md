# AI Code Review Assistant

An AI-powered code review system that combines **LLM-based analysis** with **deterministic static analysis** to review source code, identify potential issues, analyze complexity, detect basic security risks, and generate optimized code.

## 🚀 Features

* 🤖 AI-powered code review using a local LLM
* 🐞 Bug and potential issue detection
* 🔒 Basic security vulnerability detection
* 📊 Time and space complexity analysis
* ✨ Code quality and code smell detection
* ⚡ Code optimization suggestions
* 🧠 AI-generated code explanations
* 🧪 AI-generated test cases
* 🎯 Interview questions based on submitted code
* 📈 Combined AI + Static Analysis score
* 💾 Review history stored in MongoDB
* 📊 Dashboard for review statistics
* 🌐 REST API using Flask
* 💻 React-based web interface

## 🏗️ System Architecture

```text
User Code
    ↓
React Frontend
    ↓
Flask REST API
    ↓
Static Code Analyzer
    ↓
Local LLM (Ollama)
    ↓
AI Code Analysis
    ↓
Combined Review
    ↓
MongoDB
    ↓
Review Results + History
```

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML
* CSS
* Vite

### Backend

* Python
* Flask
* Flask-CORS
* REST APIs

### AI

* Ollama
* Qwen2.5-Coder 3B
* Prompt Engineering
* Structured JSON AI Responses

### Static Analysis

* Python-based rule engine
* Regular expressions
* Code quality checks
* Security pattern d
