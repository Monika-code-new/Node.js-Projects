import { prisma } from '../prisma/client';
import { RegisterInput, LoginInput, UpdateInput } from '../utils/type';

export const authService = {
  // REGISTER 
  register: async (data: RegisterInput) => {
    const { name, email, password } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('User already exists');

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password },
      select: { id: true, name: true, email: true },
    });

    return user;
  },

  //  LOGIN 
  login: async (data: LoginInput) => {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    return { id: user.id, name: user.name, email: user.email };
  },

  // PROFILE 
  getProfile: async (userId: number) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) throw new Error('Unauthorized');
    return user;
  },

  //  UPDATE USER 
  updateUser: async (id: number, data: UpdateInput) => {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true },
    });

    return user;
  },

  //  DELETE USER 
  deleteUser: async (id: number) => {
    await prisma.user.delete({ where: { id } });
  },
};
