"use client";

import { useAuth } from "@/hooks/useAuth";
import LoadingPage from "../LoadingPage";

interface TokenValidationWrapperProps {
  children: React.ReactNode;
}

export const TokenValidationWrapper = ({ children }: TokenValidationWrapperProps) => {
  const { isValidatingToken } = useAuth();

  if (isValidatingToken) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};
