"use server";

import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserTable } from "@/drizzle/schema";
import { getJobInfoIdTag } from "../jobInfos/dbCache";

export async function getUser(id: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));
  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
}
