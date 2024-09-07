import { DSM } from "./types/DSM";

const generations = ["22nm", "28nm", "40nm", "55nm", "90nm", "130nm"];
const technologies = ["CBD", "eHV", "logic-mixed"];
const categories = ["G-01", "G-02", "G-03", "G-04", "G-05", "G-06"];
const platforms = ["LP", "HPC", "HPC+", "ULP", "ULL"];
const revisionVersions = [
  "1.0.0.0",
  "1.1.0.0",
  "1.2.1.1",
  "1.3.0.0",
  "1.4.1.1",
];
const customMarks = ["A", "B", "C", "D", "E"];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomDSM(i: number): DSM {
  const id = i;
  const generation = getRandomElement(generations);
  const technology = getRandomElement(technologies);
  const category = getRandomElement(categories);
  const platform = getRandomElement(platforms);
  const revisionVersion = getRandomElement(revisionVersions);
  const customMark =
    Math.random() > 0.5 ? getRandomElement(customMarks) : undefined;
  const name = `${category}-${technology}${generation}-${platform}, ${revisionVersion}${
    customMark ? "-" + customMark : ""
  }.pdf`;

  return {
    id,
    name,
    generation,
    technology,
    category,
    platform,
    revisionVersion,
    customMark,
  };
}

const getDocuments = (): DSM[] => {
  const documents: DSM[] = [];
  for (let i = 1; i <= 100; i++) {
    documents.push(generateRandomDSM(i));
  }
  return documents.sort((a, b) => { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; });
};

export default { getDocuments };
