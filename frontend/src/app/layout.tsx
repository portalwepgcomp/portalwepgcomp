import BootstrapClient from "@/components/BootstrapClient";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Providers from "@/context";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import "./globals.css";
import "../styles/global.scss"
import { AuthProvider } from "@/context/AuthProvider/authProvider";
import { TokenValidationWrapper } from "@/components/TokenValidationWrapper";

export const metadata: Metadata = {
  title: "WEPGCOMP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          <Providers>
            <TokenValidationWrapper>
              <div className="d-flex flex-column vh-100">
                <Header />
                <main className="main-content">
                  {children}
                </main>
                <Footer />
              </div>
            </TokenValidationWrapper>
          </Providers>
        </AuthProvider>
      </body>
      <BootstrapClient />
    </html>
  );
}
