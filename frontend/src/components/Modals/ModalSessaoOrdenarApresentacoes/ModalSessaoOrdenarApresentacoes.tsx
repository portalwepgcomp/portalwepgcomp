"use client";

import "./style.scss";
import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from 'react';
import DraggableList, { DraggedMovement } from '@/components/DraggableList/DraggableList';
import { getEventEditionIdStorage } from '@/context/AuthProvider/util';
import { useEdicao } from '@/hooks/useEdicao';

export default function ModalSessaoOrdenarApresentacoes() {
  const { swapPresentationsOnSession, sessao } = useSession();
  const { Edicao } = useEdicao();
  const [listaOrdenada, setListaOrdenada] = useState<any[]>([]);

  useEffect(() => {
    const listaOrdenadaSessao =
      sessao?.presentations
        ?.toSorted((a, b) => a.positionWithinBlock - b.positionWithinBlock)
        .map(p => p.submission) || [];
    setListaOrdenada(listaOrdenadaSessao);
  }, [sessao]);

  const getPresentationId = (id): string => sessao?.presentations?.find(p => p.submissionId == id)?.id || "";

  const handleOnChangeOrder = async (data: any[], draggedMovement: DraggedMovement[]) => {
    if (!sessao?.id || !Edicao?.id) return;

    const swapPresentationBodies = draggedMovement
      .map(movement => ({
        presentation1Id: getPresentationId(movement.fromId),
        presentation2Id: getPresentationId(movement.toId)
      } as SwapPresentationsOnSession))
      .filter(x => x.presentation1Id && x.presentation2Id);

    if (swapPresentationBodies.length === 0) return;

    await swapPresentationsOnSession(
      sessao.id,
      Edicao.id,
      swapPresentationBodies
    );

    setListaOrdenada(data);
  }

  return (
    <ModalComponent
      id={"trocarOrdemApresentacao"}
      loading={false}
      labelConfirmButton="Confirmar"
      idCloseModal="trocarOrdemApresentacaoClose"
    >
      <div className="m-4 mt-0">
        <h3 className="mb-4 fw-bold">Mudar ordenação das apresentações</h3>

        <div className="mt-4 mb-4">
          <p className="form-label fw-bold form-title">Arraste os itens para alterar a ordenação</p>
          <DraggableList 
            list={listaOrdenada}
            labelTitle="title"
            labelSubtitle="abstract"
            componentParentId="trocarOrdemApresentacao"
            onChangeOrder={handleOnChangeOrder}
            />
        </div>
      </div>
    </ModalComponent>
  );
}
