const router = require("express").Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const { listMine, markRead } = require("../controllers/notificationController");

router.get("/", protect, authorizeRoles("student"), listMine);
router.patch("/:id/read", protect, authorizeRoles("student"), markRead);

module.exports = router;
