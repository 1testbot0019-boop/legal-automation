const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const extractData = require("../services/openaiService");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        const data = await pdfParse(req.file.buffer);
        const text = data.text;

        const result = await extractData(text);

        res.json(result);

    } catch (err) {
        console.error("UPLOAD ERROR:", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
