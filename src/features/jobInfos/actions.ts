"use server";

import z from "zod";
import { jobInfoSchema } from "./jobInfoSchema";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { redirect } from "next/navigation";
import { insertJobInfo, updateJobInfoDb } from "./db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobInfoIdTag } from "./dbCache";
import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";

export async function createdJobInfo(
  unsafeData: z.infer<typeof jobInfoSchema>
) {
  const { userId } = await getCurrentUser({ allData: true });
  if (userId == null) {
    return {
      error: true,
      message: "You don't have permission to created a job information to this",
    };
  }
  const { success, data } = jobInfoSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "Invalid job Data",
    };
  }
  const jobInfo = await insertJobInfo({ ...data, userId });
  redirect(`/app/job-infos/${jobInfo?.id}`);
}

export async function updatedJobInfo(
  id: string,
  unsafeData: z.infer<typeof jobInfoSchema>
) {
  const { userId } = await getCurrentUser({ allData: true });
  if (userId == null) {
    return {
      error: true,
      message: "You do not have permission to do this",
    };
  }
  const { success, data } = jobInfoSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "invalid updated Data",
    };
  }
    const existingJobInfo = await getJobInfo(id, userId);
    if (existingJobInfo == null) {
      return {
        error: true,
        message: "You don't have permission to do this",
      };
    }
  const jobInfo = await updateJobInfoDb(id, data);
  redirect(`/app/job-infos/${jobInfo.id}`);
}
async function getJobInfo(id: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
}
