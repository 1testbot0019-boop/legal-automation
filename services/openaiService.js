const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function extractData(text) {

    try {

        const prompt = `
Return ONLY valid JSON.
Do not write explanation.
Do not use markdown.

Required Format:

{
  "structuredData": {
    "ownerName": "",
    "fatherName": "",
    "khataNumber": "",
    "plotNumber": "",
    "area": ""
  },
  "titleHistoryParagraph": "",
  "sec143Paragraph": "",
  "riskAnalysis": {
    "riskLevel": "",
    "redFlags": [],
    "yellowFlags": []
  },
  "finalOpinionParagraph": ""
}

Document Text:
${text}
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0
        });

        const raw = response.choices[0].message.content;

        console.log("AI RAW OUTPUT:");
        console.log(raw);

        try {
            return JSON.parse(raw);
        } catch (jsonError) {
            console.error("JSON Parse Error:", jsonError);
            throw new Error("AI returned invalid JSON");
        }

    } catch (error) {
        console.error("OpenAI Error:", error);
        throw error;
    }
}

module.exports = extractData;
