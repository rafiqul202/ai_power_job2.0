"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  experienceLevels,
  JobInfoTable,
  type ExperienceLevel,
} from "@/drizzle/schema/jobInfo";
import { jobInfoSchema } from "../jobInfoSchema";
import { formateExperienceLevel } from "../lib/formater";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { createdJobInfo, updatedJobInfo } from "../actions";

export type JobInfoFormValues = z.infer<typeof jobInfoSchema>;

type JobInfoFormProps = {
  onSubmit?: (values: JobInfoFormValues) => void;
};

const JobInfoForm: React.FC<JobInfoFormProps> = ({
  jobInfo,
}: {
  jobInfo?: Pick<
    typeof JobInfoTable.$inferSelect,
    "id" | "name" | "title" | "description" | "experienceLevel"
  >;
}) => {
  const form = useForm<JobInfoFormValues>({
    resolver: zodResolver(jobInfoSchema),
    defaultValues: jobInfo ?? {
      name: "",
      title: null,
      experienceLevel: undefined as unknown as ExperienceLevel,
      description: "",
      experienceLevel: "junior",
    },
    mode: "onBlur",
  });

  const handleSubmit = async (values: JobInfoFormValues) => {
    const actions = jobInfo
      ? updatedJobInfo.bind(null, jobInfo?.id)
      : createdJobInfo;
    const res = await actions(values);
    if (res.error) {
      toast.error(res.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="The name is displayed in the UI.."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job title </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Frontend Engineer"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value as unknown as string}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {formateExperienceLevel(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A Nextjs 15 and  React 19 full stack web development that use Drizzle ORM and postgres for database management.."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Be a specific as possible.The more information You provide , the
                better hte interviews will be.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-y-1.5">
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="w-full"
          >
            <LoadingSwap isLoading={form.formState.isSubmitting}>
              Save Job Information
            </LoadingSwap>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobInfoForm;
