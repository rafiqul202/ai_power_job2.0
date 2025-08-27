import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { JobInfoTable } from "./jobInfo";
import { relations } from "drizzle-orm/relations";
import { createdAt, id, updatedAt } from "../schemaHelpers";

export const InterviewTable = pgTable("interviews", {
  id,
  jobInfoId: uuid()
    .references(() => JobInfoTable.id, { onDelete: "cascade" })
    .notNull(),
  duration: varchar().notNull(),
  humeChatId: varchar(),
  feedback: varchar(),
  createdAt,
  updatedAt,
});

export const interviewRelations = relations(InterviewTable, ({ one }) => ({
  jobInfo: one(JobInfoTable, {
    fields: [InterviewTable.jobInfoId],
    references: [JobInfoTable.id],
  }),
}));
