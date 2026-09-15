import re


def analyze_code(code, language):
    """
    Basic static analysis for Java, Python and JavaScript code.
    Returns deterministic findings without using AI.
    """

    issues = []
    security_issues = []
    quality_issues = []
    suggestions = []

    lines = code.splitlines()
    language_lower = language.lower()

    # ---------------------------------------------------------
    # 1. Hardcoded secrets / credentials
    # ---------------------------------------------------------
    secret_patterns = [
        r'password\s*=\s*["\'].*["\']',
        r'api[_-]?key\s*=\s*["\'].*["\']',
        r'secret[_-]?key\s*=\s*["\'].*["\']',
        r'access[_-]?token\s*=\s*["\'].*["\']'
    ]

    for line_number, line in enumerate(lines, start=1):
        for pattern in secret_patterns:
            if re.search(pattern, line, re.IGNORECASE):
                security_issues.append(
                    f"Possible hardcoded credential detected near line {line_number}."
                )
                suggestions.append(
                    "Store passwords, API keys and secrets in environment variables."
                )
                break

    # ---------------------------------------------------------
    # 2. Very long lines
    # ---------------------------------------------------------
    long_lines = []

    for line_number, line in enumerate(lines, start=1):
        if len(line) > 120:
            long_lines.append(line_number)

    if long_lines:
        quality_issues.append(
            f"Found {len(long_lines)} line(s) longer than 120 characters."
        )
        suggestions.append(
            "Break long lines into smaller readable statements."
        )

    # ---------------------------------------------------------
    # 3. Too many lines
    # ---------------------------------------------------------
    if len(lines) > 150:
        quality_issues.append(
            "The file is relatively large and may contain too many responsibilities."
        )
        suggestions.append(
            "Consider splitting large logic into smaller functions or classes."
        )

    # ---------------------------------------------------------
    # 4. Python specific checks
    # ---------------------------------------------------------
    if language_lower == "python":

        if re.search(r'\bprint\s*\(', code):
            quality_issues.append(
                "print() statements were found."
            )
            suggestions.append(
                "Use logging instead of print() for production applications."
            )

        if re.search(r'except\s*:', code):
            quality_issues.append(
                "A broad exception handler 'except:' was detected."
            )
            suggestions.append(
                "Catch specific exception types instead of using a bare except."
            )

        if re.search(r'\beval\s*\(', code):
            security_issues.append(
                "eval() detected. It can execute arbitrary Python expressions."
            )
            suggestions.append(
                "Avoid eval() when processing user-controlled input."
            )

    # ---------------------------------------------------------
    # 5. Java specific checks
    # ---------------------------------------------------------
    if language_lower == "java":

        if "System.out.println" in code:
            quality_issues.append(
                "System.out.println() statements were found."
            )
            suggestions.append(
                "Use a proper logging framework for production applications."
            )

        if re.search(r'catch\s*\(\s*Exception\s+\w+\s*\)', code):
            quality_issues.append(
                "Generic Exception catching was detected."
            )
            suggestions.append(
                "Catch more specific exception types where possible."
            )

    # ---------------------------------------------------------
    # 6. JavaScript specific checks
    # ---------------------------------------------------------
    if language_lower == "javascript":

        if re.search(r'\bvar\s+', code):
            quality_issues.append(
                "var declarations were detected."
            )
            suggestions.append(
                "Prefer let or const for modern JavaScript code."
            )

        if re.search(r'\beval\s*\(', code):
            security_issues.append(
                "eval() detected. It can execute arbitrary JavaScript code."
            )
            suggestions.append(
                "Avoid eval(), especially with user-controlled input."
            )

        if "console.log" in code:
            quality_issues.append(
                "console.log() statements were found."
            )
            suggestions.append(
                "Remove debugging console.log() statements from production code."
            )

    # ---------------------------------------------------------
    # 7. Nested condition detection
    # ---------------------------------------------------------
    max_indentation = 0

    for line in lines:
        if not line.strip():
            continue

        indentation = len(line) - len(line.lstrip())

        if indentation > max_indentation:
            max_indentation = indentation

    if max_indentation >= 16:
        quality_issues.append(
            "Deep code indentation was detected."
        )
        suggestions.append(
            "Reduce nested conditions by extracting logic into smaller functions."
        )

    # ---------------------------------------------------------
    # 8. TODO / FIXME detection
    # ---------------------------------------------------------
    todo_count = len(
        re.findall(r'\b(TODO|FIXME)\b', code, re.IGNORECASE)
    )

    if todo_count > 0:
        quality_issues.append(
            f"Found {todo_count} TODO/FIXME comment(s)."
        )
        suggestions.append(
            "Review and resolve pending TODO/FIXME items before production."
        )

    # ---------------------------------------------------------
    # 9. Basic complexity estimation
    # ---------------------------------------------------------
    control_flow_patterns = [
        r'\bif\b',
        r'\belse\b',
        r'\bfor\b',
        r'\bwhile\b',
        r'\bswitch\b',
        r'\bcase\b',
        r'\bcatch\b'
    ]

    control_flow_count = 0

    for pattern in control_flow_patterns:
        control_flow_count += len(
            re.findall(pattern, code, re.IGNORECASE)
        )

    if control_flow_count <= 3:
        complexity_estimate = "Low"
    elif control_flow_count <= 8:
        complexity_estimate = "Moderate"
    else:
        complexity_estimate = "High"

    # ---------------------------------------------------------
    # 10. Calculate static analysis score
    # ---------------------------------------------------------
    total_issues = (
        len(issues)
        + len(security_issues)
        + len(quality_issues)
    )

    score = max(0, 100 - (total_issues * 8))

    # ---------------------------------------------------------
    # 11. Default messages
    # ---------------------------------------------------------
    if not security_issues:
        security_issues.append(
            "No obvious security pattern was detected by static analysis."
        )

    if not quality_issues:
        quality_issues.append(
            "No major code quality issues were detected by static analysis."
        )

    if not suggestions:
        suggestions.append(
            "Code looks structurally clean based on the static checks."
        )

    # ---------------------------------------------------------
    # Final result
    # ---------------------------------------------------------
    return {
        "static_score": score,
        "complexity_estimate": complexity_estimate,
        "issues": issues,
        "security_issues": security_issues,
        "quality_issues": quality_issues,
        "suggestions": suggestions,
        "lines_of_code": len(lines),
        "control_flow_count": control_flow_count
    }