import { BackLink } from "@/components/ui/BackLink";
import { cn } from "@/lib/utils";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import React, { Suspense } from "react";
import { getJobInfoIdTag } from "../dbCache";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { JobInfoTable } from "@/drizzle/schema";

const JobInfoBackLink = ({
  jobInfoId,
  className,
}: {
  jobInfoId: string;
  className?: string;
}) => {
  return (
    <BackLink
      href={`/app/job-infos/${jobInfoId}`}
      className={cn("mb-4", className)}
    >
      <Suspense fallback={"Job Description"}>
        <JobName jobInfoId={jobInfoId} />
      </Suspense>
    </BackLink>
  );
};

export default JobInfoBackLink;

async function JobName({ jobInfoId }: { jobInfoId: string }) {
  const jobInfo = await getJobInfoId(jobInfoId);
  return jobInfo?.name ?? "Job Description";
}

async function getJobInfoId(id: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));
  return db.query.JobInfoTable.findFirst({
    where: eq(JobInfoTable.id, id),
  });
}
