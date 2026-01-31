import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import { useGrados } from '../../../hooks/useGrados';
import { useCursosGradoPorGrado } from '../../../hooks/queries/useCursoGradoQueries';
import TablaCursosGrado from './tablas/TablaCursosGrado';
import ModalAgregarCursoGrado from './modales/ModalAgregarCursoGrado';
import ModalEliminarCursoGrado from './modales/ModalEliminarCursoGrado';

const CursosGradoDetalle = () => {
  const { idGrado } = useParams();
  const navigate = useNavigate();
  const { grados = [], isLoading: loadingGrados } = useGrados();
  const {
    data: cursosGradoData = [],
    isLoading: loadingCursosGrado,
    refetch: refreshCursosGrado
  } = useCursosGradoPorGrado(idGrado);

  const cursosGrado = Array.isArray(cursosGradoData)
    ? cursosGradoData
    : cursosGradoData?.data || cursosGradoData?.cursosGrado || [];

  const gradoActual = useMemo(
    () => grados.find((grado) => (grado.idGrado || grado.id) === idGrado),
    [grados, idGrado]
  );

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCursoGrado, setSelectedCursoGrado] = useState(null);

  const handleAdd = () => {
    setShowModal(true);
  };


  const handleDelete = (cursoGrado) => {
    setSelectedCursoGrado(cursoGrado);
    setShowDeleteModal(true);
  };

  const title = gradoActual?.grado || gradoActual?.nombre || 'Grado';

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Cursos - ${title}`}
        actions={
          <button
            onClick={() => navigate('/admin/cursos-grado')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Volver
          </button>
        }
      />

      <TablaCursosGrado
        cursosGrado={cursosGrado}
        loading={loadingCursosGrado || loadingGrados}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />

      <ModalAgregarCursoGrado
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          refreshCursosGrado();
        }}
        defaultGradoId={idGrado}
      />

      <ModalEliminarCursoGrado
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCursoGrado(null);
        }}
        onSuccess={() => {
          setShowDeleteModal(false);
          setSelectedCursoGrado(null);
          refreshCursosGrado();
        }}
        cursoGrado={selectedCursoGrado}
      />
    </div>
  );
};

export default CursosGradoDetalle;
