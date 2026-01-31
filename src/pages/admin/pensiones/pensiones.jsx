import React from 'react';
import { usePensionesTabla } from '../../../hooks/usePensiones';
import TablaPensiones from './tabla/TablaPensiones';
import PageHeader from '../../../components/common/PageHeader';

const Pensiones = () => {
  const { data: pensiones = [], isLoading } = usePensionesTabla();

  return (
    <div className="space-y-6">
      <PageHeader title="Pensiones" />

      <TablaPensiones
        pensiones={pensiones}
        loading={isLoading}
      />
    </div>
  );
};

export default Pensiones;
