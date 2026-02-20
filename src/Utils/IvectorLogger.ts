import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function ivectorRequest(config: any) {
  const start = Date.now();

  try {
    const response = await axios(config);

    await prisma.ivRequestLog.create({
      data: {
        url: config.url,
        method: config.method,
        requestBody: config.data ?? null,
        statusCode: response.status,
        durationMs: Date.now() - start,
        status: "SUCCESS",
      },
    });

    return response.data;

  } catch (error: any) {

    await prisma.ivRequestLog.create({
      data: {
        url: config.url,
        method: config.method,
        requestBody: config.data ?? null,
        statusCode: error.response?.status ?? null,
        durationMs: Date.now() - start,
        status: "ERROR",
        error: error.message,
      },
    });

    throw error;
  }
}
