"use client";
import { ComposeProviders } from "@/components/ComposeProviders";
import { EmailProvider } from "@/hooks/useEmail";
import { ActiveEditionProvider } from "../hooks/useActiveEdition";
import { CommitterProvider } from "../hooks/useCommittee";
import { EdicaoProvider } from "../hooks/useEdicao";
import { EvaluationProvider } from "../hooks/useEvaluation";
import { OrientacaoProvider } from "../hooks/useOrientacao";
import { PremiacaoProvider } from "../hooks/usePremiacao";
import { PresentationProvider } from "../hooks/usePresentation";
import { SessionProvider } from "../hooks/useSession";
import { SubmissionProvider } from "../hooks/useSubmission";
import { SubmissionFileProvider } from "../hooks/useSubmissionFile";
import { UserProvider } from "../hooks/useUsers";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ComposeProviders
      with={[
        ActiveEditionProvider,
        UserProvider,
        SessionProvider,
        EvaluationProvider,
        EdicaoProvider,
        PresentationProvider,
        CommitterProvider,
        OrientacaoProvider,
        SubmissionProvider,
        SubmissionFileProvider,
        PremiacaoProvider,
        EmailProvider,
      ]}
    >
      {children}
    </ComposeProviders>
  );
};

export default Providers;
