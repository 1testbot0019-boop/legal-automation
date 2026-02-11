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

router.post("/upload", upload.single("document"), async (req, res) => {
    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);

        const extracted = await extractData(pdfData.text);

        const filePath = await generateDocx(extracted);

        res.download(filePath);

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error during processing");
    }
});


    const docPath = generateDoc(aiResult);

    res.download(docPath);

  } catch (err) {
    res.send("Error processing report.");
  }
});

module.exports = router;
