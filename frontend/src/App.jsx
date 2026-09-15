import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:5000";

function App() {
  const [language, setLanguage] = useState("Java");
  const [code, setCode] = useState("");
  const [review, setReview] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("review");

  const exampleCode = {
    Java: `public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;
        System.out.println(a + b);
    }
}`,
    Python: `def calculate_sum(a, b):
    result = a + b
    print(result)

calculate_sum(10, 20)`,
    JavaScript: `function calculateSum(a, b) {
    const result = a + b;
    console.log(result);
}

calculateSum(10, 20);`,
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);

      const response = await fetch(`${API_URL}/api/history`);
      const data = await response.json();

      if (data.status === "success") {
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error("History error:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const reviewCode = async () => {
    setError("");

    if (!code.trim()) {
      setError("Please enter some code first.");
      return;
    }

    try {
      setLoading(true);
      setReview(null);

      const response = await fetch(`${API_URL}/api/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Review failed.");
      }

      setReview(data.review);
      setActiveTab("review");

      await loadHistory();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const clearCode = () => {
    setCode("");
    setReview(null);
    setError("");
  };

  const loadExample = () => {
    setCode(exampleCode[language]);
    setError("");
  };

  const scoreClass = (score) => {
    if (score >= 80) return "score-good";
    if (score >= 60) return "score-medium";
    return "score-low";
  };

  const renderList = (items, emptyMessage = "No issues detected.") => {
    if (!items || items.length === 0) {
      return <p className="empty-text">{emptyMessage}</p>;
    }

    return (
      <ul className="result-list">
        {items.map((item, index) => (
          <li key={index}>{typeof item === "string" ? item : JSON.stringify(item)}</li>
        ))}
      </ul>
    );
  };

  const getReviewFromHistory = (item) => {
    setCode(item.code || "");
    setLanguage(item.language || "Java");
    setReview(item.review || null);
    setActiveTab("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalReviews = history.length;

  const averageScore =
    totalReviews > 0
      ? Math.round(
          history.reduce(
            (sum, item) => sum + Number(item.review?.score || 0),
            0
          ) / totalReviews
        )
      : 0;

  const javaCount = history.filter((item) => item.language === "Java").length;
  const pythonCount = history.filter((item) => item.language === "Python").length;
  const jsCount = history.filter(
    (item) => item.language === "JavaScript"
  ).length;

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">AI</div>
          <div>
            <h2>CodeReview AI</h2>
            <span>Intelligent Code Analysis</span>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          AI Engine Ready
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <p className="eyebrow">AI-POWERED CODE ANALYSIS</p>

          <h1>
            Write Better Code.
            <br />
            <span>Build Smarter.</span>
          </h1>

          <p className="hero-text">
            Analyze your code using AI and static analysis to detect bugs,
            security issues, complexity problems and optimization opportunities.
          </p>
        </section>

        <div className="tabs">
          <button
            className={activeTab === "review" ? "tab active" : "tab"}
            onClick={() => setActiveTab("review")}
          >
            Code Review
          </button>

          <button
            className={activeTab === "history" ? "tab active" : "tab"}
            onClick={() => setActiveTab("history")}
          >
            Review History
          </button>

          <button
            className={activeTab === "dashboard" ? "tab active" : "tab"}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
        </div>

        {activeTab === "review" && (
          <>
            <section className="editor-card">
              <div className="editor-header">
                <div>
                  <h3>Submit Your Code</h3>
                  <p>Choose a language and paste your source code.</p>
                </div>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>Java</option>
                  <option>Python</option>
                  <option>JavaScript</option>
                </select>
              </div>

              <div className="code-toolbar">
                <span>{language}</span>

                <div>
                  <button onClick={loadExample}>Load Example</button>
                  <button onClick={clearCode}>Clear</button>
                </div>
              </div>

              <textarea
                className="code-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Paste your ${language} code here...`}
                spellCheck="false"
              />

              {error && <div className="error-box">{error}</div>}

              <button
                className="review-button"
                onClick={reviewCode}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing Code...
                  </>
                ) : (
                  <>✦ Review Code with AI</>
                )}
              </button>

              {loading && (
                <p className="loading-note">
                  Running static analysis and AI-powered code review. This may
                  take a little time on the local AI model.
                </p>
              )}
            </section>

            {review && (
              <section className="results">
                <div className="results-heading">
                  <div>
                    <p className="eyebrow">ANALYSIS COMPLETE</p>
                    <h2>Code Review Results</h2>
                  </div>

                  <div className={`score ${scoreClass(review.score)}`}>
                    <strong>{review.score ?? 0}</strong>
                    <span>/100</span>
                    <small>Code Score</small>
                  </div>
                </div>

                <div className="summary-card">
                  <h3>Overall Summary</h3>
                  <p>
                    {review.summary || "Review completed successfully."}
                  </p>
                </div>

                <div className="result-grid">
                  <div className="result-card">
                    <div className="card-title">
                      <span>🐞</span>
                      <h3>Bugs</h3>
                    </div>
                    {renderList(review.bugs)}
                  </div>

                  <div className="result-card">
                    <div className="card-title">
                      <span>🔒</span>
                      <h3>Security</h3>
                    </div>
                    {renderList(review.security)}
                  </div>

                  <div className="result-card">
                    <div className="card-title">
                      <span>✨</span>
                      <h3>Code Quality</h3>
                    </div>
                    {renderList(review.quality_issues)}
                  </div>

                  <div className="result-card">
                    <div className="card-title">
                      <span>💡</span>
                      <h3>Suggestions</h3>
                    </div>
                    {renderList(review.suggestions)}
                  </div>
                </div>

                <div className="complexity-card">
                  <div className="card-title">
                    <span>📊</span>
                    <h3>Complexity Analysis</h3>
                  </div>

                  <div className="complexity-grid">
                    <div>
                      <span>Time Complexity</span>
                      <strong>
                        {review.complexity?.time || "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>Space Complexity</span>
                      <strong>
                        {review.complexity?.space || "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>Static Complexity</span>
                      <strong>
                        {review.static_analysis?.complexity_estimate ||
                          "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>Lines of Code</span>
                      <strong>
                        {review.static_analysis?.lines_of_code ?? "N/A"}
                      </strong>
                    </div>
                  </div>

                  {review.complexity?.explanation && (
                    <p className="complexity-explanation">
                      {review.complexity.explanation}
                    </p>
                  )}
                </div>

                <div className="static-card">
                  <div className="static-header">
                    <div>
                      <p className="eyebrow">DETERMINISTIC ANALYSIS</p>
                      <h3>Static Analysis</h3>
                    </div>

                    <div className="static-score">
                      {review.static_analysis?.static_score ?? 0}/100
                    </div>
                  </div>

                  <div className="static-stats">
                    <div>
                      <span>Lines of Code</span>
                      <strong>
                        {review.static_analysis?.lines_of_code ?? 0}
                      </strong>
                    </div>

                    <div>
                      <span>Control Flow</span>
                      <strong>
                        {review.static_analysis?.control_flow_count ?? 0}
                      </strong>
                    </div>

                    <div>
                      <span>Complexity</span>
                      <strong>
                        {review.static_analysis?.complexity_estimate || "Low"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="code-section">
                  <div className="section-header">
                    <div>
                      <p className="eyebrow">AI OPTIMIZATION</p>
                      <h3>Optimized Code</h3>
                    </div>
                  </div>

                  <pre className="code-output">
                    <code>{review.optimized_code || code}</code>
                  </pre>
                </div>

                <div className="explanation-card">
                  <div className="card-title">
                    <span>🧠</span>
                    <h3>AI Explanation</h3>
                  </div>

                  <p>
                    {review.explanation ||
                      "No additional explanation was provided."}
                  </p>
                </div>

                <div className="result-grid">
                  <div className="result-card">
                    <div className="card-title">
                      <span>🧪</span>
                      <h3>AI Test Cases</h3>
                    </div>

                    {review.test_cases?.length ? (
                      <div className="test-cases">
                        {review.test_cases.map((test, index) => (
                          <div className="test-case" key={index}>
                            <strong>
                              Test Case {index + 1}
                            </strong>

                            {typeof test === "string" ? (
                              <p>{test}</p>
                            ) : (
                              <>
                                <p>
                                  <b>Input:</b>{" "}
                                  {test.input || "Not specified"}
                                </p>

                                <p>
                                  <b>Expected Output:</b>{" "}
                                  {test.expected_output ||
                                    test.expectedOutput ||
                                    "Not specified"}
                                </p>

                                <p>
                                  <b>Purpose:</b>{" "}
                                  {test.purpose || "General validation"}
                                </p>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="empty-text">No test cases generated.</p>
                    )}
                  </div>

                  <div className="result-card">
                    <div className="card-title">
                      <span>🎯</span>
                      <h3>Interview Questions</h3>
                    </div>

                    {review.interview_questions?.length ? (
                      <ol className="question-list">
                        {review.interview_questions.map((question, index) => (
                          <li key={index}>
                            {typeof question === "string"
                              ? question
                              : question.question || JSON.stringify(question)}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="empty-text">
                        No interview questions generated.
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {activeTab === "history" && (
          <section className="history-section">
            <div className="section-header">
              <div>
                <p className="eyebrow">MONGODB</p>
                <h2>Review History</h2>
                <p>Previously analyzed code reviews.</p>
              </div>

              <button className="refresh-button" onClick={loadHistory}>
                ↻ Refresh
              </button>
            </div>

            {historyLoading ? (
              <div className="empty-state">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="empty-state">
                <h3>No reviews yet</h3>
                <p>Your completed reviews will appear here.</p>
              </div>
            ) : (
              <div className="history-grid">
                {history.map((item, index) => (
                  <div className="history-card" key={index}>
                    <div className="history-top">
                      <span className="language-badge">
                        {item.language}
                      </span>

                      <span
                        className={`history-score ${scoreClass(
                          item.review?.score || 0
                        )}`}
                      >
                        {item.review?.score || 0}/100
                      </span>
                    </div>

                    <h3>
                      {item.review?.summary || "Code Review"}
                    </h3>

                    <p className="code-preview">
                      {(item.code || "").slice(0, 180)}
                      {item.code?.length > 180 ? "..." : ""}
                    </p>

                    <button
                      className="view-button"
                      onClick={() => getReviewFromHistory(item)}
                    >
                      View Review →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "dashboard" && (
          <section className="dashboard">
            <div className="section-header">
              <div>
                <p className="eyebrow">PROJECT DASHBOARD</p>
                <h2>Code Review Analytics</h2>
                <p>Overview of your AI code analysis activity.</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span>Total Reviews</span>
                <strong>{totalReviews}</strong>
              </div>

              <div className="stat-card">
                <span>Average Score</span>
                <strong>{averageScore}/100</strong>
              </div>

              <div className="stat-card">
                <span>Java Reviews</span>
                <strong>{javaCount}</strong>
              </div>

              <div className="stat-card">
                <span>Python Reviews</span>
                <strong>{pythonCount}</strong>
              </div>

              <div className="stat-card">
                <span>JavaScript Reviews</span>
                <strong>{jsCount}</strong>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-title">
                <span>⚙️</span>
                <h3>Analysis Pipeline</h3>
              </div>

              <div className="pipeline">
                <div>
                  <b>01</b>
                  <span>Code Input</span>
                </div>

                <div>
                  <b>02</b>
                  <span>Static Analysis</span>
                </div>

                <div>
                  <b>03</b>
                  <span>AI Analysis</span>
                </div>

                <div>
                  <b>04</b>
                  <span>Combined Review</span>
                </div>

                <div>
                  <b>05</b>
                  <span>MongoDB History</span>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="features">
          <div>
            <span>🐞</span>
            <h3>Bug Detection</h3>
            <p>Identify potential bugs and logical problems.</p>
          </div>

          <div>
            <span>⚡</span>
            <h3>Performance</h3>
            <p>Analyze complexity and optimization opportunities.</p>
          </div>

          <div>
            <span>🔒</span>
            <h3>Security</h3>
            <p>Detect common security risks and unsafe patterns.</p>
          </div>

          <div>
            <span>🧠</span>
            <h3>AI Suggestions</h3>
            <p>Generate improved code and developer explanations.</p>
          </div>
        </section>
      </main>

      <footer>
        <p>AI Code Review Assistant • React • Flask • MongoDB • Ollama</p>
      </footer>
    </div>
  );
}

export default App;