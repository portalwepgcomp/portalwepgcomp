"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

import Banner from "@/components/UI/Banner";
import { FormCadastroProfessor } from "@/components/Forms/CadastroProfessor/FormCadastroProfessor";
import LoadingPage from "@/components/LoadingPage";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useUsers } from "@/hooks/useUsers";
import "./style.scss";

export default function CadastroProfessor() {
  const { user: currentUser, signed } = useContext(AuthContext);
  const { loadingCreateProfessor } = useUsers();
  const router = useRouter();

  useEffect(() => {
    if (!signed) {
      router.push("/login");
      return;
    }

    // Only superadmins can access this page
    if (currentUser?.level !== "Superadmin") {
      router.push("/home");
      return;
    }
  }, [signed, currentUser, router]);

  const handleSuccess = () => {
    // Optionally redirect to user management page after successful creation
    router.push("/gerenciamento");
  };

  // Show loading while checking authentication
  if (!signed || !currentUser) {
    return <LoadingPage />;
  }

  // Only show page to superadmins
  if (currentUser.level !== "Superadmin") {
    return <LoadingPage />;
  }

  return (
    <div className="cadastro-professor-page">
      {loadingCreateProfessor && <LoadingPage />}
      
      <div className="container">
        <Banner title="Cadastro de Professor" />
        
        <div className="page-content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-10">
                <div className="page-header text-center mb-4">
                  <h2 className="page-title">Cadastrar Novo Professor</h2>
                  <p className="page-subtitle">
                    Cadastre um novo professor no sistema. 
                    Uma senha temporária será gerada e enviada por email.
                  </p>
                </div>
                
                <FormCadastroProfessor onSuccess={handleSuccess} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}