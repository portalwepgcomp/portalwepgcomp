"use client";
import { useEdicao } from "@/hooks/useEdicao";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";

import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import "./style.scss";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

function MapPlaceholder() {
  return <p>Instituto de Computação da UFBA - PAF 2</p>;
}

export default function Endereco() {
  const [content, setContent] = useState("");

  const { updateEdicao, Edicao } = useEdicao();

  const handleEditAdress = () => {
    const eventEditionId = getEventEditionIdStorage();

    if (Edicao) {
      updateEdicao(eventEditionId ?? "", {
        location: content,
        name: Edicao.name
      });
    }
  };

  const latitude = -13.002843214882326;
  const longitude = -38.50717484672244;

  useEffect(() => {
    setContent(Edicao?.location ?? "");
  }, [Edicao?.location]);

  return (
    <div className="container endereco-home">
      <div className="fs-1 fw-bold">Local do Evento</div>

      <HtmlEditorComponent
        content={content}
        onChange={(newValue) => setContent(newValue)}
        handleEditField={handleEditAdress}
      />

      <div>
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          placeholder={<MapPlaceholder />}
          className="map-home"
          scrollWheelZoom={false}
        >
          <Marker position={[latitude,longitude]}>
            <Popup>
              Entrada da UFBA
            </Popup>
          </Marker>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    </div>
  );
}
