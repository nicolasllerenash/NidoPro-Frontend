import React from "react";
import PageHeader from "../../components/common/PageHeader";

const SecretaryOverview = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Panel Principal" />
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-sm text-gray-500">
        Bienvenido. Desde aquí podrás acceder a reportes.
      </div>
    </div>
  );
};

export default SecretaryOverview;
