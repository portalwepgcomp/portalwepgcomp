"use client";
import { ComposeProviders } from "@/components/ComposeProviders";
import { UserProvider } from "@/hooks/useUsers";
import { SessionProvider } from "@/hooks/useSession";
import { EvaluationProvider } from "@/hooks/useEvaluation";
import { OrientacaoProvider } from "@/hooks/useOrientacao";
import { CommitterProvider } from "@/hooks/useCommittee";
import { EdicaoProvider } from "@/hooks/useEdicao";
import { PresentationProvider } from "@/hooks/usePresentation";
import { SubmissionProvider } from "@/hooks/useSubmission";
import { ActiveEditionProvider } from "@/hooks/useActiveEdition";
import { SubmissionFileProvider } from "@/hooks/useSubmissionFile";
import { PremiacaoProvider } from "@/hooks/usePremiacao";

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
      ]}
    >
      {children}
    </ComposeProviders>
  );
};

export default Providers;
