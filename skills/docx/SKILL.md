---
name: docx
description: "Use for creating, reading, editing, or manipulating Microsoft Word documents (.docx files). Triggered by mentions of \"Word doc\", \"word document\", \".docx\", or requests for reports, memos, letters, or templates. Prioritize Python libraries."
license: Proprietary. LICENSE.txt has complete terms
---

# DOCX creation, editing, and analysis

## Quick Reference

| Task | Approach | Python Library/Tool | Example |
|------|----------|----------------------|---------------------------------------------------|
| Read/analyze content | Extract text & metadata | `python-docx`, `pandoc` | `python-docx.Document('report.docx').paragraphs[0].text` or `pandoc -s report.docx -t plain` |
| Create new document | Generate from scratch | `docx-js`, `python-docx` |  `from docx import Document; doc = Document(); doc.add_paragraph('Hello, world!'); doc.save('new_doc.docx')` |
| Edit existing document | Modify XML | `python-docx`, `zipfile` | `doc = python-docx.Document('existing.docx'); p = doc.paragraphs[0]; p.text = 'Updated text'; doc.save('updated.docx')` |
| Convert .doc to .docx | Convert older format | `pandoc` | `pandoc -s input.doc -o output.docx` |

### Trigger Conditions:

*   **Use when:** User requests document creation, modification, or analysis.
*   **Use when:** User mentions ".docx" or "Word doc".
*   **Use when:** Task involves professional document formats (report, memo, letter, template).
*   **Do not use when:** PDF, spreadsheet, or Google Docs are requested.
*   **Do not use when:** Task is unrelated to document manipulation.

### Output Format:

*   **Document Creation/Editing:** Return file path. Example: `"File saved to: /path/to/document.docx"`
*   **Content Analysis:** Return extracted text or structured content (e.g., list of paragraphs). Example: `["Paragraph 1: ...", "Paragraph 2: ..."]`
*   **Error Handling:** Return a clear error message. Example: `"Error: Could not open file /path/to/nonexistent.docx"`