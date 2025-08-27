import React from "react";
import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";

const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return <OriginalClerkProvider>{children}</OriginalClerkProvider>;
};

export default ClerkProvider;
