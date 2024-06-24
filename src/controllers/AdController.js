import { findAllCategories } from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const bdCategories = await findAllCategories();
    let categories = [];
    for (let i in bdCategories) {
      categories.push({
        ...bdCategories[i],
        img: `${process.env.BASE}/assets/img/${bdCategories[i].slug}.png`,
      });
    }
    
    return res.status(200).json({ categories });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get categories", message: error.message });
  }
};
