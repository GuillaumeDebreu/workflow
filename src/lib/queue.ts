import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

let connection: IORedis | null = null;

function getConnection() {
  if (!connection && process.env.REDIS_URL) {
    connection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });
  }
  return connection;
}

export function getWorkflowQueue() {
  const conn = getConnection();
  if (!conn) return null;
  return new Queue("workflow-execution", { connection: conn });
}

export function createWorkflowWorker(
  processor: (job: { data: { userWorkflowId: string; userId: string } }) => Promise<void>
) {
  const conn = getConnection();
  if (!conn) throw new Error("Redis not configured");
  return new Worker("workflow-execution", processor, {
    connection: conn,
    concurrency: 5,
  });
}
