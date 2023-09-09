"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useState } from "react";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [querClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={querClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
