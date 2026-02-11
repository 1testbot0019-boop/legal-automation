const fs = require("fs");
const path = require("path");
const docx = require("docx");

const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType
} = docx;

/* ===============================
   GENERATE DOCX FUNCTION
================================ */

async function generateDocx(data) {

    if (!fs.existsSync("uploads")) {
        fs.mkdirSync("uploads");
    }

    const structured = data.structuredData || {};
    const risk = data.riskAnalysis || {};

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [

                    new Paragraph({
                        text: "TITLE SEARCH REPORT",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER
                    }),

                    new Paragraph({ text: " " }),

                    /* ===============================
                       PROPERTY DETAILS
                    =============================== */

                    new Paragraph({
                        text: "PROPERTY DETAILS",
                        heading: HeadingLevel.HEADING_2
                    }),

                    new Paragraph({
                        children: [
                            new TextRun("Owner Name: "),
                            new TextRun({
                                text: structured.ownerName || "Not Available",
                                bold: true
                            })
                        ]
                    }),

                    new Paragraph({
                        children: [
                            new TextRun("Father / Husband Name: "),
                            new TextRun({
                                text: structured.fatherName || "Not Available",
                                bold: true
                            })
                        ]
                    }),

                    new Paragraph({
                        children: [
                            new TextRun("Khata / Khatoni No: "),
                            new TextRun({
                                text: structured.khataNumber || "Not Available",
                                bold: true
                            })
                        ]
                    }),

                    new Paragraph({
                        children: [
                            new TextRun("Khasra / Plot No: "),
                            new TextRun({
                                text: structured.plotNumber || "Not Available",
                                bold: true
                            })
                        ]
                    }),

                    new Paragraph({
                        children: [
                            new TextRun("Area: "),
                            new TextRun({
                                text: structured.area || "Not Available",
                                bold: true
                            })
                        ]
                    }),

                    new Paragraph({ text: " " }),

                    /* ===============================
                       TITLE HISTORY
                    =============================== */

                    new Paragraph({
                        text: "TITLE HISTORY",
                        heading: HeadingLevel.HEADING_2
                    }),

                    new Paragraph({
                        text: data.titleHistoryParagraph || "No Title History Available"
                    }),

                    new Paragraph({ text: " " }),

                    /* ===============================
                       SECTION 143 STATUS
                    =============================== */

                    new Paragraph({
                        text: "SECTION 143 STATUS",
                        heading: HeadingLevel.HEADING_2
                    }),

                    new Paragraph({
                        text: data.sec143Paragraph || "No Information Available"
                    }),

                    new Paragraph({ text: " " }),

                    /* ===============================
                       RISK ANALYSIS
                    =============================== */

                    new Paragraph({
                        text: "RISK ANALYSIS",
                        heading: HeadingLevel.HEADING_2
                    }),

                    new Paragraph({
                        children: [
                            new TextRun("Overall Risk Level: "),
                            new TextRun({
                                text: risk.riskLevel || "Unknown",
                                bold: true
                            })
                        ]
                    }),

                    new Paragraph({ text: "Red Flags:", bold: true }),

                    ...(risk.redFlags || []).map(flag =>
                        new Paragraph({
                            text: "- " + flag
                        })
                    ),

                    new Paragraph({ text: " " }),

                    new Paragraph({ text: "Yellow Flags:" }),

                    ...(risk.yellowFlags || []).map(flag =>
                        new Paragraph({
                            text: "- " + flag
                        })
                    ),

                    new Paragraph({ text: " " }),

                    /* ===============================
                       FINAL LEGAL OPINION
                    =============================== */

                    new Paragraph({
                        text: "FINAL LEGAL OPINION",
                        heading: HeadingLevel.HEADING_2
                    }),

                    new Paragraph({
                        text: data.finalOpinionParagraph || "No Opinion Generated"
                    })

                ]
            }
        ]
    });

    const fileName = "Report_" + Date.now() + ".docx";
    const filePath = path.join("uploads", fileName);

    const buffer = await Packer.toBuffer(doc);

    fs.writeFileSync(filePath, buffer);

    return filePath;
}

module.exports = generateDocx;
