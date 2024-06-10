import { prisma } from "../../config/prisma.js";

export const createUser = async (data, stateId) => {
  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      token: data.token,
      state: {
        connect: {
          id: stateId,
        },
      },
    },
  });
};

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      state: true,
    },
  });
};

export const findAllUsers = async () => {
  return await prisma.user.findMany({
    include: { state: true },
  });
};

export const updateToken = async (userId, token) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      token,
    },
  });
};

export const findUserByTokenWithRelations = async (token) => {
  return await prisma.user.findFirst({
    where: { token },
    include: {
      Ads: true,
      state: true,
    },
  });
};

export const findUserByToken = async (token) => {
  return await prisma.user.findFirst({
    where: { token },
  });
};
