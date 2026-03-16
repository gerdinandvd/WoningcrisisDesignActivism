import { NodeValidator } from "./NodeValidator.js";
import { loadNodes, loadConfig } from "./loader.js";

export class GameRoleData {
  constructor(config) {
    this.roles = config.roles;
    this.gameRoleData = {};
    this.XP = config.starterXP;

    this.doRolesExist().then((result) => {
      if (result) {
        for (const role of this.roles) {
          loadNodes(role).then((data) => {
            this.gameRoleData[role] = data;
          });
        }
      } else {
        this.gameRoleData = null;
        console.error("One or more roles do not exist");
      }
    });

    console.log(this.gameRoleData);
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
    return this.gameRoleData[role];
  }

  getRoles() {
    return this.roles;
  }

  getXP() {
    return this.XP;
  }
}

// test:

const config = await loadConfig("config");

const gameRoleData = new GameRoleData(config);

gameRoleData.doRolesExist().then((result) => {
  if (result) {
    console.log("All roles exist");
  } else {
    console.error("One or more roles do not exist");
  }
});

// vluchteling", "student
