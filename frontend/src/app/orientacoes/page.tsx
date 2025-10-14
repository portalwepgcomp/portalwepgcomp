"use client";

import OrientacoesAudiencia from "@/components/Orientacoes/OrientacoesAudiencia";
import OrientacoesAutores from "@/components/Orientacoes/OrientacoesAutores";
import OrientacoesAvaliadores from "@/components/Orientacoes/OrientacoesAvaliadores";
import Banner from "@/components/UI/Banner";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import "./style.scss";
import { useOrientacao } from "@/hooks/useOrientacao";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import HtmlEditorComponent from "@/components/HtmlEditorComponent/HtmlEditorComponent";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";

export default function Orientacoes() {
    const [setion, setSetion] = useState<number>(0);
    const { user } = useContext(AuthContext);

    const isAdm = user?.level === "Superadmin";

    const { postOrientacao, putOrientacao, getOrientacoes, orientacoes } =
        useOrientacao();

    useEffect(() => {
        getOrientacoes();
    }, []);

    const [content, setContent] = useState(orientacoes?.summary || "");

    const handleEditOrientacao = () => {
        const idOrientacao = orientacoes?.id;
        const eventEditionId = getEventEditionIdStorage();

        if (idOrientacao) {
            putOrientacao(idOrientacao, {
                eventEditionId: eventEditionId ?? "",
                summary: content,
            });
        } else {
            postOrientacao({
                eventEditionId: eventEditionId ?? "",
                summary: content,
            });
        }
    };

    useEffect(() => {
        getOrientacoes();
    }, []);

    useEffect(() => {
        setContent(orientacoes?.summary || "");
    }, [orientacoes?.summary]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "50px",
            }}>
            <Banner title="Orientações" />
            {!orientacoes?.id ? (
                <div className="buttonWrapper">
                    <h4 className="orientationTitle">
                        Cadastre a primeira orientação abaixo clicando no botão
                        abaixo.
                    </h4>
                    <HtmlEditorComponent
                        content={content}
                        onChange={(newValue) => setContent(newValue)}
                        handleEditField={handleEditOrientacao}
                    />
                </div>
            ) : (
                <>
                    <div className="button">
                        <div
                            className={
                                setion == 0 ? "buttonTrue" : "buttonFalse"
                            }
                            onClick={() => setSetion(0)}>
                            Autores
                        </div>
                        <div
                            className={
                                setion == 1 ? "buttonTrue" : "buttonFalse"
                            }
                            onClick={() => setSetion(1)}>
                            Avaliadores
                        </div>
                        <div
                            className={
                                setion == 2 ? "buttonTrue" : "buttonFalse"
                            }
                            onClick={() => setSetion(2)}>
                            Audiência
                        </div>
                    </div>
                    <>
                        <div className="orientacoes">
                            <HtmlEditorComponent
                                content={content}
                                onChange={(newValue) => setContent(newValue)}
                                handleEditField={handleEditOrientacao}
                            />
                        </div>
                        {setion == 0 ? <OrientacoesAutores /> : ""}
                        {setion == 1 ? <OrientacoesAvaliadores /> : ""}
                        {setion == 2 ? <OrientacoesAudiencia /> : ""}
                    </>
                </>
            )}
        </div>
    );
}
