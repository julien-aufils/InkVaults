// dataLoader.js
const fs = require("fs");
const path = require("path");

const authorsDataFilePath = path.join(process.cwd(), "data", "authors.json");

function getAuthorsData() {
  // Lire le contenu du fichier JSON
  const fileContent = fs.readFileSync(authorsDataFilePath, "utf-8");

  // Parser le contenu JSON
  const authorsData = JSON.parse(fileContent);

  return authorsData;
}

module.exports = {
  getAuthorsData,
};
