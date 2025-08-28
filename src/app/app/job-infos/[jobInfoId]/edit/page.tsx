import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import JobInfoBackLink from "@/features/jobInfos/components/JobInfoBackLink";
import JobInfoForm from "@/features/jobInfos/components/JobInfoForm";
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { and, eq } from "drizzle-orm";
import { Loader2 } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import React, { Suspense } from "react";

const JobInfoEditPage = async ({
  params,
}: {
  params: Promise<{ jobInfoId: string }>;
}) => {
  const { jobInfoId } = await params;
  return (
    <div className="container my-4 max-w-5xl space-y-5">
      <JobInfoBackLink jobInfoId={jobInfoId} />
      <h1 className="text-2xl md:text-3xl">Edit New Job description</h1>
      <Card>
        <CardContent>
          <Suspense
            fallback={<Loader2 className="size-24 animate-spin mx-auto" />}
          >
            <SuspendedForm jobInfoId={jobInfoId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobInfoEditPage;

async function SuspendedForm({ jobInfoId }: { jobInfoId: string }) {
  const { userId, redirectToSignIn } = await getCurrentUser({ allData: true });
  if (userId == null) return redirectToSignIn();
  const jobInfo = await getJobInfo(jobInfoId, userId);
  return <JobInfoForm jobInfo={jobInfo} />;
}

async function getJobInfo(jobInfoid: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(jobInfoid));
  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, jobInfoid), eq(JobInfoTable.userId, userId)),
  });
}
