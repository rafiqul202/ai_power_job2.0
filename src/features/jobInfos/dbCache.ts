import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getUserGlobalTag() {
  return getGlobalTag("users");
}
export function getJobInfoUserTag(userId: string) {
  return getUserTag("jobInfos", userId);
}

export function getJobInfoIdTag(id: string) {
  return getIdTag("jobInfos", id);
}
export function revalidateJobInfoCache({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  revalidateTag(getUserGlobalTag());
  revalidateTag(getJobInfoUserTag(userId));
  revalidateTag(getJobInfoIdTag(id));
}
// export function revalidateJobInfoCache({
//   id,
//   userId,
// }: {
//   id: string;
//   userId: string;
// }) {
//   revalidateTag(getJobInfoGlobalTag());
//   revalidateTag(getJobInfoUserTag(userId));
//   revalidateTag(getJobInfoIdTag(id));
// }
