export const COLORS = [
  "#4CAF50", // Normal
  "#FFC107", // Tolerable
  "#FF9800", // Precaución
  "#F44336", // Crítico
  "#9E9E9E",  // No monitoreado
  "#2196F3", // Azul para OT cerrado
  "#F44336", // Rojo para OT abierto
];

export const getColor = (condition: string) => {
  switch (condition) {
    case "Normal":
      return "#4CAF50";
    case "Tolerable":
      return "#FFC107";
    case "Precaucion":
      return "#FF9800";
    case "Critico":
      return "#F44336";
    case "No monitoreado":
      return "#9E9E9E";
    default:
      return "#d5d5d5";
  }
};
