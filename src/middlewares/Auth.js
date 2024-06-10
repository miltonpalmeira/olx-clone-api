import { findUserByToken } from "../models/User.js";

export const authPrivate = async (req, res, next) => {
  if (!req.query.token && !req.body.token) {
    res.status(403).json({ notAllowed: true });
    return;
  }

  let token = "";
  if (req.query.token) {
    token = req.query.token;
  }
  if (req.body.token) {
    token = req.body.token;
  }

  if (token == "") {
    res.status(403).json({ notAllowed: true });
    return;
  }

  if (!findUserByToken(token)) {
    res.json({ notAllowed: true });
    return;
  }

  next();
};