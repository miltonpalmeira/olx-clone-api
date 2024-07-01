import { prisma } from "../../config/prisma.js";

export const createAd = async (data) => {
  try {
    return await prisma.ads.create({
      data: {
        title: data.title,
        userId: data.userId,
        categoryId: data.categoryId,
        price: data.price,
        priceNegotiable: data.priceNegotiable,
        description: data.description,
        views: data.views || 0,
        status: data.status !== undefined ? data.status : true,
        images: {
          create: data.images || [],
        },
      },
    });
  } catch (error) {
    throw new Error(`Failed to create ad: ${error.message}`);
  }
};

export const findAllAds = async (filters = {}, sort, limit, offset) => {
  try {
    const { categoryId } = filters;
    const whereClause = {
      ...(categoryId && { category: { id: categoryId } }),
      ...(filters.title && { title: { contains: filters.title } }),
    };
    return await prisma.ads.findMany({
      where: whereClause,
      include: {
        images: true,
        user: {
          include: {
            state: true,
          },
        },
      },
      orderBy: { createdAt: sort },
      skip: offset,
      take: limit,
    });
  } catch (error) {
    throw new Error(`Failed to get ads: ${error.message}`);
  }
};

export const findAdById = async (id) => {
  try {
    return await prisma.ads.findUnique({
      where: { id },
      include: { images: true },
    });
  } catch (error) {
    throw new Error(`Failed to get ad by id: ${error.message}`);
  }
};

export const updateAd = async (id, data) => {
  try {
    return await prisma.ads.update({
      where: { id },
      data: {
        title: data.title,
        userId: data.userId,
        categoryId: data.categoryId,
        price: data.price,
        priceNegotiable: data.priceNegotiable,
        description: data.description,
        views: data.views || 0,
        status: data.status !== undefined ? data.status : true,
        images: {
          create: data.images || [],
        },
      },
    });
  } catch (error) {
    throw new Error(`Failed to update ads: ${error.message}`);
  }
};

export const deleteAd = async (id) => {
  try {
    return await prisma.ads.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw new Error(`Failed to delete ads: ${error.message}`);
  }
};