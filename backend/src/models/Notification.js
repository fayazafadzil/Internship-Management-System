const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["internship_approved"], required: true },
    message: { type: String, required: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId, ref: "InternshipApplication", required: true },
    readAt: { type: Date, default: null },
    navigationPath: { type: String, required: true, default: "/student/internship-status" },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, type: 1, referenceId: 1 }, { unique: true });

module.exports = mongoose.model("Notification", notificationSchema);
