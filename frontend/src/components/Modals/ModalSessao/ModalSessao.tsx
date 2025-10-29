"use client";

import { useEffect, useState, useMemo } from "react";
import "./style.scss";
import { ModalSessaoMock } from "@/mocks/ModalSessoes";
import { SessaoTipoEnum } from "@/enums/session";
import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import FormSessaoApresentacoes from "@/components/Forms/Sessao/FormSessaoApresentacoes";
import FormSessaoGeral from "@/components/Forms/Sessao/FormSessaoGeral";
import { useSession } from "@/hooks/useSession";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { useEdicao } from "@/hooks/useEdicao";

export default function ModalSessao() {
  const { tipo, titulo } = ModalSessaoMock;
  const { sessao, listRooms, sessoesList } = useSession();
  const { Edicao } = useEdicao();

  const disabledIntervals = useMemo(() => {
    if (!sessoesList) return [];
    const otherSessions = sessoesList.filter((s) => s.id !== sessao?.id);

    return otherSessions.map((s) => {
      const start = new Date(s.startTime);
      const end = new Date(start.getTime() + (s.duration ?? 0) * 60000);
      return { start, end };
    });
  }, [sessoesList, sessao?.id]);

  const [tipoSessao, setTipoSessao] = useState<SessaoTipoEnum>(
    sessao?.type === SessaoTipoEnum["Sessão de apresentações"]
      ? SessaoTipoEnum["Sessão de apresentações"]
      : SessaoTipoEnum["Sessão auxiliar do evento"],
  );

  useEffect(() => {
    if (sessao?.type) {
      setTipoSessao(
        (sessao?.type ||
          SessaoTipoEnum["Sessão auxiliar do evento"]) as SessaoTipoEnum,
      );
    }
  }, [sessao?.type]);

  useEffect(() => {
    if (Edicao?.id) {
      listRooms(Edicao.id);
    }
  }, [Edicao?.id]);

  return (
    <ModalComponent
      id="sessaoModal"
      idCloseModal="sessaoModalClose"
      loading={false}
    >
      <div className="modal-sessao">
        <h3 className="mb-4 fw-bold">
          {sessao?.id ? titulo.edicao : titulo.cadastro}
        </h3>

        <div className="col-12 mb-1">
          <label className="form-label fw-bold form-title tipo-sessao">
            {tipo.label}
          </label>
          <div className="d-flex">
            {tipo.options?.map((op, i) => (
              <div className="form-check me-3" key={`radio${op.value}-${i}`}>
                <input
                  type="radio"
                  className="form-check-input"
                  id={`sessao-tipo-radio-${i}`}
                  value={op.value}
                  name="radioTipoSessao"
                  checked={sessao?.id ? sessao.type === op.value : undefined}
                  defaultChecked={
                    op.value === SessaoTipoEnum["Sessão auxiliar do evento"]
                  }
                  disabled={!!sessao?.id}
                  onChange={() => setTipoSessao(op.value as SessaoTipoEnum)}
                />
                <label
                  className="form-check-label fw-bold input-title"
                  htmlFor={`radio${op}-${i}`}
                >
                  {op.label}
                </label>
              </div>
            ))}
          </div>
          <p className="text-danger error-message"></p>
        </div>

        {tipoSessao === SessaoTipoEnum["Sessão auxiliar do evento"] ? (
          <FormSessaoGeral disabledIntervals={disabledIntervals} />
        ) : (
          <FormSessaoApresentacoes disabledIntervals={disabledIntervals} />
        )}
      </div>
    </ModalComponent>
  );
}
