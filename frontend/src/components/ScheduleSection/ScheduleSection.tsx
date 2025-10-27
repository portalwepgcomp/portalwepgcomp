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

  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const openModal = useRef<HTMLButtonElement | null>(null);
  const [modalContent, setModalContent] = useState<Presentation>(
    {} as Presentation,
  );

  useEffect(() => {
    moment.locale("pt-br");
  }, []);

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

  useEffect(() => {
    const eventEditionId = getEventEditionIdStorage();
    if (eventEditionId && Edicao?.startDate && Edicao?.endDate) {
      listSessions(eventEditionId);
      const generatedDates = generateDatesBetween(
        Edicao.startDate,
        Edicao.endDate,
      );
      setDates(generatedDates);
      setSelectedDate(generatedDates[0]);
    }

    if (Edicao?.id) listRooms(Edicao?.id);
  }, [Edicao?.id, selectEdition]);

    return (
      <div id="Programacao">
        <div className="d-flex flex-column w-100 full-content">
          <h1 className="fw-bold text-center display-4 progamacao-title">
            Programação
          </h1>

          <div className="d-flex justify-content-center">
            <div className="programacao-dias" style={{ gap: 20, display: "flex" }}>
              {dates.map((date, index) => (
                <button
            key={index}
            className="date-button"
            style={{
              border: "none",
              borderRadius: 8,
              background: selectedDate === date ? "#FFA90F" : "#F7F7F7",
              color: selectedDate === date ? "#fff" : "#FFA90F",
              padding: "6px 16px",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: selectedDate === date ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "background 0.2s, color 0.2s",
              cursor: "pointer",
              outline: selectedDate === date ? "2px solid #FFA90F" : "none",
            }}
            onClick={() => changeDate(date)}
                >
            {moment(date).format("DD [de] MMMM")}
                </button>
              ))}
            </div>
          </div>

        {loadingRoomsList ? (
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
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );

        const groupedByTitle = filteredSessions
          ?.filter((sessao) => sessao.type !== "General")
          ?.reduce((acc, sessao) => {
            acc[sessao.title] = acc[sessao.title] || [];
            acc[sessao.title].push(sessao);
            return acc;
          }, {});

        return (
          <>
            {filteredSessions?.map((item, index) => {
              if (item.type === "General") {
                return (
                  <div key={index + item.id} className="session-row">
                    <span className="session-time">
                      {moment(item.startTime).format("HH:mm")}
                    </span>
                    <ScheduleCard
                      type="GeneralSession"
                      author={item?.speakerName ?? ""}
                      title={item?.title ?? ""}
                      onClickEvent={() => {}}
                      cardColor="#ffffff"
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
                            a.positionWithinBlock - b.positionWithinBlock
                        )
                        .map((pres) => (
                          <div
                            key={sessIndex + pres.id}
                            className="session-row"
                          >
                            <span className="session-time">
                              {moment(pres.startTime).format("HH:mm")}
                            </span>
                            <ScheduleCard
                              type="PresentationSession"
                              author={
                                pres?.submission?.mainAuthor?.name ?? ""
                              }
                              title={pres?.submission?.title ?? ""}
                              onClickEvent={() => openModalPresentation(pres)}
                              cardColor="#f5b301"
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
          sessao.roomId == room.id
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
