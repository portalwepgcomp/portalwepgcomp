import YearSelect from "@/components/Header/YearSelect";
import Image from "next/image";
import Link from "next/link";

export default async function HeaderRefactor() {
	const MenuItens = [
		{ name: "inicio", href: "", id: "inicio" },
		{ name: "programação", href: "#programacao", id: "Programacao" },
		{ name: "orientações", href: "#orientacao", id: "Orientacao" },
		{ name: "contato", href: "#contato", id: "Contato" },
		{ name: "login", href: "/login", id: "login" },
	];
	return (
		<header className='d-flex justify-content-between align-items-center px-3 py-2 border-bottom fixed-top bg-white'>
			<div className='d-flex align-items-center gap-3'>
				<Link className='' href='/'>
					<Image
						src={"/assets/images/logo_PGCOMP.svg"}
						alt='PGCOMP Logo'
						// className='navbar-image'
						width={300}
						height={100}
					/>
				</Link>
				<YearSelect />
			</div>
			<nav className=''>
				<ul className='flex gap-4 list-unstyled m-0 p-0 d-flex align-items-center'>
					{MenuItens.map((item) => (
						<li key={item.name}>
							<Link
								id={`menu-${item.id}`}
								href={item.href}
								// onClick={() => handleItemClick(item.name as MenuItem)}
							>
								{item.name}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</header>
	);
}
