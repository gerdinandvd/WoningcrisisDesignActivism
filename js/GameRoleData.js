import { NodeValidator } from "./nodeValidator.js";
import { loadNodes } from "./loader.js";

class GameRoleData {
  constructor() {
    this.roles = [];
    this.config = {};
  }

  async doRolesExist(roles) {
    for (const role of roles) {
      const data = await loadNodes(role);
      if (!data) return false;

      const validator = new NodeValidator(data);

      if (!validator.validate()) {
        return false;
      }
    }

    return true;
  }
}

// test:

const gameRoleData = new GameRoleData();

gameRoleData.doRolesExist(["vluchteling", "student"]).then((result) => {
  if (result) {
    console.log("All roles exist");
  } else {
    console.error("One or more roles do not exist");
  }
});
