const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/", (req, res, next) => {
  var body = req.body;
 
  if (body.username != "" && body.password != "") {
    if (body.username == username && body.password == password) {
      jwt.sign({ data: {"username":username,"password":password}}, username, (err, token) => {
        res.status(200).json({
          message: "success",
          data: {"username":username},
          token: token,
        });
      });
    } else {
      res.status(400).json({
        error: "invalid_user",
        message: "invalid_user",
      });
    }
  } else {
    res.status(400).json({
      error: "invalid_user",
      message: "invalid_user",
    });
  }
});

module.exports = router;
