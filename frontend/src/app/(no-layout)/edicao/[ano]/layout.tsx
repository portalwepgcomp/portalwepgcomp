import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/HeaderRefactor";
import { AuthProvider } from "@/context/AuthProvider/authProvider";

export default function NoLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<body>
				<AuthProvider>
					<div className='d-flex flex-column min-vh-100'>
						<Header />
						{children}
						<Footer />
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
