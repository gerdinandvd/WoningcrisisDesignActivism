class NodeValidator {
  constructor(data) {
    this.data = data;
    this.nodeIds = Object.keys(data.nodes || {});
  }

  hasOnlyKeys(obj, allowedKeys) {
    return Object.keys(obj).every((key) => allowedKeys.includes(key));
  }

  validateTopLevel() {
    if (!this.isString(this.data.role)) {
      return this.error("Invalid or missing role");
    }

    if (!this.isString(this.data.description)) {
      return this.error("Invalid or missing description");
    }

    if (!this.isObject(this.data.nodes)) {
      return this.error("Invalid or missing nodes");
    }

    return true;
  }

  validateNode(id) {
    const node = this.data.nodes[id];

    const allowedKeys = ["type", "name", "description", "choices"];

    if (!this.hasOnlyKeys(node, allowedKeys)) {
      return this.error(`Unexpected key in node ${id}`);
    }

    if (!this.validateNodeType(node, id)) return false;
    if (!this.validateNodeName(node, id)) return false;
    if (!this.validateNodeDescription(node, id)) return false;
    if (!this.validateChoices(node, id)) return false;

    return true;
  }

  validateNodeType(node, id) {
    const validTypes = ["start", "normal", "ending"];

    if (!validTypes.includes(node.type)) {
      return this.error(`Invalid type for node ${id}`);
    }

    return true;
  }

  validateNodeName(node, id) {
    if (!this.isString(node.name)) {
      return this.error(`Invalid or missing name for node ${id}`);
    }

    return true;
  }

  validateNodeDescription(node, id) {
    if (!this.isString(node.description)) {
      return this.error(`Invalid or missing description for node ${id}`);
    }

    return true;
  }

  validateChoices(node, id) {
    if (node.type === "ending") {
      if (node.choices && node.choices.length > 0) {
        return this.error(`Ending node ${id} should not have choices`);
      }
      return true;
    }

    if (!Array.isArray(node.choices)) {
      return this.error(`Invalid choices for node ${id}`);
    }

    return node.choices.every((choice) => this.validateChoice(choice, id));
  }

  validateChoice(choice, nodeId) {
    if (!this.isString(choice.text)) {
      return this.error(`Invalid text in choice for node ${nodeId}`);
    }

    if (typeof choice.xp !== "number") {
      return this.error(`Invalid xp in choice for node ${nodeId}`);
    }

    if (!this.nodeIds.includes(choice.next)) {
      return this.error(
        `Invalid or non-existent next id in choice for node ${nodeId}`,
      );
    }

    return true;
  }
  isString(value) {
    return typeof value === "string";
  }

  isObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  error(message) {
    console.error(message);
    return false;
  }
  validate() {
    if (!this.validateTopLevel()) return false;

    for (const id of this.nodeIds) {
      if (!this.validateNode(id)) return false;
    }

    return true;
  }
}

import { loadNodes } from "./loader.js";

async function validateDataStructure(name) {
  const data = await loadNodes(name);
  if (!data) return false;

  const validator = new NodeValidator(data);
  return validator.validate();
}

validateDataStructure("valid").then((isValid) => {
  if (isValid) {
    console.log("Data structure is valid.");
  } else {
    console.error("Data structure is invalid.");
  }
});
