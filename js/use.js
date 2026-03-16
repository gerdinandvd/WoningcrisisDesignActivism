import { NodeValidator } from "./NodeValidator.js";
import { loadNodes } from "./loader.js";

async function validateDataStructure(name) {
  const data = await loadNodes(name);

  if (!data) {
    console.error("No data loaded");
    return false;
  }

  try {
    const validator = new NodeValidator(data);
    validator.validate();

    console.log("Data structure is valid.");
    return true;
  } catch (err) {
    console.error("Validation error:", err.message);
    return false;
  }
}

validateDataStructure("valid");
