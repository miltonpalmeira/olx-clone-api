import {
  findAllCategories,
  findCategoryByName,
  findCategoryById,
} from "../models/Category.js";
import { findUserByToken, findUserById } from "../models/User.js";
import { createAd, findAllAds, updateAd, findAdById } from "../models/Ad.js";
import { randomUUID } from "node:crypto";
import jimp from "jimp";

const addImage = async (buffer) => {
  let newName = `${randomUUID()}.png`;
  let tmpImg = await jimp.read(buffer);
  tmpImg.cover(500, 500).quality(80).write(`./public/media/${newName}`);
  return newName;
};

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

export const create = async (req, res) => {
  try {
    let { title, price, priceneg, desc, category, token } = req.body;
    const user = await findUserByToken(token);
    const categoryId = await findCategoryByName(category);
    const data = {
      status: true,
      userId: user.id,
      state: user.stateId,
      dateCreated: new Date(),
      title,
      categoryId: categoryId.id,
      price: parseFloat(price.match(/\d|,/g).join("").replace(",", ".")),
      priceNegotiable: priceneg == "true" ? true : false,
      description: desc,
      views: 0,
      images: [],
    };

    if (req.files) {
      for (let i = 0; i < req.files.images.length; i++) {
        if (
          ["image/jpeg", "image/jpg", "image/png"].includes(
            req.files.images[i].mimetype
          )
        ) {
          let url = await addImage(req.files.images[i].data);
          data.images.push({
            url,
            default: false,
          });
        }
      }
    } else {
      let url = `${process.env.BASE}/media/default.png`;
      data.images.push({
        url,
        default: false,
      });
    }

    const info = await createAd(data);
    return res.status(201).json({ info });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create Ad", message: error.message });
  }
};

export const getList = async (req, res) => {
  try {
    let { sort = "asc", offset = 0, limit = 10, q, category } = req.query;
    let total = 0;
    let filters = { status: true };
    const adsTotal = await findAllAds(filters);
    total = adsTotal.length;
    if (q) filters.title = q;
    if (category) {
      const categoryId = await findCategoryByName(category);
      if (categoryId) filters.categoryId = categoryId.id;
    }
    limit = parseInt(limit);
    const adsData = await findAllAds(filters, sort, limit, parseInt(offset));
    let ads = [];
    for (let i in adsData) {
      let image;
      let defaultImg = adsData[i].images?.find((e) => e.default);

      if (defaultImg) image = `${process.env.BASE}/media/${defaultImg.url}`;
      else image = `${process.env.BASE}/media/default.png`;
      ads.push({
        id: adsData[i].id,
        title: adsData[i].title,
        price: adsData[i].price,
        priceNegotiable: adsData[i].priceNegotiable,
        dateCreated: adsData[i].createdAt,
        state: adsData[i].user.state.name,
        image,
      });
    }
    return res.status(200).json({ ads, total });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get list of ads", message: error.message });
  }
};

export const getItem = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      res.status(500).json({ error: "Id is not provided" });
      return;
    }

    let ad = await findAdById(parseInt(id));
    if (!ad) {
      res.status(404).json({ error: "We didn't find the product" });
      return;
    }

    const updates = {};
    updates.views = ++ad.views;
    await updateAd(parseInt(id), updates);

    let images = [];
    for (let i in ad.images) {
      images.push(`${process.env.BASE}/media/${ad.images[i].url}`);
    }

    let category = await findCategoryById(ad.categoryId);
    let userInfo = await findUserById(ad.userId);
    return res.status(200).json({
      id: ad.id,
      title: ad.title,
      price: ad.price,
      priceNegotiable: ad.priceNegotiable,
      description: ad.description,
      dateCreated: ad.createdAt,
      views: ad.views,
      category,
      userInfo: {
        name: userInfo.name,
        email: userInfo.email,
      },
      images: images,
    });
  } catch (error) {
    throw new Error(`Failed to list ad: ${error.message}`);
  }
};
