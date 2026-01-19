// src/services/storageService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nidopro.up.railway.app/api/v1';
const STORAGE_URL = `${API_BASE_URL}/storage`;

const api = axios.create({
  baseURL: STORAGE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Servicio para manejar la subida y gestión de archivos con Google Cloud Storage
 */
export class StorageService {
  /**
   * Sube un archivo a Google Cloud Storage
   * @param {File} file - El archivo a subir
   * @param {string} folder - La carpeta donde se guardará el archivo (ej: 'tareas', 'planificaciones')
   * @param {string} userId - ID del usuario para organizar los archivos (opcional)
   * @returns {Promise<Object>} - Información del archivo subido
   */
  static async uploadFile(file, folder = 'uploads', userId = 'anonymous') {
    try {
      // Si userId es null, undefined o vacío, usar 'anonymous'
      const safeUserId = userId && userId.trim() ? userId : 'anonymous';
      
      console.log('📤 Iniciando subida a Google Cloud Storage:', {
        originalName: file.name,
        folder: folder,
        userId: safeUserId,
        size: file.size,
        type: file.type
      });

      // Crear FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      if (safeUserId !== 'anonymous') {
        formData.append('userId', safeUserId);
      }

      // Subir el archivo
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Archivo subido exitosamente:', response.data);

      // Extraer datos de la respuesta del backend
      const fileData = response.data?.data || response.data;

      return {
        url: fileData.url || fileData.publicUrl,
        path: fileData.path || fileData.filePath,
        originalName: file.name,
        fileName: fileData.fileName || fileData.name,
        size: file.size,
        type: file.type,
        bucket: fileData.bucket
      };

    } catch (error) {
      console.error('❌ Error al subir archivo:', error);
      throw new Error(error.response?.data?.message || `Error al subir el archivo: ${error.message}`);
    }
  }

  /**
   * Sube múltiples archivos a Google Cloud Storage
   * @param {FileList|Array} files - Los archivos a subir
   * @param {string} folder - La carpeta donde se guardarán los archivos
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} - Array con la información de los archivos subidos
   */
  static async uploadMultipleFiles(files, folder = 'uploads', userId = 'anonymous') {
    try {
      const safeUserId = userId && userId.trim() ? userId : 'anonymous';

      console.log(`📤 Subiendo ${files.length} archivos a Google Cloud Storage...`);

      // Crear FormData con múltiples archivos
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      formData.append('folder', folder);
      if (safeUserId !== 'anonymous') {
        formData.append('userId', safeUserId);
      }

      const response = await api.post('/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(`✅ ${files.length} archivos subidos exitosamente`);

      const filesData = response.data?.data || response.data;

      return filesData.map((fileData, index) => ({
        url: fileData.url || fileData.publicUrl,
        path: fileData.path || fileData.filePath,
        originalName: files[index].name,
        fileName: fileData.fileName || fileData.name,
        size: files[index].size,
        type: files[index].type,
        bucket: fileData.bucket
      }));

    } catch (error) {
      console.error('❌ Error al subir múltiples archivos:', error);
      throw new Error(error.response?.data?.message || `Error al subir los archivos: ${error.message}`);
    }
  }

  /**
   * Elimina un archivo de Google Cloud Storage
   * @param {string} filePath - La ruta del archivo a eliminar
   * @returns {Promise<void>}
   */
  static async deleteFile(filePath) {
    try {
      console.log('🗑️ Eliminando archivo:', filePath);

      await api.delete('/delete', {
        data: { filePath }
      });

      console.log('✅ Archivo eliminado exitosamente');

    } catch (error) {
      console.error('❌ Error al eliminar archivo:', error);
      throw new Error(error.response?.data?.message || `Error al eliminar el archivo: ${error.message}`);
    }
  }

  /**
   * Obtiene una URL firmada temporal para acceder al archivo
   * @param {string} filePath - La ruta del archivo
   * @param {number} expiresIn - Tiempo de expiración en minutos (default: 60)
   * @returns {Promise<string>} - URL firmada
   */
  static async getSignedUrl(filePath, expiresIn = 60) {
    try {
      console.log('🔐 Obteniendo URL firmada para:', filePath);

      const response = await api.get('/signed-url', {
        params: { filePath, expiresIn }
      });

      const signedUrl = response.data?.data?.signedUrl || response.data?.signedUrl;

      console.log('✅ URL firmada generada exitosamente');

      return signedUrl;

    } catch (error) {
      console.error('❌ Error al obtener URL firmada:', error);
      throw new Error(error.response?.data?.message || `Error al obtener URL firmada: ${error.message}`);
    }
  }

  /**
   * Verifica si un archivo existe
   * @param {string} filePath - La ruta del archivo
   * @returns {Promise<boolean>}
   */
  static async fileExists(filePath) {
    try {
      const response = await api.get('/exists', {
        params: { filePath }
      });

      return response.data?.data?.exists || response.data?.exists || false;

    } catch (error) {
      console.error('❌ Error al verificar existencia del archivo:', error);
      return false;
    }
  }

  /**
   * Lista archivos en una carpeta
   * @param {string} folder - Nombre de la carpeta
   * @returns {Promise<Array>}
   */
  static async listFiles(folder) {
    try {
      console.log('📂 Listando archivos en carpeta:', folder);

      const response = await api.get(`/list/${folder}`);

      const files = response.data?.data?.files || response.data?.files || [];

      console.log(`✅ ${files.length} archivos encontrados`);

      return files;

    } catch (error) {
      console.error('❌ Error al listar archivos:', error);
      throw new Error(error.response?.data?.message || `Error al listar archivos: ${error.message}`);
    }
  }

  /**
   * Valida el tipo de archivo
   * @param {File} file - Archivo a validar
   * @param {Array} allowedTypes - Tipos MIME permitidos
   * @returns {boolean}
   */
  static validateFileType(file, allowedTypes = null) {
    if (!allowedTypes) {
      // Tipos por defecto permitidos
      allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'text/plain',
        'application/zip',
        'application/x-zip-compressed'
      ];
    }

    return allowedTypes.includes(file.type);
  }

  /**
   * Valida el tamaño del archivo
   * @param {File} file - Archivo a validar
   * @param {number} maxSizeMB - Tamaño máximo en MB
   * @returns {boolean}
   */
  static validateFileSize(file, maxSizeMB = 10) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Obtiene información del archivo
   * @param {File} file - Archivo
   * @returns {Object}
   */
  static getFileInfo(file) {
    return {
      name: file.name,
      size: file.size,
      sizeFormatted: this.formatFileSize(file.size),
      type: file.type,
      lastModified: new Date(file.lastModified)
    };
  }

  /**
   * Formatea el tamaño del archivo
   * @param {number} bytes - Tamaño en bytes
   * @returns {string}
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

export default StorageService;
