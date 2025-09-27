"use client";

import { FormCadastro } from "@/components/Forms/Cadastro/FormCadastro";
import LoadingPage from "@/components/LoadingPage";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useEdicao } from "@/hooks/useEdicao";
import { useUsers } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import "./style.scss";

export default function Cadastro() {
  const { loadingCreateUser } = useUsers();
  const { signed } = useContext(AuthContext);
  const { Edicao } = useEdicao();

  const router = useRouter();

  useEffect(() => {
    if (signed) {
      router.push("/home");
    }
  }, [signed, router]);

  return (
    <div className='container d-flex flex-column flex-grow-1 text-black cadastro position-relative'>
      {loadingCreateUser && <LoadingPage />}
      <div className='container'>
        <hr />
        <h2 className='d-flex justify-content-center mb-4 fw-bold text-black'>
          {!loadingCreateUser && "Cadastro"}
        </h2>
      </div>
      <div className='container d-flex justify-content-center mb-5'>
        {!loadingCreateUser && <FormCadastro loadingCreateUser={loadingCreateUser} />}
      </div>
    </div>
  );
}