"use client";

import { useEffect, useMemo } from "react";
import { useCommittee } from "@/hooks/useCommittee";
import { useEdicao } from "@/hooks/useEdicao";
import "./style.scss";

/* interface OrganizacaoProps {
    coordenador: string,
    comissao: string[],
    ti: string[],
    comunicaco: string[],
    administracao: string[]
} */

export default function Organizacao(/*{props} : {props: OrganizacaoProps}*/) {
    const { getCommitterAll, committerList } = useCommittee();

    const { Edicao } = useEdicao();

    useEffect(() => {
        if (Edicao?.id) {
            getCommitterAll(Edicao.id);
        }
    }, [Edicao?.id]);

    const coordenador = useMemo(() => {
        const coord = committerList.find(
            (member) =>
                member.level === "Coordinator" &&
                member.role === "OrganizingCommittee"
        );
        return coord ? coord.userName : " ";
    }, [committerList]);

    const groupedMembers = useMemo(() => {
        const groups: Record<string, string[]> = {
            comissao: [],
        };

        if (committerList.length === 0) return groups;

        committerList.forEach((member) => {
            // Exclui coordenador da lista de 'comissao'
            if (member.level === "Coordinator") return;

            switch (member.role) {
                case "OrganizingCommittee":
                    groups.comissao.push(member.userName);
                    break;
                default:
                    break;
            }
        });

        return groups;
    }, [committerList]);

    function formatTeam(team: string[]) {
        if (!Array.isArray(team)) {
            return "";
        }

        let stringTeam = "";
        if (team.length > 0) {
            team.forEach((item) => {
                stringTeam += item + ",";
            });
            stringTeam = stringTeam.slice(0, -1);
        } else {
            return "";
        }
        return team
            .slice()
            .sort((a, b) => a.localeCompare(b))
            .join(", ");
    }

    return (
        <section
            style={{
                width: "100%",
                margin: "0 auto",
                backgroundColor: "#F17F0C",
            }}>
            <div
                style={{
                    width: "90%",
                    margin: "0 auto",
                    color: "black",
                    padding: "30px 0px",
                }}>
                <h1
                    style={{
                        fontSize: "50px",
                        fontWeight: "700",
                        lineHeight: "80px",
                        textAlign: "center",
                        color: "black",
                    }}>
                    Organização
                </h1>
                <div
                    style={{
                        fontSize: "20px",
                        fontWeight: "400",
                        lineHeight: "30px",
                        textAlign: "left",
                    }}>
                    <p>
                        <span style={{ fontWeight: "700", color: "white" }}>
                            Coordenação geral:
                        </span>{" "}
                        {coordenador}
                    </p>
                    <p>
                        <span style={{ fontWeight: "700", color: "white" }}>
                            Comissão organizadora:
                        </span>{" "}
                        {formatTeam(groupedMembers.comissao)}
                    </p>
                </div>
            </div>
        </section>
    );
}
