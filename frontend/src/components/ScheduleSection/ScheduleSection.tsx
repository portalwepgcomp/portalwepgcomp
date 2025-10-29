"use client";

import React from "react";

import moment from "moment";
import "moment/locale/pt-br";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import PresentationModal from "../Modals/ModalApresentação/PresentationModal";
import ScheduleCard from "../ScheduleCard/ScheduleCard";
import Calendar from "../UI/calendar";
import Modal from "../UI/Modal/Modal";

import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { useEdicao } from "@/hooks/useEdicao";
import { useSession } from "@/hooks/useSession";

import { useActiveEdition } from "@/hooks/useActiveEdition";
import IndicadorDeCarregamento from "../IndicadorDeCarregamento/IndicadorDeCarregamento";
import "./style.scss";

export default function ScheduleSection() {
  const { listSessions, sessoesList, listRooms, roomsList, loadingRoomsList } =
    useSession();
  const { Edicao } = useEdicao();
  const { selectEdition } = useActiveEdition();
  const { ensureActiveEdition } = useActiveEdition();

  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const openModal = useRef<HTMLButtonElement | null>(null);
  const [modalContent, setModalContent] = useState<Presentation>(
    {} as Presentation,
  );

  useEffect(() => {
    moment.locale("pt-br");
  }, []);

  useEffect(() => {
    if (!Edicao?.id) {
      ensureActiveEdition?.();
    }
  }, [Edicao?.id, ensureActiveEdition]);

    useEffect(() => {
    const eventEditionId = getEventEditionIdStorage();
    console.log({eventEditionId, Edicao, selectEdition});
    if (Edicao?.id && Edicao?.startDate && Edicao?.endDate) {
      listSessions(Edicao?.id);
      const generatedDates = generateDatesBetween(
        Edicao.startDate,
        Edicao.endDate,
      );
      setDates(generatedDates);
      setSelectedDate(generatedDates[0]);
    }

    if (Edicao?.id) listRooms(Edicao?.id);
  }, [Edicao?.id, selectEdition]);

  function generateDatesBetween(startDate: string, endDate: string): string[] {
    const datesArray: string[] = [];
    const currentDate = moment(startDate);
    const finalDate = moment(endDate);

    while (currentDate.isSameOrBefore(finalDate)) {
      datesArray.push(currentDate.format("YYYY-MM-DD"));
      currentDate.add(1, "day");
    }
    return datesArray;
  }

  function changeDate(date: string) {
    setSelectedDate(date);
  }

  function openModalPresentation(item: Presentation) {
    setModalContent(item);
    openModal.current?.click();
  }

  const colorsSession = [
    "#F2CB05",
    "#03A61C",
    "#FF1A25",
    "#0066BA",
    "#FFA90F",
    "#008CD8",
  ];

  return (
    <div id="Programacao">
      <div className="d-flex flex-column w-100 full-content">
        <h1 className="fw-bold text-center display-4 progamacao-title">
          Programação
        </h1>

				<div className='d-flex justify-content-center'>
					<div className='programacao-dias'>
						{dates.map((date, index) => (
							<button
								key={index}
								className='d-flex align-items-center fw-bold flex-start date-button'
								style={{
									width: "auto",
									padding: "4px 10px",
									fontSize: "0.95rem",
									backgroundColor: selectedDate === date ? "#FFA90F" : "white",
									color: selectedDate === date ? "white" : "#FFA90F",
									minHeight: "32px",
								}}
								onClick={() => changeDate(date)}
							>
								<Calendar color={selectedDate === date ? "white" : "#FFA90F"} />
								<span style={{ marginLeft: 6 }}>{moment(date).format("DD [de] MMMM")}</span>
							</button>
						))}
					</div>
				</div>

        {loadingRoomsList ? (
          <IndicadorDeCarregamento />
        ) : (
          roomsList.map((room, roomIndex) => (
            <React.Fragment key={room.id || roomIndex}>
              <div className="programacao-sala" key={room.id || roomIndex}>
                <h3 className="fw-bold text-white m-0 text-center w-100 list-item">
                  {room.name}
                </h3>
                <h5 className="m-0 list-paragraph"></h5>
              </div>
              <div className="d-flex flex-column programacao-item">
                {sessoesList
                  ?.filter(
                    (sessao) =>
                      moment.utc(sessao.startTime).format("YYYY-MM-DD") ===
                      moment(selectedDate).format("YYYY-MM-DD"),
                  )
                  ?.toSorted(
                    (a, b) =>
                      new Date(a.startTime).getTime() -
                      new Date(b.startTime).getTime(),
                  )
                  ?.map((item, index) => {
                    if (item.type === "General") {
                      return (
                        <div
                          key={index + item.id}
                          className="d-flex align-items-center w-100 default-gap"
                        >
                          <h5 className="m-0 list-paragraph">
                            {moment(item.startTime).format("HH:mm")}
                          </h5>
                          <ScheduleCard
                            type="GeneralSession"
                            author={item?.speakerName ?? ""}
                            title={item?.title ?? ""}
                            onClickEvent={() => {}}
                            cardColor="white"
                          />
                          <div className="m-0 programacao-item-aux"></div>
                        </div>
                      );
                    }

                    if (room.id !== item.roomId) return null;
                    return item.presentations
                      ?.toSorted(
                        (a, b) => a.positionWithinBlock - b.positionWithinBlock,
                      )
                      .map((pres) => (
                        <div
                          key={index + pres.id}
                          className="d-flex align-items-center w-100 default-gap"
                        >
                          <h5 className="m-0 list-paragraph">
                            {moment(pres.startTime).format("HH:mm")}
                          </h5>
                          <ScheduleCard
                            type="PresentationSession"
                            author={pres?.submission?.mainAuthor?.name ?? ""}
                            title={pres?.submission?.title ?? ""}
                            onClickEvent={() => openModalPresentation(pres)}
                            cardColor={colorsSession[index]}
                          />
                          <div className="m-0 programacao-item-aux"></div>
                        </div>
                      ));
                  })}

                {!sessoesList?.some(
                  (sessao) =>
                    moment.utc(sessao.startTime).format("YYYY-MM-DD") ===
                      moment(selectedDate).format("YYYY-MM-DD") &&
                    sessao.roomId == room.id,
                ) && (
                  <div className="d-flex align-items-center justify-content-center p-3 mt-4 me-5">
                    <h4 className="empty-list mb-0">
                      <Image
                        src="/assets/images/empty_box.svg"
                        alt="Lista vazia"
                        width={90}
                        height={90}
                      />
                      Essa lista ainda está vazia
                    </h4>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))
        )}

        <Modal
          content={<PresentationModal props={modalContent} />}
          reference={openModal}
        />
      </div>
    </div>
  );
}
