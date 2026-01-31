import React from 'react';
import { useGradosTabla } from '../../../hooks/useGrados';
import TablaGrados from './tabla/TablaGrados';
import PageHeader from '../../../components/common/PageHeader';

const Aulas = () => {
  const { data = [], isLoading } = useGradosTabla();
  const grados = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Grados" />

      <TablaGrados
        grados={grados}
        loading={isLoading}
      />
    </div>
  );
};

export default Aulas;
