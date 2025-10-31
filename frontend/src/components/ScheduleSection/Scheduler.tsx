// import { useEffect, useState } from "react";

// import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
// import { useActiveEdition } from "@/hooks/useActiveEdition";
// import { useEdicao } from "@/hooks/useEdicao";
// import { useSession } from "@/hooks/useSession";
// import moment from "moment";
// import PresentationCard from "../Presentation/PresentationCard/PresentationCard";
// import "./Scheduler.scss";

// export default function Schedule() {
//     const [dates, setDates] = useState<string[]>([]);
//     const { listSessions, sessoesList, listRooms, roomsList, loadingRoomsList } =
//         useSession();
//     const { Edicao } = useEdicao();
//     const { selectEdition } = useActiveEdition();


//     const [selectedDate, setSelectedDate] = useState<string>("");

//     useEffect(() => {
//         const eventEditionId = getEventEditionIdStorage();
//         if (eventEditionId && Edicao?.startDate && Edicao?.endDate) {
//             listSessions(eventEditionId);
//             const generatedDates = generateDatesBetween(
//                 Edicao.startDate,
//                 Edicao.endDate,
//             );
//             setDates(generatedDates);
//             setSelectedDate(generatedDates[0]);
//         }

//         if (Edicao?.id) listRooms(Edicao?.id);
//     }, [Edicao?.id, selectEdition]);

//     function changeDate(date: string) {
//         setSelectedDate(date);
//     }

//     function generateDatesBetween(startDate: string, endDate: string): string[] {
//         const datesArray: string[] = [];
//         const currentDate = moment(startDate);
//         const finalDate = moment(endDate);

//         while (currentDate.isSameOrBefore(finalDate)) {
//             datesArray.push(currentDate.format("YYYY-MM-DD"));
//             currentDate.add(1, "day");
//         }
//         return datesArray;
//     }

//     return (
//         <div className="schedule-page">
//             <div className="schedule-header">
//                 <h1 className="schedule-title">Programação</h1>
//             </div>

//             <div className="schedule-dates">
//                 {dates.map((date, i) => (
//                     <button
//                         key={i}
//                         className={`date-button ${selectedDate === date ? "active" : ""}`}
//                         onClick={() => changeDate(date)}
//                     >
//                         <span className="date-label">
//                             {new Date(date.split('/').reverse().join('-')).toLocaleDateString('pt-BR', {
//                                 day: '2-digit',
//                                 month: 'long'
//                             })}
//                         </span>
//                     </button>
//                 ))}
//             </div>

//             <div className="schedule-content">
//                 {roomsList.map((room, roomIndex) => (
//                     <div key={room.id} className="session-block">
//                         <div className="session-header">
//                             <h2 className="session-room">{room.name}</h2>
//                         </div>

//                         <div className="session-presentations">
//                             <div className="session-label">{room.name}</div>
//                             {sessoesList.map(presentation => (
//                                 <PresentationCard
//                                     key={presentation.id}
                                    
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
