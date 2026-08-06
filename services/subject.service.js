import prisma from "../config/prisma.js";

// Get all available subjects
export const getAllSubjects = async () => {
  return await prisma.subject.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
    },
  });
};

// Save user's selected subjects
export const selectSubjects = async (userId, subjectIds) => {
  // Validate user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email before selecting subjects.");
  }

  // Validate subjectIds
  if (!Array.isArray(subjectIds) || subjectIds.length !== 4) {
    throw new Error("You must select exactly 4 subjects.");
  }

  // Prevent duplicate subjects
  const uniqueSubjects = [...new Set(subjectIds)];

  if (uniqueSubjects.length !== subjectIds.length) {
    throw new Error("Duplicate subjects are not allowed.");
  }

  // Check that all subjects exist
  const subjects = await prisma.subject.findMany({
    where: {
      id: {
        in: subjectIds,
      },
    },
  });

  if (subjects.length !== subjectIds.length) {
    throw new Error("One or more selected subjects do not exist.");
  }

  // Remove previously selected subjects
  await prisma.userSubject.deleteMany({
    where: {
      userId,
    },
  });

  // Save new subjects
  await prisma.userSubject.createMany({
    data: subjectIds.map((subjectId) => ({
      userId,
      subjectId,
    })),
  });

  return await getMySubjects(userId);
};

// Get logged-in user's selected subjects
export const getMySubjects = async (userId) => {
  const userSubjects = await prisma.userSubject.findMany({
    where: {
      userId,
    },
    include: {
      subject: true,
    },
  });

  return userSubjects.map((item) => item.subject);
};

// Update user's selected subjects
export const updateSubjects = async (userId, subjectIds) => {
  return await selectSubjects(userId, subjectIds);
};