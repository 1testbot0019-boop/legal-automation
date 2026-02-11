const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");
const fs = require("fs");
const extractData = require("../services/openaiService");
const cleanText = require("../services/textCleaner");
const generateDoc = require("../services/docxGenerator");
const Report = require("../models/Report");
const auth = require("../middleware/auth");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);

    const cleaned = cleanText(pdfData.text);
    const aiResult = await extractData(cleaned);

    await Report.create({
      loanNo: req.body.loanNo,
      applicantName: req.body.applicantName,
      riskLevel: aiResult.riskAnalysis.riskLevel,
      redFlags: aiResult.riskAnalysis.redFlags,
      yellowFlags: aiResult.riskAnalysis.yellowFlags,
      structuredData: aiResult.structuredData
    });

    const docPath = generateDoc(aiResult);

    res.download(docPath);

  } catch (err) {
    res.send("Error processing report.");
  }
});

module.exports = router;
