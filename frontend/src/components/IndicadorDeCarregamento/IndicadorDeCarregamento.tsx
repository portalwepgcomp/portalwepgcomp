"use client"

import "./style.scss";

export default function IndicadorDeCarregamento() {
    return (
        <div className="isLoading">
          <div className="spinner-border " role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
    );
}