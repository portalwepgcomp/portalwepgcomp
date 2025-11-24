"use client";

import React from "react";

import moment from "moment";
import "moment/locale/pt-br";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import PresentationModal from "../Modals/ModalApresentação/PresentationModal";
import Modal from "../UI/Modal/Modal";

import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { useEdicao } from "@/hooks/useEdicao";
import { useSession } from "@/hooks/useSession";

import { useActiveEdition } from "@/hooks/useActiveEdition";
import IndicadorDeCarregamento from "../IndicadorDeCarregamento/IndicadorDeCarregamento";
import PresentationCard from "../Presentation/PresentationCard/PresentationCard";
import "./style.scss";

export default function ScheduleSection() {
  const { listSessions, sessoesList, listRooms, roomsList, loadingRoomsList, loadingSessoesList } =
    useSession();
  const { Edicao } = useEdicao();
  const { selectEdition } = useActiveEdition();
  const { ensureActiveEdition } = useActiveEdition();

  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const openModal = useRef<HTMLButtonElement | null>(null);
  const [modalContent, setModalContent] = useState<Presentation>(
    {} as Presentation
  );

  const isLoading = loadingRoomsList || loadingSessoesList;

  useEffect(() => {
    moment.locale("pt-br");
  }, []);

  useEffect(() => {
    if (!Edicao?.id) {
      ensureActiveEdition?.();
    }
  }, [Edicao?.id, ensureActiveEdition]);

  useEffect(() => {
    if (Edicao?.id && Edicao?.startDate && Edicao?.endDate) {
      listSessions(Edicao?.id);

      const generatedDates = generateDatesBetween(
        Edicao.startDate,
        Edicao.endDate
      );

      setDates(generatedDates);

      const today = moment().format("YYYY-MM-DD");
      const todayInsideEvent = generatedDates.includes(today);

      setSelectedDate(todayInsideEvent ? today : generatedDates[0]);
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

  function corrigeData(data: string): { dia: number; mes: number; ano: number } {
    const arrayData = data.split("-");
    return {
      ano: parseInt(arrayData[0], 10),
      mes: parseInt(arrayData[1], 10) - 1,
      dia: parseInt(arrayData[2], 10),
    };
  }

  return (
    <div id="Programacao">
      <div className="schedule-page">

        <div className="schedule-header">
          <h1 className="schedule-title">Programação</h1>
        </div>

        <div className="schedule-dates">
          {dates.map((date, i) => (
            <button
              key={i}
              className={`date-button ${selectedDate === date ? "active" : ""}`}
              onClick={() => changeDate(date)}
            >
              <span className="date-label">
                {new Date(
                  corrigeData(date).ano,
                  corrigeData(date).mes,
                  corrigeData(date).dia
                ).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                })}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <IndicadorDeCarregamento />
        ) : (
          <div className="rooms-container">
            {roomsList.map((room, roomIndex) => (
              <React.Fragment key={room.id || roomIndex}>
                <div className="room-card">
                  <h3 className="room-name">{room.name}</h3>
                </div>

                <div className="session-list">
                  {(() => {
                    const filteredSessions = sessoesList
                      ?.filter(
                        (sessao) =>
                          moment.utc(sessao.startTime).format("YYYY-MM-DD") ===
                          moment(selectedDate).format("YYYY-MM-DD")
                      )
                      ?.filter(
                        (sessao) =>
                          sessao.type === "General" || sessao.roomId === room.id
                      )
                      ?.toSorted(
                        (a, b) =>
                          new Date(a.startTime).getTime() -
                          new Date(b.startTime).getTime()
                      );

                    const groupedByTitle = filteredSessions
                      ?.filter(
                        (sessao) =>
                          sessao.type !== "General" &&
                          sessao.title !== undefined
                      )
                      ?.reduce((acc, sessao) => {
                        if (sessao.title !== undefined) {
                          acc[sessao.title] = acc[sessao.title] || [];
                          acc[sessao.title].push(sessao);
                        }
                        return acc;
                      }, {} as Record<string, typeof filteredSessions[number]>);

                    return (
                      <>
                        {filteredSessions?.map((item, index) => {
                          if (item.type === "General") {
                            return (
                              <div
                                key={index + item.id}
                                className="session-row"
                              >
                                <PresentationCard
                                  type={"GeneralSession"}
                                  presentation={item as any}
                                />
                              </div>
                            );
                          }

                          if (
                            item.title &&
                            groupedByTitle[item.title] &&
                            groupedByTitle[item.title][0].id === item.id
                          ) {
                            const group = groupedByTitle[item.title];
                            return (
                              <div key={item.title} className="session-group">
                                <h2 className="session-title">{item.title}</h2>
                                {group.flatMap((sess, sessIndex) =>
                                  sess.presentations
                                    ?.toSorted(
                                      (a, b) =>
                                        a.positionWithinBlock -
                                        b.positionWithinBlock
                                    )
                                    .map((pres: Presentation) => (
                                      <div
                                        key={sessIndex + pres.id}
                                        className="session-row"
                                      >
                                        <PresentationCard
                                          presentation={pres}
                                          type="PresentationSession"
                                        />
                                      </div>
                                    ))
                                )}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </>
                    );
                  })()}

                  {!sessoesList?.some(
                    (sessao) =>
                      moment.utc(sessao.startTime).format("YYYY-MM-DD") ===
                        moment(selectedDate).format("YYYY-MM-DD") &&
                      sessao.roomId === room.id
                  ) && (
                    <div className="empty-state">
                      <Image
                        src="/assets/images/empty_box.svg"
                        alt="Lista vazia"
                        width={90}
                        height={90}
                      />
                      <p>Essa lista ainda está vazia</p>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        <Modal
          content={<PresentationModal props={modalContent} />}
          reference={openModal}
        />
      </div>
    </div>
  );
}
