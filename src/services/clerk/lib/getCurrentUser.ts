import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { getUserIdTag } from "@/features/users/db.cache";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
// { allData = false } = {}
export async function getCurrentUser({ allData = false }) {
  const { userId, redirectToSignIn } = await auth();
  return {
    userId,
    redirectToSignIn,
    user: allData && userId !== null ? await getUser(userId) : undefined,
  };
}

export async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));
  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
}
