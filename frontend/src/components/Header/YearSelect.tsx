"use client";
import { edicaoApi } from "@/services/edicao";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default async function YearSelect() {
	const router = useRouter();
	const { ano } = useParams();
	const { listEdicao } = edicaoApi;
	const edicoesList = await listEdicao();

	const yearsOptions = edicoesList?.map((ed) => {
		if (ed.startDate) {
			const fullYear = new Date(ed?.startDate).getFullYear();
			return {
				value: fullYear,
				label: `Edição ${fullYear}`,
				isActive: ed.isActive,
			};
		}
		return { value: "", label: "", isActive: false };
	});

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedYear = e.target.value;
		router.push(`/edicao/${selectedYear}`);
	};

	return (
		<select value={ano} onChange={handleChange} className='form-select'>
			{yearsOptions.map((ed) => (
				<option key={ed.id} value={ed.value}>
					{ed.label}
				</option>
			))}
		</select>
	);
}
