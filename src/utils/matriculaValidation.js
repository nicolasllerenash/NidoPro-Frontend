// src/utils/matriculaValidation.js

/**
 * Valida y limpia los datos de contactos de emergencia
 * @param {Array} contactos - Array de contactos de emergencia
 * @returns {Array} Contactos limpios y validados
 */
export const validateAndCleanContactos = (contactos) => {
  if (!Array.isArray(contactos)) {
    console.warn('⚠️ Contactos no es un array:', contactos);
    return [];
  }

  return contactos
    .map((contacto, index) => {
      const cleaned = {
        nombre: contacto.nombre?.trim() || '',
        apellido: contacto.apellido?.trim() || '',
        telefono: contacto.telefono?.trim() || '',
        email: contacto.email?.trim() || '',
        tipoContacto: contacto.tipoContacto?.trim() || '',
        esPrincipal: Boolean(contacto.esPrincipal),
        prioridad: parseInt(contacto.prioridad) || (index + 1)
      };

      // Validar campos requeridos
      const requiredFields = ['nombre', 'apellido', 'telefono', 'email'];
      const missingFields = requiredFields.filter(field => !cleaned[field]);
      
      if (missingFields.length > 0) {
        console.warn(`⚠️ Contacto ${index + 1} falta campos:`, missingFields);
        return null;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleaned.email)) {
        console.warn(`⚠️ Contacto ${index + 1} email inválido:`, cleaned.email);
        return null;
      }

      // Validar teléfono (básico)
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,15}$/;
      if (!phoneRegex.test(cleaned.telefono)) {
        console.warn(`⚠️ Contacto ${index + 1} teléfono inválido:`, cleaned.telefono);
        return null;
      }

      return cleaned;
    })
    .filter(contacto => contacto !== null); // Remover contactos inválidos
};

/**
 * Valida que haya al menos un contacto principal
 * @param {Array} contactos - Array de contactos validados
 * @returns {Array} Contactos con al menos uno principal
 */
export const ensurePrimaryContact = (contactos) => {
  if (!Array.isArray(contactos) || contactos.length === 0) {
    return contactos;
  }

  const hasPrimary = contactos.some(contacto => contacto.esPrincipal);
  
  if (!hasPrimary) {
    // Hacer principal al primer contacto
    contactos[0].esPrincipal = true;
  }

  return contactos;
};

/**
 * Valida la estructura completa de datos de matrícula
 * @param {Object} matriculaData - Datos de matrícula a validar
 * @returns {Object} Resultado de validación con errores si los hay
 */
export const validateMatriculaData = (matriculaData) => {
  const errors = [];

  // Validar datos básicos
  if (!matriculaData.costoMatricula || matriculaData.costoMatricula <= 0) {
    errors.push('El costo de matrícula debe ser mayor a 0');
  }

  if (!matriculaData.fechaIngreso) {
    errors.push('La fecha de ingreso es requerida');
  }

  if (!matriculaData.idGrado) {
    errors.push('El grado es requerido');
  }

  if (!matriculaData.metodoPago) {
    errors.push('El método de pago es requerido');
  }

  // Validar datos del estudiante
  if (!matriculaData.estudianteData) {
    errors.push('Los datos del estudiante son requeridos');
  } else {
    if (!matriculaData.estudianteData.nombre?.trim()) {
      errors.push('El nombre del estudiante es requerido');
    }
    if (!matriculaData.estudianteData.apellido?.trim()) {
      errors.push('El apellido del estudiante es requerido');
    }
    if (!matriculaData.estudianteData.nroDocumento?.trim()) {
      errors.push('El número de documento del estudiante es requerido');
    }
    if (!matriculaData.estudianteData.contactosEmergencia || 
        !Array.isArray(matriculaData.estudianteData.contactosEmergencia) ||
        matriculaData.estudianteData.contactosEmergencia.length === 0) {
      errors.push('Debe proporcionar al menos un contacto de emergencia');
    }
  }

  // Validar datos del apoderado
  if (!matriculaData.apoderadoData) {
    errors.push('Los datos del apoderado son requeridos');
  } else {
    if (!matriculaData.apoderadoData.nombre?.trim()) {
      errors.push('El nombre del apoderado es requerido');
    }
    if (!matriculaData.apoderadoData.apellido?.trim()) {
      errors.push('El apellido del apoderado es requerido');
    }
    if (!matriculaData.apoderadoData.documentoIdentidad?.trim()) {
      errors.push('El documento del apoderado es requerido');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Genera un resumen de los datos para debugging
 * @param {Object} matriculaData - Datos de matrícula
 * @returns {Object} Resumen para logs
 */
export const generateDataSummary = (matriculaData) => {
  return {
    costoMatricula: matriculaData.costoMatricula,
    fechaIngreso: matriculaData.fechaIngreso,
    metodoPago: matriculaData.metodoPago,
    estudiante: {
      nombre: matriculaData.estudianteData?.nombre,
      apellido: matriculaData.estudianteData?.apellido,
      documento: matriculaData.estudianteData?.nroDocumento,
      contactosCount: matriculaData.estudianteData?.contactosEmergencia?.length || 0
    },
    apoderado: {
      nombre: matriculaData.apoderadoData?.nombre,
      apellido: matriculaData.apoderadoData?.apellido,
      documento: matriculaData.apoderadoData?.documentoIdentidad
    },
    asignacionAula: {
      tipo: matriculaData.tipoAsignacionAula,
      aulaEspecifica: matriculaData.idAulaEspecifica || 'N/A'
    },
    voucher: !!matriculaData.voucherImg
  };
};
