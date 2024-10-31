const express = require("express");
const router = express.Router();
const {
  unsubscribe,
  subscribe,
  execute
} = require("../controllers/campaign");

router.route("/unsubscribe").post(unsubscribe);
router.route("/subscribe").post(subscribe);
//router.route("/signup").post(subscribe);
router.route("/execute").post(execute);

module.exports = router;
