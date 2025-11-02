"use client";

import Banner from "@/components/UI/Banner";
import { useSweetAlert } from "@/hooks/useAlert";
import { usePresentation } from "@/hooks/usePresentation";
import moment from "moment";
import "moment/locale/pt-br";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "./style.scss";
import { formatDate, formatOnlyTime, getInitials } from "./utils";

export default function ApresentacaoDetalhes() {
    const params = useParams();
    const router = useRouter();
    const presentationId = params.id as string;
    const {
        getPresentationById,
        postPresentationBookmark,
        getPresentationBookmark,
        deletePresentationBookmark
    } = usePresentation();

    const { showAlert } = useSweetAlert();
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [presentationBookmark, setPresentationBookmark] = useState<PresentationBookmark>();

    const isFetching = useRef(false);
    const hasFetched = useRef(false);

    useEffect(() => {
        moment.locale("pt-br");
    }, []);

    useEffect(() => {
        if (!presentationId || isFetching.current || hasFetched.current) {
            return;
        }

        const controller = new AbortController();

        async function fetchPresentation() {
            isFetching.current = true;

            try {
                const bookmark = await getPresentationBookmark({ presentationId });
                if (!controller.signal.aborted) {
                    setPresentationBookmark(bookmark);
                }

                const data = await getPresentationById(presentationId);
                if (!controller.signal.aborted) {
                    setPresentation(data);
                    setLoading(false);
                    setError(false);
                    hasFetched.current = true;
                }

            } catch (err) {
                if (!controller.signal.aborted) {
                    showAlert({
                        icon: "error",
                        title: `Erro ao carregar apresentação: ${err}`,
                        text: "Ocorreu um erro ao carregar os detalhes da apresentação. Tente novamente mais tarde!",
                        confirmButtonText: "Retornar",
                    });
                    setError(true);
                    setLoading(false);
                }
            } finally {
                if (!controller.signal.aborted) {
                    isFetching.current = false;
                }
            }
        }

        fetchPresentation();

        return () => {
            controller.abort();
            isFetching.current = false;
        };
    }, [presentationId]);

    const handleBack = () => {
        router.back();
    };

    const handleFavorite = async () => {
        const wasBookmarked = presentationBookmark?.bookmarked ?? false;

        setPresentationBookmark({
            bookmarked: !wasBookmarked
        });

        try {
            if (wasBookmarked) {
                await deletePresentationBookmark({ presentationId });
            } else {
                await postPresentationBookmark({ presentationId });
            }
        } catch (err) {
            setPresentationBookmark({
                bookmarked: wasBookmarked
            });

            showAlert({
                icon: "error",
                title: "Erro ao favoritar",
                text: "Não foi possível atualizar o favorito. Tente novamente.",
            });
        }
    };

    const handleAddToCalendar = () => {
        if (!presentation?.presentationTime) {
            showAlert({
                icon: "error",
                title: "Erro",
                text: "Data da apresentação não disponível.",
            });
            return;
        }

        try {
            const startDate = moment(presentation.presentationTime);
            const endDate = moment(presentation.presentationTime).add(1, 'hour');

            const startTime = startDate.format('YYYYMMDDTHHmmss');
            const endTime = endDate.format('YYYYMMDDTHHmmss');

            const eventDetails = {
                text: presentation.submission?.title || 'Apresentação',
                dates: `${startTime}/${endTime}`,
                details: presentation.submission?.abstract || '',
                location: 'Auditório A do IGEO',
                ctz: 'America/Sao_Paulo',
            };

            const params = new URLSearchParams();
            params.append('action', 'TEMPLATE');
            params.append('text', eventDetails.text);
            params.append('dates', eventDetails.dates);
            params.append('details', eventDetails.details);
            params.append('location', eventDetails.location);
            params.append('ctz', eventDetails.ctz);

            const calendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;

            window.open(calendarUrl, '_blank', 'noopener,noreferrer');

        } catch (err) {
            showAlert({
                icon: "error",
                title: "Erro ao criar evento",
                text: "Não foi possível criar o evento no calendário. Tente novamente.",
            });
            console.error('Erro ao criar evento no calendário:', err);
        }
    };

    const handleDownloadPdf = async () => {
        const pdfFile = presentation?.submission?.pdfFile;

        if (!pdfFile) {
            showAlert({
                icon: "warning",
                title: "Arquivo não disponível",
                text: "Esta apresentação não possui arquivo PDF cadastrado.",
            });
            return;
        }

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${pdfFile}`;

            // Faz a requisição para verificar se o arquivo existe
            const response = await fetch(url, { method: 'HEAD' });

            if (!response.ok) {
                showAlert({
                    icon: "warning",
                    title: "Arquivo não encontrado",
                    text: "O arquivo PDF desta apresentação não está mais disponível no servidor.",
                });
                return;
            }

            // Se o arquivo existe, abre em nova aba para download
            window.open(url, '_blank', 'noopener,noreferrer');

        } catch (err) {
            console.error('Erro ao verificar arquivo:', err);
            showAlert({
                icon: "error",
                title: "Erro ao baixar",
                text: "Não foi possível verificar a disponibilidade do arquivo. Tente novamente mais tarde.",
            });
        }
    };

    if (loading) {
        return (
            <div className="apresentacao-loading">
                <div className="loading-spinner"></div>
                <p>Carregando detalhes da apresentação...</p>
            </div>
        );
    }

    if (error || !presentation) {
        return (
            <div className="apresentacao-error">
                <h2>Apresentação não encontrada</h2>
                <p>Não foi possível carregar os detalhes desta apresentação.</p>
                <button onClick={handleBack} className="btn-back">
                    Voltar para a programação
                </button>
            </div>
        );
    }

    return (
        <>
        <Banner title="Detalhes da Apresentação" />
            <div className="presentation-detail-page">
                <button className="back-button" onClick={() => router.back()}>
                    ← Voltar para programação
                </button>

                <div className="detail-header">
                    <h1 className="detail-title">{presentation.submission?.title}</h1>
                </div>

                <div className="detail-content">
                    <div className="presenter-card">
                        <div className="presenter-avatar">
                            {presentation.submission?.mainAuthor?.photoFilePath ? (
                                <img src={presentation.submission.mainAuthor.photoFilePath} alt={presentation.submission.mainAuthor.name} />
                            ) : (
                                <div className="avatar-initials">{getInitials(presentation.submission?.mainAuthor?.name || '')}</div>
                            )}
                        </div>
                        <div className="presenter-info">
                            <h2 className="presenter-name">{presentation.submission?.mainAuthor?.name}</h2>
                            <p className="presenter-email">
                                <span className="icon">✉</span> {presentation.submission?.mainAuthor?.email}
                            </p>
                            {presentation.submission?.advisor && (
                                <p className="presenter-advisor">
                                    Orientador: {presentation.submission.advisor.name}
                                </p>
                            )}
                            {presentation.submission?.mainAuthor?.lattesUrl && (
                                <a
                                    href={presentation.submission.mainAuthor.lattesUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="lattes-link"
                                >
                                    <span className="icon">🔗</span> Currículo Lattes
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="details-section">
                        <h3 className="section-title">Detalhes da Apresentação</h3>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-icon">📅</span>
                                <div className="detail-text">
                                    <strong>Data</strong>
                                    <p>{formatDate(presentation.presentationTime || "")}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <span className="detail-icon">🕐</span>
                                <div className="detail-text">
                                    <strong>Horário</strong>
                                    <p>{formatOnlyTime(presentation.presentationTime || "")}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <span className="detail-icon">📍</span>
                                <div className="detail-text">
                                    <strong>Local</strong>
                                    <p>Auditório A do IGEO</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="abstract-section">
                        <h3 className="section-title">Resumo</h3>
                        <p className="abstract-text">{presentation.submission?.abstract}</p>
                    </div>

                    <div className="actions-section">
                        <h3 className="section-title">Ações</h3>
                        <div className="action-buttons">
                            <button
                                className="action-button primary"
                                onClick={handleAddToCalendar}
                            >
                                <span className="button-icon">📅</span>
                                Adicionar ao Google Agenda
                            </button>

                            <button
                                className="action-button secondary"
                                onClick={handleDownloadPdf}
                                disabled={!presentation.submission?.pdfFile}
                                style={!presentation.submission?.pdfFile ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                            >
                                <span className="button-icon">⬇</span>
                                Baixar Apresentação
                            </button>

                            {presentation.submission?.linkHostedFile && (
                                <a
                                    href={presentation.submission?.linkHostedFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="action-button secondary"
                                >
                                    <span className="button-icon">🔗</span>
                                    Acessar Apresentação
                                </a>
                            )}

                            <button
                                className="action-button secondary"
                                onClick={handleFavorite}
                            >
                                <span
                                    className="button-icon"
                                    style={{ color: presentationBookmark?.bookmarked ? 'red' : 'inherit' }}
                                >
                                    {presentationBookmark?.bookmarked ? '❤️' : '🤍'}
                                </span>
                                {presentationBookmark?.bookmarked ? 'Desfavoritar' : 'Favoritar'}
                            </button>

                            <button className="action-button evaluate" onClick={() => router.push('/avaliacao/' + presentation.id)}>
                                <span className="button-icon">⭐</span>
                                Avaliar Apresentação
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
