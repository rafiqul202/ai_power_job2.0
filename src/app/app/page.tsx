import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import JobInfoForm from "@/features/jobInfos/components/JobInfoForm";
import { getJobInfoUserTag } from "@/features/jobInfos/dbCache";
import { formateExperienceLevel } from "@/features/jobInfos/lib/formater";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { desc, eq } from "drizzle-orm";
import { ArrowRightIcon, Loader2, PlusIcon } from "lucide-react";

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
  const jobInfos = await getJobInfos(userId);
  // console.log("jobinfo console log",{jobInfo})
  if (jobInfos.length === 0) {
    return <NoJobInfos />;
  }
  return (
    <div className="container my-4">
      <div className="flex gap-2 justify-between mb-6 has-hover:*:not-hover:opacity-70">
        <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4">
          Select A Job Description
        </h1>
        <Button asChild>
          <Link href={"/app/job-infos/new"}>
            <PlusIcon className="siz-12 animate-caret-blink" />
            Created Job Description
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {jobInfos.map((jobInfo) => (
          <Link
            className="hover:scale-[1.02] transition-[transform_opacity]"
            href={`/app/job-infos/${jobInfo.id}`}
            key={jobInfo.id}
          >
            <Card className="h-full">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-4 h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{jobInfo.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground line-clamp-3">
                    {jobInfo.description}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Badge variant="destructive">
                      {formateExperienceLevel(jobInfo.experienceLevel)}
                    </Badge>
                    {jobInfo.title && (
                      <Badge variant="outline">{jobInfo.title}</Badge>
                    )}
                  </CardFooter>
                </div>
                <CardContent>
                  <ArrowRightIcon className="size-6 animate-bounce" />
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-12">
        <Link href={"/app/job-infos/new"} className="transition-opacity">
          <Card className="h-full flex items-center justify-center border-dashed border-4 bg-transparent hover:border-primary/60 transition-colors shadow-none">
            <div className="flex items-center justify-center gap-0.5">
              <PlusIcon className="size-8 " />
              <h1>New Job Description</h1>
            </div>
          </Card>
        </Link>
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
