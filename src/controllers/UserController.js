import { findAllStates } from "../models/State.js";
import { findUserByTokenWithRelations } from '../models/User.js';

export const getStates = async (req, res) => {
  try {
    const states = await findAllStates();
    res.status(200).json({ states });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get states", message: error.message });
  }
};

export const info = async (req, res) => {
  try {
    let token = req.body.token;
    if (!token) {
      res.status(500).json({ error: "Token was not provided" });
      return;
    }
    const user = await findUserByTokenWithRelations(token);
    let adList = []; // TODO: adicionar os dados do anúncio
    res.status(200).json({
      name: user.name,
      email: user.email,
      state: user.state.name,
      ads: adList,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get info of the user",
      message: error.message,
    });
  }
};
