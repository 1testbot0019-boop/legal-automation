const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function extractData(text) {
  const prompt = `
You are a senior banking property lawyer.

Extract structured property data and perform risk analysis.

Return JSON:
{
  structuredData:{},
  titleHistoryParagraph:"",
  sec143Paragraph:"",
  riskAnalysis:{
    riskLevel:"",
    redFlags:[],
    yellowFlags:[]
  },
  finalOpinionParagraph:""
}

Hindi Text:
${text}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = extractData;
