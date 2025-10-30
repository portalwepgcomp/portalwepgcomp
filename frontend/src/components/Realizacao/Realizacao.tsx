"use client";

import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { useEdicao } from "@/hooks/useEdicao";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";

import "./style.scss";

type Logo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
};

export default function Realizacao() {
  const [content, setContent] = useState("");
  const { updateEdicao, Edicao } = useEdicao();

  const realizacaoLogos: Logo[] = useMemo(
    () => [
      { src: "/assets/images/ic_logo_padrao.png", alt: "Computação UFFBA Logo", width: 150, height: 150, priority: true },
      { src: "/assets/images/brasao-ufba.svg", alt: "UFBA Logo", width: 100, height: 130, priority: true },
      { src: "/assets/images/logo-capes-fundo-claro.jpg", alt: "Capes Logo", width: 100, height: 130, priority: true },
      { src: "/assets/images/logo-proext.png", alt: "Proext Logo", width: 100, height: 130, priority: true },
    ],
    [],
  );

  const apoioLogos: Logo[] = useMemo(() => [], []);

  const uniqueBySrc = useCallback((logos: Logo[]) => {
    const seen = new Set<string>();
    return logos.filter((l) =>
      seen.has(l.src) ? false : (seen.add(l.src), true),
    );
  }, []);

  const handleChange = useCallback((v: string) => setContent(v), []);

  const handleEditPartners = useCallback(async () => {
    const id = getEventEditionIdStorage();
    if (!Edicao || !id) return;
    await updateEdicao(id, { partnersText: content, name: Edicao.name });
  }, [Edicao, content, updateEdicao]);

  useEffect(() => {
    const incoming = Edicao?.partnersText ?? "";
    if (incoming !== content) setContent(incoming);
  }, [Edicao?.partnersText, content]);

  return (
<div className="realizacao">
  <div className="realizacao-container">
    <div className="realizacao-grupo">
      <h3 className="realizacao-titulo">Realização</h3>
      <div className="realizacao-parceiros">
        {uniqueBySrc(realizacaoLogos).map((logo) => (
          <Image
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            priority={logo.priority}
            className="realizacao-logo"
            sizes="(max-width: 768px) 100px, 150px"
            style={{ height: "auto"}}
          />
        ))}
      </div>
    </div>

    <div className="realizacao-grupo">
      <h3 className="realizacao-titulo">Apoio</h3>
      <div className="realizacao-parceiros">
        {uniqueBySrc(apoioLogos).map((logo) => (
          <Image
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            priority={logo.priority}
            className="realizacao-logo"
            sizes="(max-width: 768px) 100px, 150px"
          />
        ))}
      </div>

      <HtmlEditorComponent
        content={content}
        onChange={handleChange}
        handleEditField={handleEditPartners}
      />
    </div>
  </div>
</div>

  );
}
