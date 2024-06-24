import { prisma } from "../../config/prisma.js";

export const findAllCategories = async () => {
  try {
    return await prisma.category.findMany();
  } catch (error) {
    throw new Error(`Failed to get all categories ${error.message}`);
  }
};

export const findCategoryById = async (id) => {
  try {
    return await prisma.category.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    throw new Error(`Failed to get category: ${error.message}`);
  }
};

export const findCategoryByName = async (name) => {
  try {
    return await prisma.category.findFirst({
      where: {
        name,
      },
    });
  } catch (error) {
    throw new Error(`Failed to get category: ${error.message}`);
  }
};
