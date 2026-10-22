# AI Code Review Assistant

An AI-powered web application that reviews source code and provides intelligent suggestions to improve code quality, readability, and maintainability.

## Features

- AI-based code review
- Detects common coding issues
- Suggests code improvements
- Clean and responsive user interface
- Fast code analysis
- Easy-to-use interface

## Tech Stack

### Frontend
- React.js
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### AI Integration
- Google Gemini API

## Project Structure

```
AI-Code-Review-Assistant/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/HumaKawal/AI-Code-Review-Assistant.git
```

### Move to Project Folder

```bash
cd AI-Code-Review-Assistant
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
npm run dev
```

### Install Backend Dependencies

Open a new terminal.

```bash
cd backend
npm install
npm start
```

## Environment Variables

Create a `.env` file inside the backend folder.

```env
GEMINI_API_KEY=your_api_key
PORT=5000
```

## How It Works

1. Open the application.
2. Paste your source code.
3. Click **Review Code**.
4. The AI analyzes the code.
5. View suggestions, improvements, and feedback instantly.

## Future Improvements

- Support multiple programming languages
- Code complexity analysis
- Security vulnerability detection
- Download review report
- Code history
- User authentication

## Author

**Huma Kawal**

- GitHub: https://github.com/HumaKawal

## License

This project is licensed under the MIT License.
