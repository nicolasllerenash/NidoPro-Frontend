// Test para validar la integración de Firebase Storage con el servicio de trabajadores
import { FirebaseStorageService } from '../services/firebaseStorageService';
import trabajadorService from '../services/trabajadorService';

export const testFirebaseIntegration = async () => {
  try {
    // 1. Probar subida de archivo simulado

    // Crear un archivo de prueba (blob simulado)
    const testFile = new File(['contenido de prueba'], 'contrato-prueba.pdf', {
      type: 'application/pdf'
    });

    const uploadResult = await FirebaseStorageService.uploadFile(
      testFile,
      'test/trabajadores',
      'test@example.com'
    );


    // 2. Probar validación de archivos

    const validFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const invalidFile = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });

    // Validaciones (resultado devuelto abajo)

    // 3. Probar formato de tamaño
    FirebaseStorageService.formatFileSize(1024 * 1024 * 5);

    return {
      success: true,
      uploadResult,
      validations: {
        validFile: FirebaseStorageService.validateFileType(validFile),
        invalidFile: FirebaseStorageService.validateFileType(invalidFile)
      }
    };

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default testFirebaseIntegration;