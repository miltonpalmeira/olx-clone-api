import { prisma } from "../../config/prisma.js";

// CREATE (INSERT) DATA
export const createState = async (name) => {
  return await prisma.state.create({
    data: { name },
  });
};

// READ (SELECT ALL)
export const findAllStates = async () => {
  return await prisma.state.findMany();
};

// READ (SELECT BY ID OR OTHER FIELD)
export const findStateById = async (stateId) => {
  return await prisma.state.findUnique({
    where: { id: stateId },
  });
};

// UPDATE DATA
export const updateState = async (id, data) => {
  return await prisma.state.update({
    where: {
      id,
    },
    data: {
      name: data.name,
    },
  });
};

// DELETE DATA
export const deleteState = async (id) => {
  return await prisma.state.delete({
    where: {
      id,
    },
  });
};

export const findStateByName = async (stateName) => {
  return await prisma.state.findUnique({
    where: {
      name: stateName,
    },
  });
};
