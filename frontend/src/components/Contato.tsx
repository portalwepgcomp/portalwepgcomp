"use client";

import { FormContato } from "./Forms/Contato/FormContato";

export default function Contato() {
  return (
    <div className="d-flex flex-column align-items-start containerContato">
      <div className="w-100">
        <div className="fs-1 fw-bold text-white mb-3">Contato</div>
        <FormContato />
      </div>
    </div>
  );
}
