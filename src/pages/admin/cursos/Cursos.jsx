import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PageHeader from '../../../components/common/PageHeader';

// Importar componentes de modales y tablas
import ModalAgregarCurso from './modales/ModalAgregarCurso';
import ModalEditarCurso from './modales/ModalEditarCurso';
import ModalEliminarCurso from './modales/ModalEliminarCurso';
import ModalVerCurso from './modales/ModalVerCurso';
import TablaCursos from './tablas/TablaCursos';

// Importar servicios
import { cursoService } from '../../../services/cursoService';

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para modales
  const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [modalVerOpen, setModalVerOpen] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  // Cargar cursos al montar el componente
  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      setLoading(true);

      const response = await cursoService.getAll();

      setCursos(response?.info?.data || []);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      toast.error('Error al cargar los cursos');
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar modales
  const handleAgregarCurso = () => {
    setModalAgregarOpen(true);
  };

  const handleEditarCurso = (curso) => {
    setCursoSeleccionado(curso);
    setModalEditarOpen(true);
  };

  const handleEliminarCurso = (curso) => {
    setCursoSeleccionado(curso);
    setModalEliminarOpen(true);
  };

  const handleVerCurso = (curso) => {
    setCursoSeleccionado(curso);
    setModalVerOpen(true);
  };

  const handleCloseModals = () => {
    setModalAgregarOpen(false);
    setModalEditarOpen(false);
    setModalEliminarOpen(false);
    setModalVerOpen(false);
    setCursoSeleccionado(null);
  };

  // Funciones para guardar cambios
  const handleSaveCurso = async (cursoData) => {
    try {

      if (cursoSeleccionado) {
        // Actualizar curso existente
        await cursoService.update(cursoSeleccionado.idCurso, cursoData);
        toast.success('Curso actualizado exitosamente');
      } else {
        // Crear nuevo curso
        await cursoService.create(cursoData);
        toast.success('Curso creado exitosamente');
      }

      // Recargar lista de cursos
      await cargarCursos();
      handleCloseModals();
    } catch (error) {
      console.error('Error al guardar el curso:', error);
      toast.error('Error al guardar el curso');
    }
  };

  const handleDeleteCurso = async () => {
    try {

      await cursoService.delete(cursoSeleccionado.idCurso);
      toast.success('Curso eliminado exitosamente');

      // Recargar lista de cursos
      await cargarCursos();
      handleCloseModals();
    } catch (error) {
      console.error('Error al eliminar el curso:', error);
      toast.error('Error al eliminar el curso');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Cursos" />

      {/* Componente de Tabla de Cursos */}
      <TablaCursos
        cursos={cursos}
        loading={loading}
        onAdd={handleAgregarCurso}
        onEdit={handleEditarCurso}
      />

      {/* Modales */}
      <ModalAgregarCurso
        isOpen={modalAgregarOpen}
        onClose={handleCloseModals}
        onSave={handleSaveCurso}
      />

      <ModalEditarCurso
        isOpen={modalEditarOpen}
        onClose={handleCloseModals}
        onSave={handleSaveCurso}
        curso={cursoSeleccionado}
      />

      <ModalEliminarCurso
        isOpen={modalEliminarOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteCurso}
        curso={cursoSeleccionado}
      />

      <ModalVerCurso
        isOpen={modalVerOpen}
        onClose={handleCloseModals}
        curso={cursoSeleccionado}
      />
    </div>
  );
};

export default Cursos;




