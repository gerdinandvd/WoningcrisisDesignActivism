import { NodeValidator } from "./NodeValidator.js";
import { loadNodes, loadConfig } from "./loader.js";

export class GameRoleData {
  constructor(config) {
    this.config = config;
    this.config_roles = config.roles;
    this.roles = []; // Will be populated after loading
    this.roleDisplayNames = {}; // Mapping from internal ID to display name
    this.gameRoleData = {};
    this.XP = this._loadFromStorage("xp", config.starterXP);
    this.playedRoles = this._loadFromStorage("playedRoles", []);
    this.currentRole = null;
    this.currentNodeId = null;
  }

  _saveToStorage(key, value) {
    try {
      localStorage.setItem(`game_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  _loadFromStorage(key, defaultValue) {
    try {
      const saved = localStorage.getItem(`game_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      console.warn("Could not load from localStorage", e);
      return defaultValue;
    }
  }

  static async create(config) {
    const instance = new GameRoleData(config);
    await instance._loadAllRoles();
    return instance;
  }

  async _loadAllRoles() {
    await Promise.all(
      this.config_roles.map(async (roleId) => {
        const data = await loadNodes(roleId);
        if (data) {
          const validator = new NodeValidator(data);
          if (validator.validate()) {
            this.gameRoleData[roleId] = data;
            this.roleDisplayNames[roleId] = data.role || roleId;
            this.roles.push(roleId);
          } else {
            console.error(`Validation failed for role: ${roleId}`);
          }
        } else {
          console.error(`Failed to load role: ${roleId}`);
        }
      }),
    );

    return true;
  }

  async doRolesExist() {
    for (const role of this.roles) {
      //   console.log(role);
      const data = await loadNodes(role);
      if (!data) return false;

      const validator = new NodeValidator(data);

      if (!validator.validate()) {
        return false;
      }
    }

    return true;
  }

  getRoleData(role) {
    if (!this.gameRoleData || typeof this.gameRoleData !== "object") {
      console.error(
        "gameRoleData is not an object yet (likely still loading)",
        this.gameRoleData,
      );
      return undefined;
    }

    return this.gameRoleData[role];
  }

  getRoles() {
    return this.roles;
  }

  getRoleDisplayName(roleId) {
    return this.roleDisplayNames[roleId] || roleId;
  }

  getRolesFromConfigRoles() {
    return this.roles;
  }

  getXP() {
    return this.XP;
  }

  hasSavedData() {
    return this.XP !== this.config.starterXP || this.playedRoles.length > 0;
  }

  setXP(xp) {
    this.XP = xp;
  }

  addXP(xp) {
    this.XP += xp;
    this._saveToStorage("xp", this.XP);
  }

  markRoleAsPlayed(role) {
    if (!this.playedRoles.includes(role)) {
      this.playedRoles.push(role);
      this._saveToStorage("playedRoles", this.playedRoles);
    }
  }

  isRolePlayed(role) {
    return this.playedRoles.includes(role);
  }

  getPlayedRoles() {
    return this.playedRoles;
  }

  setCurrentRole(role) {
    if (!this.roles.includes(role)) {
      console.error(`Role ${role} does not exist in roles list`);
      return false;
    }
    this.currentRole = role;
    return true;
  }

  setCurrentNodeId(nodeId) {
    const roleData = this.getRoleData(this.currentRole);
    if (!roleData) {
      console.error("Current role data not found");
      return false;
    }

    // check if nodeId exists in roleData.nodes
    if (!roleData.nodes[nodeId]) {
      console.error(`Node ID ${nodeId} does not exist in current role's nodes`);
      return false;
    }
    this.currentNodeId = nodeId;
    return true;
  }

  getCurrentNode() {
    const roleData = this.getRoleData(this.currentRole);
    if (!roleData) {
      console.error("Current role data not found");
      return null;
    }
    if (!this.currentNodeId) {
      console.error("Current node ID is not set");
      return null;
    }
    return roleData.nodes[this.currentNodeId];
  }

  getCurrentRole() {
    return this.currentRole;
  }

  getCurrentNodeId() {
    return this.currentNodeId;
  }

  getStarterNodeId() {
    const roleData = this.getRoleData(this.currentRole);
    if (!roleData) {
      console.error("Current role data not found");
      return null;
    }
    const startNode = Object.entries(roleData.nodes).find(
      ([_, node]) => node.type === "start",
    );
    return startNode ? startNode[0] : null;
  }

  selectChoice(choiceIndex) {
    const currentNode = this.getCurrentNode();
    if (!currentNode) {
      console.error("Current node not found");
      return false;
    }
    if (!currentNode.choices || choiceIndex >= currentNode.choices.length) {
      console.error("Invalid choice index");
      console.error("Current node choices:", currentNode.choices);
      console.error("Choice index:", choiceIndex);
      return false;
    }
    const nextNodeId = currentNode.choices[choiceIndex].next;
    return this.setCurrentNodeId(nextNodeId);
  }
}

// test:

const config = await loadConfig("config");

const gameRoleData = await GameRoleData.create(config);

console.log("GameRoleData loaded:", Object.keys(gameRoleData.gameRoleData));

// vluchteling", "student
