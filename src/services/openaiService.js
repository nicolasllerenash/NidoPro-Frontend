class OpenAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    

    
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file');
    }
  }

  async sendMessage(message, conversationHistory = []) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const systemPrompt = `Eres un asistente educativo especializado para directoras de jardines infantiles. Tu nombre es "Asistente Educativo EDA" y trabajas para apoyar a directoras en la gestión y mejora de sus centros educativos infantiles.

CARACTERÍSTICAS DE TU PERSONALIDAD:
- Eres amable, profesional y siempre dispuesto a ayudar
- Tienes amplio conocimiento en educación infantil, desarrollo temprano y gestión educativa
- Ofreces respuestas prácticas y aplicables en el contexto de jardines infantiles
- Eres creativo e innovador en tus propuestas pedagógicas
- Comprendes los desafíos únicos de dirigir un centro educativo para niños pequeños

ÁREAS DE ESPECIALIZACIÓN:
✅ Desarrollo infantil temprano (3-5 años)
✅ Mejora continua del profesorado
✅ Comunicación efectiva con padres de familia
✅ Gestión de conflictos en educación infantil
✅ Planes de mejora educativa institucional
✅ Salud y seguridad en entornos infantiles
✅ Organización de eventos y celebraciones
✅ Evaluación del desarrollo infantil
✅ Actividades lúdicas y aprendizaje por juego
✅ Liderazgo pedagógico y gestión de equipos

FORMATO DE RESPUESTAS:
- Usa emojis infantiles y educativos relevantes (� � 🧸 � � 🌈)
- Estructura tus respuestas con títulos y subtítulos claros
- Ofrece ejemplos prácticos específicos para educación infantil
- Incluye actividades o estrategias paso a paso cuando sea apropiado
- Sugiere recursos adicionales apropiados para kinder

TONO:
- Profesional pero cálido y maternal
- Motivador y positivo
- Comprensivo con los desafíos de dirigir un kinder
- Práctico y orientado a soluciones infantiles

Siempre termina tus respuestas preguntando si la directora necesita más detalles sobre algún aspecto específico o si hay algo más en lo que puedas ayudar.
Mantén las respuestas concisas pero completas, enfocándote en soluciones prácticas para jardines infantiles.
Si te hace preguntas fuera de tu área de especialización, redirige amablemente la conversación a temas educativos infantiles.`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      
      // Fallback response cuando hay error
      if (error.message.includes('API key')) {
        return `🔑 **Error de Configuración**

Parece que hay un problema con la configuración de la API de OpenAI. Por favor, contacta al administrador del sistema.

Mientras tanto, aquí tienes algunas sugerencias para tu jardín infantil:

� **Para desarrollo infantil:**
- Implementa rutinas diarias consistentes
- Crea espacios de aprendizaje por juego
- Fomenta la autonomía y exploración
- Incluye actividades sensoriales diarias

👩‍🏫 **Para mejorar profesores:**
- Realiza observaciones en el aula semanalmente
- Organiza sesiones de capacitación mensual
- Crea grupos de estudio colaborativo
- Celebra logros y mejoras

👨‍👩‍👧‍� **Para comunicación con padres:**
- Envía boletines semanales con fotos
- Organiza reuniones individuales periódicas
- Crea un libro de comunicaciones diario
- Comparte hitos de desarrollo de cada niño

¿Hay algún tema específico en el que pueda ayudarte con más detalle?`;
      }
      
      return `❌ **Error Temporal**

Disculpa, estoy experimentando dificultades técnicas en este momento. 

🔄 **Mientras tanto, puedes:**
- Intentar reformular tu pregunta
- Usar las consultas frecuentes del panel
- Contactar al soporte técnico

Como asistente educativo especializado en jardines infantiles, estoy aquí para ayudarte con desarrollo infantil, mejora de profesores, actividades lúdicas y mucho más. 

¿Te gustaría intentar con una consulta más específica sobre educación infantil?`;
    }
  }

  // Método para validar si la API está configurada
  isConfigured() {
    return !!this.apiKey && this.apiKey !== 'your_openai_api_key_here';
  }

  // Método para obtener sugerencias rápidas sin usar la API
  getQuickSuggestions(topic) {
    const suggestions = {
      desarrollo: {
        title: "� Desarrollo Infantil",
        content: `🌱 **Hitos Importantes por Edad:**

🎯 **3 años:** Desarrollo del lenguaje, motricidad fina, reconocimiento de colores y formas
� **4 años:** Habilidades sociales, creatividad, conceptos básicos de matemáticas
� **5 años:** Preparación para primaria, escritura básica, resolución de problemas

💡 **Actividades recomendadas:**
• Juegos sensoriales diarios
• Música y movimiento
• Lectura compartida
• Exploración al aire libre

¿En qué edad específica te gustaría enfocarte?`
      },
      profesores: {
        title: "�‍🏫 Mejora de Profesores",
        content: `🎓 **Estrategias Efectivas:**

� **Observación semanal:** Feedback constructivo y específico
📚 **Capacitación mensual:** Temas relevantes para educación infantil
🤝 **Trabajo colaborativo:** Grupos de estudio y compartir experiencias
🏆 **Reconocimiento:** Celebrar logros y mejoras
� **Metas individuales:** Desarrollo profesional personalizado

¿Hay algún aspecto específico del profesorado que te preocupa?`
      },
      padres: {
        title: "👨‍👩‍👧‍👦 Comunicación con Padres",
        content: `💌 **Estrategias de Comunicación:**

📱 **Boletines semanales:** Fotos, actividades y logros
� **Reuniones individuales:** Seguimiento del desarrollo de cada niño
� **Libro de comunicaciones:** Intercambio diario con familias
🎪 **Eventos familiares:** Involucrar a padres en actividades
📞 **Líneas abiertas:** Canales de comunicación accesibles

¿Qué tipo de comunicación funciona mejor en tu comunidad?`
      },
      conflictos: {
        title: "�️ Gestión de Conflictos",
        content: `� **Resolución Positiva:**

👂 **Escucha activa:** Prestar atención a todas las partes
💝 **Empatía:** Comprender sentimientos de los niños
🤝 **Mediación:** Guiar hacia soluciones colaborativas
📚 **Prevención:** Actividades que fomentan el respeto
🎯 **Consecuencias lógicas:** Aprendizaje natural

¿Hay algún tipo de conflicto que sea recurrente en tu jardín?`
      }
    };

    return suggestions[topic] || suggestions.desarrollo;
  }
}

export default new OpenAIService();
