import React from "react";
import PageHeader from "../../../components/common/PageHeader";
import PagosPensiones from "../../admin/finanzas/pensiones/PagosPensiones";

const PagosSecretaria = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Pagos" />
      <PagosPensiones />
    </div>
  );
};

export default PagosSecretaria;
