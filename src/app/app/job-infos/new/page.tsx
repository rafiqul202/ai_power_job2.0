import { BackLink } from "@/components/ui/BackLink";
import { Card, CardContent } from "@/components/ui/card";
import JobInfoForm from "@/features/jobInfos/components/JobInfoForm";
import React from "react";

const JobInfoNewPage = () => {
  return (
    <div className="container my-4 max-w-5xl space-y-5">
      <BackLink href="/app">DashBoard</BackLink>
      <h1 className="text-2xl md:text-3xl">Created New Job description</h1>
      <Card>
        <CardContent>
          <JobInfoForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default JobInfoNewPage;
