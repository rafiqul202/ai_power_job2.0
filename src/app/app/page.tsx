import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import JobInfoForm from "@/features/jobInfos/components/JobInfoForm";
import { getJobInfoUserTag } from "@/features/jobInfos/dbCache";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { desc, eq } from "drizzle-orm";
import { Loader2, PlusIcon } from "lucide-react";

import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import React, { Suspense } from "react";

const AppPage = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen-header flex items-center justify-center">
          {" "}
          <Loader2 className="size-24 animate-spin" />
        </div>
      }
    >
      <JobInfo />
    </Suspense>
  );
};

export async function JobInfo() {
  const { userId, redirectToSignIn } = await getCurrentUser({ allData: true });
  if (userId == null) return redirectToSignIn();
  const jobInfo = await getJobInfos(userId);
  // console.log("jobinfo console log",{jobInfo})
  if (jobInfo.length == 0) {
    return <NoJobInfos />;
  }
  return (
    <div className="container my-4">
      <div className="flex gap-2 justify-between mb-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4">
          Your Job Information
        </h1>
        <Button asChild>
          <Link href={"/app/job-infos/new"}>
            <PlusIcon className="siz-12 animate-bounce" />
            Created Job Description
          </Link>
        </Button>
      </div>
    </div>
  );
}

function NoJobInfos() {
  return (
    <div className="container my-4 max-w-5xl">
      <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4">
        Welcome to Landr
      </h1>
      <p className="text-muted-foreground mb-8">
        To get started, enter information about the type of job you are wanting
        to apply for. This can be specific information copied directly from a
        job listing or general information such as the tech stack you want to
        work in. The more specific you are in the description the closer the
        test interviews will be to the real thing.
      </p>
      <Card>
        <CardContent>
          <JobInfoForm />
        </CardContent>
      </Card>
    </div>
  );
}
async function getJobInfos(userId: string) {
  "use cache";
  cacheTag(getJobInfoUserTag(userId));

  return db.query.JobInfoTable.findMany({
    where: eq(JobInfoTable.userId, userId),
    orderBy: desc(JobInfoTable.updatedAt),
  });
}

export default AppPage;
