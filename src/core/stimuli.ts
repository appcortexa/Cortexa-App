export interface Stimulus {
  id: string;
  type: "GO" | "NO_GO";
  category: string;
  image: string;
}

// Genera un arreglo de estímulos a partir de una convención de nombres.
// Ejemplo de salida de id/image: GO001, GO002, ...
function createStimuli(
  prefix: string,
  count: number,
  category: string,
  type: Stimulus["type"],
  folder: string,
): Stimulus[] {
  return Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(3, "0");
    const id = `${prefix}${number}`;

    return {
      id,
      type,
      category,
      image: `/imagenes/${folder}/${id}.png`,
    };
  });
}

// Estímulos GO: GO001 a GO040.
export const goStimuli = createStimuli("GO", 40, "go", "GO", "go");

// Estímulos NO_GO de alcohol: ALC001 a ALC020.
export const alcoholStimuli = createStimuli(
  "ALC",
  20,
  "alcohol",
  "NO_GO",
  "alcohol",
);

// Estímulos NO_GO de cristal: MET001 a MET020.
export const cristalStimuli = createStimuli(
  "MET",
  20,
  "cristal",
  "NO_GO",
  "cristal",
);

// Estímulos NO_GO de cocaína: COC001 a COC020.
export const cocainaStimuli = createStimuli(
  "COC",
  20,
  "cocaina",
  "NO_GO",
  "cocaina",
);

// Arreglo consolidado con todos los estímulos disponibles.
export const allStimuli: Stimulus[] = [
  ...goStimuli,
  ...alcoholStimuli,
  ...cristalStimuli,
  ...cocainaStimuli,
];
