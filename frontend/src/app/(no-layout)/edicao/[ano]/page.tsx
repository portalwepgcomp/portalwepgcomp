import { edicaoApi } from "@/services/edicao";

interface DataType {
	id: number;
	name: string;
	// Add more fields as needed
}

export default async function EdicaoAnoPage({
	params,
}: {
	params: { ano: string };
}) {
	const { getEdicaoByYear } = edicaoApi;
	const edicaoData: DataType = await getEdicaoByYear(params.ano);
	return (
		<div className='d-flex flex-column'>
			<p>Edição: {params.ano}</p>
		</div>
	);
}
