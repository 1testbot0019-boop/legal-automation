const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  loanNo: String,
  applicantName: String,
  riskLevel: String,
  redFlags: [String],
  yellowFlags: [String],
  structuredData: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", ReportSchema);
