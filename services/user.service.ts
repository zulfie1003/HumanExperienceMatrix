import { prisma } from "@/lib/prisma";

interface UserRecord {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  isGuest: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserService {
  async getUserById(id: string): Promise<UserRecord | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async createGuestUser(): Promise<UserRecord> {
    return prisma.user.create({
      data: {
        name: "Guest",
        isGuest: true,
      },
    });
  }

  async updateUser(
    id: string,
    data: Partial<Pick<UserRecord, "name" | "image">>
  ): Promise<UserRecord> {
    return prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async getConversationCount(userId: string): Promise<number> {
    return prisma.conversation.count({ where: { userId } });
  }
}

export const userService = new UserService();
