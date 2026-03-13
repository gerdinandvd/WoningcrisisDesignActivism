export async function readJsonFile(filePath) {
  const response = await fetch(filePath);

  if (!response.ok) {
    throw new Error(`Failed to load file: ${response.status}`);
  }

  return await response.json();
}

export async function loadNodes(name) {
  try {
    return await readJsonFile(`json/${name}.json`);
  } catch (error) {
    console.error("Error loading nodes:", error);
    return null;
  }
}
