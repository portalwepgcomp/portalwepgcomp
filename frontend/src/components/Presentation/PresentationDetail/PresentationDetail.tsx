import { useRouter } from "next/navigation";
import "./PresentationDetail.scss";

interface PresentationCardProps {
  key?: string;
  id: string;
  title: string;
  subtitle: string;
  name: string;
  pdfFile: string;
  email: string;
  advisorName: string;
  presentationData?: Presentation;
  cardColor?: string;
  presenter?: UserAccount;
    location?: string;
    session?: string;
  onDelete?: () => void;
}


export default function PresentationDetail({
  key,
  id,
  title,
  subtitle,
  name,
  pdfFile,
  email,
  advisorName,
  presentationData,
  cardColor,
  onDelete,
  presenter,
  location,
    session,
}: Readonly<PresentationCardProps>) {
  const router = useRouter();
  
  if (!key) {
    return (
      <div className="presentation-detail-page">
        <div className="not-found">Apresentação não encontrada</div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleEvaluate = () => {
    router.push(`/avaliar/${id}`);
  };

  return (
    <div className="presentation-detail-page">
      <button className="back-button" onClick={() => router.push('/programacao')}>
        ← Voltar para programação
      </button>

      <div className="detail-header">
        <h1 className="detail-title">{title}</h1>
      </div>

      <div className="detail-content">
        <div className="presenter-card">
          <div className="presenter-avatar">
            {presenter?.photoFilePath ? (
              <img src={presenter.photoFilePath} alt={presenter.name} />
            ) : (
              <div className="avatar-initials">{getInitials(presenter?.name ? presenter.name : "")}</div>
            )}
            
          </div>
          <div className="presenter-info">
            <h2 className="presenter-name">{presenter?.name}</h2>
            <p className="presenter-email">
              <span className="icon">✉</span> {presenter?.email}
            </p>
            {advisorName && (
              <p className="presenter-advisor">
                Orientador: {advisorName}
              </p>
            )} 
            {presenter?.lattesUrl && (
              <a 
                href={presenter.lattesUrl} 
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
                <p>{presentationData?.startTime}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🕐</span>
              <div className="detail-text">
                <strong>Horário</strong>
                <p>{presentationData?.startTime}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <div className="detail-text">
                <strong>Local</strong>
                <p>{location}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🎯</span>
              <div className="detail-text">
                <strong>Sessão</strong>
                <p>{session}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="abstract-section">
          <h3 className="section-title">Resumo</h3>
          <p className="abstract-text">{subtitle}</p>
        </div>

        <div className="actions-section">
          <h3 className="section-title">Ações</h3>
          <div className="action-buttons">
            <button className="action-button primary">
              <span className="button-icon">📅</span>
              Adicionar ao Google Agenda
            </button>
            <button className="action-button secondary">
              <span className="button-icon">⬇</span>
              Baixar Apresentação
            </button>
            <button className="action-button secondary">
              <span className="button-icon">❤</span>
              Favoritar
            </button>
            <button className="action-button evaluate" onClick={handleEvaluate}>
              <span className="button-icon">⭐</span>
              Avaliar Apresentação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
