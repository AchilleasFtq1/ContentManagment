import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PostLogRepository {
  // Fetch all Post Logs
  async getAllLogs() {
    return await prisma.postLog.findMany();
  }

  // Fetch logs with filters (search functionality)
  async getLogsWithFilters(filters: {
    postId?: string;
    userId?: string;
    requestIp?: string;
    from_date?: Date;
    end_date?: Date;
  }) {
    return await prisma.postLog.findMany({
      where: {
        postId: filters.postId,
        userId: filters.userId,
        requestIp: filters.requestIp,
        createdAt: {
          gte: filters.from_date,
          lte: filters.end_date,
        },
      },
    });
  }
}
