"use client";

import moment from "moment";
import "moment/locale/pt-br";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./style.scss";

export default function ApresentacaoDetalhes() {
    const params = useParams();
    const router = useRouter();
    const presentationId = params.id as string;

    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Aqui você faria a chamada API para buscar os detalhes
        // Por exemplo:
        async function fetchPresentation() {
            try {
                setLoading(true);
                // const response = await api.get(`/presentations/${presentationId}`);
                // setPresentation(response.data);

                // Por enquanto, mock de dados
                // Substitua isso pela sua chamada real
            } catch (error) {
                console.error("Erro ao carregar apresentação:", error);
            } finally {
                setLoading(false);
            }
        }

        if (presentationId) {
            fetchPresentation();
        }
    }, [presentationId]);

    const handleBack = () => {
        router.back();
    };

    const formatDateTime = (dateString: string) => {
        return moment(dateString).format("DD/MM/YYYY [às] HH:mm");
    };

    if (loading) {
        return (
            <div className="apresentacao-loading">
                <p>Carregando...</p>
            </div>
        );
    }

    if (!presentation) {
        return (
            <div className="apresentacao-error">
                <h2>Apresentação não encontrada</h2>
                <button onClick={handleBack} className="btn-back">
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="apresentacao-detalhes">
            <div className="apresentacao-header">
                <button onClick={handleBack} className="btn-back">
                    <span>←</span> Voltar
                </button>
            </div>

            <div className="apresentacao-content">
                <div className="apresentacao-main">
                    <h1 className="apresentacao-titulo">
                        {presentation.submission?.title}
                    </h1>

                    <div className="apresentacao-meta">
                        {presentation.startTime && (
                            <div className="meta-item">
                                <strong>Data e Horário:</strong>
                                <span>{formatDateTime(presentation.startTime)}</span>
                            </div>
                        )}

                        {presentation.submission?.mainAuthor && (
                            <div className="meta-item">
                                <strong>Autor Principal:</strong>
                                <span>{presentation.submission.mainAuthor.name}</span>
                            </div>
                        )}
                        {presentation.submission?.abstract && (
                            <div className="apresentacao-section">
                                <h2>Resumo</h2>
                                <p className="apresentacao-abstract">
                                    {presentation.submission.abstract}
                                </p>
                            </div>
                        )}

                        {/* Adicione mais seções conforme necessário */}
                    </div>

                    <aside className="apresentacao-sidebar">
                        <div className="sidebar-card">
                            <h3>Informações da Sessão</h3>
                            {/* Adicione informações da sala, horário, etc */}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
