import { access, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDirectory = path.resolve(__dirname, "..");

const envPairs = [
  ["backend/.env.example", "backend/.env"],
  ["frontend/.env.example", "frontend/.env"]
];

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

for (const [sourceRelativePath, destinationRelativePath] of envPairs) {
  const sourcePath = path.join(rootDirectory, sourceRelativePath);
  const destinationPath = path.join(rootDirectory, destinationRelativePath);

  if (await fileExists(destinationPath)) {
    console.log(`Skipped existing file: ${destinationRelativePath}`);
    continue;
  }

  await copyFile(sourcePath, destinationPath);
  console.log(`Created file: ${destinationRelativePath}`);
}
