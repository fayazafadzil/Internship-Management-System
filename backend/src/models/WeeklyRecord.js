const mongoose = require("mongoose");

const weeklyRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    weekNumber: { type: Number, required: true },
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    filePath: { type: String, default: "" },
    originalFilename: { type: String, default: "" },
    isLateSubmission: { type: Boolean, default: false },
    status: { type: String, enum: ["Pending", "Submitted", "Missing"], default: "Pending" },
    submittedAt: { type: Date },
  },
  { timestamps: true },
);

// Compound index to ensure uniqueness of weekNumber per student
weeklyRecordSchema.index({ user: 1, weekNumber: 1 }, { unique: true });

module.exports = mongoose.model("WeeklyRecord", weeklyRecordSchema);
