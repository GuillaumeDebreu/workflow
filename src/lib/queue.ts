import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const workflowQueue = new Queue("workflow-execution", { connection });

export function createWorkflowWorker(
  processor: (job: { data: { userWorkflowId: string; userId: string } }) => Promise<void>
) {
  return new Worker("workflow-execution", processor, {
    connection,
    concurrency: 5,
  });
}
