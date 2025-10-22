"use client";
import "./Carousel.scss";

import { useAuth } from "@/hooks/useAuth";
import { useEdicao } from "@/hooks/useEdicao";
import { formatDateEvent, formatDateUniq } from "@/utils/formatDate";
import Link from "next/link";
import CarouselSlide from "./CarouselSlide";

export default function Carousel() {
	const { Edicao } = useEdicao();
	const { signed } = useAuth();

	return (
		<div
			id='carousel-wepgcomp'
			className='carousel slide carousel-fade carousel-component'
			data-bs-ride='carousel'
			data-bs-interval='6000'
		>
			<div className='carousel-inner'>
				<CarouselSlide
					imageUrl="/assets/images/slide1.png"
					slideIndex='0'
					isActive
				>
					<h2 className='display-4 text-white title'>
						{Edicao?.name || "Carregando..."}
					</h2>
					<p className='lead'>{Edicao?.description || "Carregando..."}</p>

					<p className='lead fw-semibold'>
						{Edicao?.startDate
							? formatDateEvent(Edicao?.startDate, Edicao?.endDate)
							: "Carregando..."}
					</p>

					<Link
						className='btn btn-outline-light mt-3 px-4 py-2 schedule-button fs-4'
						href='#Programacao'
					>
						Confira a programação
					</Link>
				</CarouselSlide>

				<CarouselSlide imageUrl="/assets/images/slide2.png" slideIndex='1'>
					<h2 className='display-4 title'>SOBRE</h2>
					<div className='slide-2-content'>
						<div className='concept-content'>
							<p className='lead concept-subtitle fw-semibold'>
								CONCEITO
							</p>
							<p className='lead five-subtitle '>
								5
							</p>
							<p className='lead fs-2 capes-subtitle fw-semibold'>
								CAPS
							</p>
						</div>
						<div className='info-subtitles'>
							<p className='lead'>
								Workshop de Estudantes da Pós-Graduação em Ciência da Computação (WEPGCOMP) da Universidade Federal da Bahia (UFBA).
								O objetivo do evento é apresentar as pesquisas em andamento realizadas pelos alunos de doutorado (a partir do segundo ano),
								bem como propiciar um ambiente de troca de conhecimento e integração entre a comunidade.
							</p>
						</div>
					</div>
				</CarouselSlide>

				<CarouselSlide imageUrl= "/assets/images/slide3.png" slideIndex='2'>
					<h2 className='display-4 title'>DATAS IMPORTANTES</h2>
					<p className='lead'>
						Inscrições: até {formatDateUniq(Edicao?.startDate)}
					</p>
					<p className='lead'>
						Data do evento:{" "}
						{formatDateEvent(Edicao?.startDate, Edicao?.endDate)}
					</p>
					<p className='lead'>
						Data limite para submissão:{" "}
						{formatDateUniq(Edicao?.submissionDeadline)}
					</p>

					{signed ? (
						""
					) : (
						<Link
							className='btn btn-outline-light mt-3 px-4 py-2 schedule-button'
							href='/cadastro'
						>
							INSCREVA-SE JÁ!
						</Link>
					)}
				</CarouselSlide>
			</div>
		</div>
	);
}
