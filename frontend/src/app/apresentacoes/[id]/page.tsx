"use client";

import { useSubmission } from "@/hooks/useSubmission";
import moment from "moment";
import "moment/locale/pt-br";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "./style.scss";
import { usePresentation } from "@/hooks/usePresentation";

export default function ApresentacaoDetalhes() {
  const params = useParams();
  const router = useRouter();
  const presentationId = params.id as string;
  const { getPresentations } = usePresentation();

  const [presentation, setPresentation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Previne múltiplas chamadas
  const isFetching = useRef(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    moment.locale("pt-br");
  }, []);

  useEffect(() => {
    // Previne chamadas duplicadas e só executa se o ID mudou
    if (!presentationId || isFetching.current || hasFetched.current) {
      return;
    }

    const controller = new AbortController();
    
    async function fetchPresentation() {
      isFetching.current = true;
      
      try {
        // Busca a submissão usando seu hook
        const data = await getSubmissionById(presentationId);
        
        if (!controller.signal.aborted) {
          setPresentation(data);
          setLoading(false);
          setError(false);
          hasFetched.current = true;
        }
        
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Erro ao carregar apresentação:", err);
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

    // Cleanup: cancela requisição se componente desmontar
    return () => {
      controller.abort();
      isFetching.current = false;
    };
  }, [presentationId, getSubmissionById]);

  const handleBack = () => {
    router.back();
  };

  const formatDateTime = (dateString: string) => {
    return moment(dateString).format("DD [de] MMMM [de] YYYY [às] HH:mm");
  };

  const formatTime = (dateString: string) => {
    return moment(dateString).format("HH:mm");
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
    <div className="apresentacao-detalhes">
      <div className="apresentacao-header">
        <button onClick={handleBack} className="btn-back">
          <span className="back-arrow">←</span> 
          <span>Voltar para a programação</span>
        </button>
      </div>

      <div className="apresentacao-content">
        <div className="apresentacao-main">
          <h1 className="apresentacao-titulo">
            {presentation.submission?.title || presentation.title}
          </h1>

          <div className="apresentacao-meta">
            {presentation.startTime && (
              <div className="meta-item">
                <strong>📅 Data e Horário</strong>
                <span>{formatDateTime(presentation.startTime)}</span>
              </div>
            )}

            {presentation.room && (
              <div className="meta-item">
                <strong>📍 Local</strong>
                <span>{presentation.room.name}</span>
              </div>
            )}

            {presentation.submission?.mainAuthor && (
              <div className="meta-item">
                <strong>👤 Autor Principal</strong>
                <span>{presentation.submission.mainAuthor.name}</span>
                {presentation.submission.mainAuthor.email && (
                  <span className="email">{presentation.submission.mainAuthor.email}</span>
                )}
              </div>
            )}

            {presentation.submission?.coAuthors && 
             presentation.submission.coAuthors.length > 0 && (
              <div className="meta-item">
                <strong>👥 Co-autores</strong>
                <ul>
                  {presentation.submission.coAuthors.map((author: any, idx: number) => (
                    <li key={idx}>{author.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {presentation.submission?.abstract && (
            <div className="apresentacao-section">
              <h2>Resumo</h2>
              <p className="apresentacao-abstract">
                {presentation.submission.abstract}
              </p>
            </div>
          )}

          {presentation.submission?.keywords && 
           presentation.submission.keywords.length > 0 && (
            <div className="apresentacao-section">
              <h2>Palavras-chave</h2>
              <div className="apresentacao-keywords">
                {presentation.submission.keywords.map((keyword: string, idx: number) => (
                  <span key={idx} className="keyword-tag">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {presentation.submission?.methodology && (
            <div className="apresentacao-section">
              <h2>Metodologia</h2>
              <p className="apresentacao-text">
                {presentation.submission.methodology}
              </p>
            </div>
          )}

          {presentation.submission?.results && (
            <div className="apresentacao-section">
              <h2>Resultados</h2>
              <p className="apresentacao-text">
                {presentation.submission.results}
              </p>
            </div>
          )}

          {presentation.submission?.conclusions && (
            <div className="apresentacao-section">
              <h2>Conclusões</h2>
              <p className="apresentacao-text">
                {presentation.submission.conclusions}
              </p>
            </div>
          )}
        </div>

        <aside className="apresentacao-sidebar">
          <div className="sidebar-card">
            <h3>Informações da Sessão</h3>
            
            {presentation.startTime && (
              <div className="sidebar-item">
                <span className="sidebar-label">Horário</span>
                <span className="sidebar-value">{formatTime(presentation.startTime)}</span>
              </div>
            )}

            {presentation.duration && (
              <div className="sidebar-item">
                <span className="sidebar-label">Duração</span>
                <span className="sidebar-value">{presentation.duration} minutos</span>
              </div>
            )}

            {presentation.room && (
              <div className="sidebar-item">
                <span className="sidebar-label">Sala</span>
                <span className="sidebar-value">{presentation.room.name}</span>
              </div>
            )}

            {presentation.session && (
              <div className="sidebar-item">
                <span className="sidebar-label">Sessão</span>
                <span className="sidebar-value">{presentation.session.title}</span>
              </div>
            )}
          </div>

          <div className="sidebar-card sidebar-actions">
            <h3>Ações</h3>
            <button className="btn-action btn-calendar">
              📅 Adicionar ao calendário
            </button>
            <button className="btn-action btn-share">
              🔗 Compartilhar
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}