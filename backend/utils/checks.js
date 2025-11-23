export function runChecks(text) {
  const results = [];

  // Check X: Word Count
  const wordCount = text.split(/\s+/).length;
  results.push({
    check: "Word Count",
    value: wordCount,
    status: wordCount > 50 ? "OK" : "Too Short"
  });

  // Check Y: Contains Specific Keyword
  const keyword = "important";
  const containsKeyword = text.toLowerCase().includes(keyword);
  results.push({
    check: "Keyword Check",
    value: containsKeyword,
    status: containsKeyword ? "Found" : "Not Found"
  });

  // Check Z: Basic Plagiarism (very basic example)
  const suspected = text.includes("Lorem ipsum");
  results.push({
    check: "Plagiarism Check",
    value: suspected,
    status: suspected ? "Suspicious" : "Clean"
  });

  return results;
}
