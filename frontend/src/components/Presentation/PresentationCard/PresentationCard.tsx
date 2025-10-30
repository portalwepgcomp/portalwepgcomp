import { useRouter } from "next/navigation";
import { useState } from "react";
import "./PresentationCard.scss";

interface PresentationCardProps {
  presentation: Presentation | any;
  type?: string;
  showTime?: boolean;
}

export default function PresentationCard({ presentation, showTime = true, type }: PresentationCardProps) {
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (type === "GeneralSession") return;
    router.push(`/apresentacoes/${presentation.id}`);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  return (
    <div
      className={`presentation-card clickable PresentationSession`}
      onClick={handleClick}
      style={{
        border: type != "PresentationSession" ? "0.063rem solid #8aabd1" : undefined,
        cursor: type == "GeneralSession" ? "default" : "pointer",
        backgroundColor: isHovered && type != "GeneralSession" ? "#89cff0" : type !== "GeneralSession" ? "#cdeefd" : "transparent",
        transition: "background-color 0.3s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="presentation-card-content">
        {showTime && (
          <div className="presentation-time">{presentation?.startTime ? formatTime(presentation?.startTime) : "??:??"}</div>
        )}
        <div className="presentation-info">
          <p className="presentation-title">{presentation?.submission?.title ?? presentation.title}</p>
          <h4 className="presentation-author">{presentation?.submission?.mainAuthor.name}</h4>
        </div>
        <div className="presentation-indicator">→</div>
      </div>
    </div>
  );
}
