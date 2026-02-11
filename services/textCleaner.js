function cleanText(text) {
  return text
    .replace(/अप्रमाणित प्रति/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = cleanText;
