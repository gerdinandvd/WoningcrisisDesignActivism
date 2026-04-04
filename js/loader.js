export async function readJsonFile(filePath) {
  const response = await fetch(filePath);

  if (!response.ok) {
    throw new Error(`Failed to load file: ${response.status}`);
  }

  return await response.json();
}

export async function loadNodes(name) {
  try {
    return await readJsonFile(`json/roles/${name}.json`);
  } catch (error) {
    console.error("Error loading nodes:", error);
    return null;
  }
}

export async function loadConfig(name) {
  try {
    return await readJsonFile(`json/config/${name}.json`);
  } catch (error) {
    console.error("Error loading config:", error);
    return null;
  }
}

export async function loadAwards() {
  try {
    return await readJsonFile(`json/config/awards.json`);
  } catch (error) {
    console.error("Error loading awards:", error);
    return {};
  }
}
