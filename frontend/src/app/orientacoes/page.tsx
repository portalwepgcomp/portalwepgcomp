"use client";

import OrientacoesAudiencia from "@/components/Orientacoes/OrientacoesAudiencia";
import OrientacoesAutores from "@/components/Orientacoes/OrientacoesAutores";
import OrientacoesAvaliadores from "@/components/Orientacoes/OrientacoesAvaliadores";
import Banner from "@/components/UI/Banner";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { useOrientacao } from "@/hooks/useOrientacao";
import { useContext, useEffect, useState } from "react";
import "./style.scss";

export default function Orientacoes() {
    const [setion, setSetion] = useState<number>(0);
    const { user } = useContext(AuthContext);

    const isAdm = user?.level === "Superadmin";

    const { postOrientacao, getOrientacoes, orientacoes } =
        useOrientacao();

    useEffect(() => {
        getOrientacoes();
    }, []);

    useEffect(() => {
        if(orientacoes === undefined){
            const eventEditionId = getEventEditionIdStorage();
            postOrientacao({
                eventEditionId: eventEditionId ?? "",
                summary: "Sumário criado",
            });
        }
    }, [orientacoes])

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "50px",
            }}>
            <Banner title="Orientações" />
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
                        {setion == 0 ? <OrientacoesAutores /> : ""}
                        {setion == 1 ? <OrientacoesAvaliadores /> : ""}
                        {setion == 2 ? <OrientacoesAudiencia /> : ""}
                    </>
                </>
        </div>
    );
}
