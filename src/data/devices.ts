export interface Device {
  id: string;
  nombre: string;
  consumoEstimado: string;
  impacto: "Bajo" | "Medio" | "Alto" | "Bajo/Medio" | "Medio/Alto";
  recomendaciones: string[];
  ahorroPotencial: "Bajo" | "Medio" | "Alto";
  impactoAmbiental: string;
}

export const DEVICES: Record<string, Device> = {
  aire_acondicionado: {
    id: "aire_acondicionado",
    nombre: "Aire Acondicionado",
    consumoEstimado: "1013 a 1613 W; Inverter 658 a 1048 W",
    impacto: "Alto",
    ahorroPotencial: "Alto",
    impactoAmbiental: "Menor consumo eléctrico y menor emisión de CO2.",
    recomendaciones: [
      "Regular la temperatura a 24°C.",
      "Limpiar filtros una vez al mes.",
      "Cerrar puertas y ventanas cuando está encendido.",
      "Evitar sobreenfriar ambientes.",
    ],
  },
  heladera: {
    id: "heladera",
    nombre: "Heladera",
    consumoEstimado: "90 W",
    impacto: "Medio",
    ahorroPotencial: "Medio",
    impactoAmbiental: "Reducción de residuos térmicos y eficiencia en el ciclo de enfriamiento.",
    recomendaciones: [
      "Esperar que los alimentos se enfríen antes de guardarlos.",
      "No abrir la puerta innecesariamente.",
      "Revisar burletes periódicamente.",
      "Ubicar lejos de fuentes de calor (hornos, sol directo).",
    ],
  },
  freezer: {
    id: "freezer",
    nombre: "Freezer",
    consumoEstimado: "113 W",
    impacto: "Medio",
    ahorroPotencial: "Medio",
    impactoAmbiental: "Optimización del uso de energía constante.",
    recomendaciones: [
      "Quitar escarcha periódicamente.",
      "Evitar abrirlo innecesariamente.",
      "Revisar el cierre hermético de la puerta.",
    ],
  },
  lavarropas: {
    id: "lavarropas",
    nombre: "Lavarropas",
    consumoEstimado: "175 W (frío); 875 W (con calentamiento)",
    impacto: "Medio/Alto",
    ahorroPotencial: "Alto",
    impactoAmbiental: "Menor consumo de agua caliente y energía por ciclo.",
    recomendaciones: [
      "Usar cargas completas.",
      "Evitar calentar agua cuando no sea estrictamente necesario.",
      "Planificar los lavados para optimizar el uso.",
    ],
  },
  termotanque: {
    id: "termotanque",
    nombre: "Termotanque",
    consumoEstimado: "1500 W",
    impacto: "Alto",
    ahorroPotencial: "Alto",
    impactoAmbiental: "Reducción de la pérdida de calor y consumo sostenido.",
    recomendaciones: [
      "Regular la temperatura (50-60°C).",
      "Evitar mezclar excesivamente con agua fría.",
      "Aislar cañerías y el tanque si es posible.",
    ],
  },
  tv: {
    id: "tv",
    nombre: "Televisor",
    consumoEstimado: "40 a 90 W",
    impacto: "Bajo/Medio",
    ahorroPotencial: "Medio",
    impactoAmbiental: "Reducción de consumo pasivo y brillo excesivo.",
    recomendaciones: [
      "Reducir luminosidad a un nivel aceptable.",
      "Apagar si no se está usando.",
      "Evitar el modo stand-by (desenchufar si es posible).",
    ],
  },
  iluminacion: {
    id: "iluminacion",
    nombre: "Iluminación",
    consumoEstimado: "LED 3 a 15 W",
    impacto: "Medio",
    ahorroPotencial: "Alto",
    impactoAmbiental: "Ahorro de hasta un 80% frente a halógenas; evita ~43 kg de CO2/año.",
    recomendaciones: [
      "Cambiar halógenas por lámparas LED.",
      "Apagar luces si no son necesarias.",
      "Aprovechar la luz natural al máximo.",
    ],
  },
  cocina: {
    id: "cocina",
    nombre: "Cocina",
    consumoEstimado: "Variable (Gas/Eléctrica)",
    impacto: "Alto",
    ahorroPotencial: "Medio",
    impactoAmbiental: "Uso eficiente de combustibles y energía térmica.",
    recomendaciones: [
      "Mantener la llama azul.",
      "Regular hornallas para que la llama no escape por los costados.",
      "Cocinar siempre con ollas tapadas.",
      "Planificar la cocción para reducir tiempos de encendido.",
    ],
  },
  pava_electrica: {
    id: "pava_electrica",
    nombre: "Pava Eléctrica",
    consumoEstimado: "2000 W",
    impacto: "Alto",
    ahorroPotencial: "Alto",
    impactoAmbiental: "Evita el desperdicio de energía por calentamiento excesivo.",
    recomendaciones: [
      "Calentar solo la cantidad de agua necesaria.",
      "No hervir varias veces la misma agua.",
      "Desenchufar el cargador de la base cuando no se usa.",
    ],
  },
  plancha: {
    id: "plancha",
    nombre: "Plancha",
    consumoEstimado: "750 W",
    impacto: "Medio",
    ahorroPotencial: "Medio",
    impactoAmbiental: "Agrupación de consumo en un solo pulso térmico.",
    recomendaciones: [
      "Juntar varias prendas antes de planchar.",
      "Evitar encenderla para una sola prenda.",
      "Planificar el tiempo de planchado aprovechando el calor residual.",
    ],
  },
  ventilador: {
    id: "ventilador",
    nombre: "Ventilador",
    consumoEstimado: "60 a 90 W",
    impacto: "Bajo/Medio",
    ahorroPotencial: "Bajo",
    impactoAmbiental: "Alternativa de bajo consumo al aire acondicionado.",
    recomendaciones: [
      "Usarlo como alternativa al aire acondicionado cuando sea posible.",
      "Apagarlo al salir del ambiente.",
      "Mantener las aspas limpias para mayor eficiencia.",
    ],
  },
  cargador: {
    id: "cargador",
    nombre: "Cargador",
    consumoEstimado: "Bajo (Stand-by)",
    impacto: "Bajo",
    ahorroPotencial: "Bajo",
    impactoAmbiental: "Eliminación del consumo 'vampiro'.",
    recomendaciones: [
      "Desenchufar cuando no se está usando el dispositivo.",
      "Evitar dejar cargadores conectados toda la noche.",
    ],
  },
  computadora: {
    id: "computadora",
    nombre: "Computadora",
    consumoEstimado: "Variable",
    impacto: "Medio",
    ahorroPotencial: "Medio",
    impactoAmbiental: "Gestión inteligente del estado de energía.",
    recomendaciones: [
      "Apagar o hibernar si no se está usando por más de 30 min.",
      "Reducir el brillo de la pantalla.",
      "Desenchufar accesorios (USB, discos externos) que no se usen.",
    ],
  },
};
