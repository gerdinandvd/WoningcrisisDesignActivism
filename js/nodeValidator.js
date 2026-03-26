// import { z } from "zod";
import { z } from "https://cdn.jsdelivr.net/npm/zod/+esm";

/* ------------------ SCHEMA ------------------ */

const choiceSchema = z
  .object({
    text: z.string(),
    xp: z.number(),
    next: z.string(),
  })
  .strict();

const nodeSchema = z
  .object({
    type: z.enum(["start", "normal", "ending"]),
    name: z.string(),
    description: z.string(),
    choices: z.array(choiceSchema).optional(),
    url: z.string().optional(),
  })
  .strict();

const dataSchema = z
  .object({
    role: z.string(),
    description: z.string(),
    // nodes: z.record(nodeSchema),
    nodes: z.record(z.string(), nodeSchema),
  })
  .strict();

/* ------------------ VALIDATOR ------------------ */

export class NodeValidator {
  constructor(data) {
    const result = dataSchema.safeParse(data);

    if (!result.success) {
      throw new Error(result.error.toString());
    }

    this.data = result.data;
    this.nodes = this.data.nodes;
    this.nodeIds = Object.keys(this.nodes);
  }

  /* ---------- start node check ---------- */

  validateSingleStart() {
    const starts = Object.entries(this.nodes).filter(
      ([_, node]) => node.type === "start",
    );

    if (starts.length !== 1) {
      throw new Error("There must be exactly one start node");
    }

    this.startId = starts[0][0];
  }

  /* ---------- node reference check ---------- */

  validateNodeReferences() {
    for (const [id, node] of Object.entries(this.nodes)) {
      if (node.type === "ending") {
        if (node.choices && node.choices.length > 0) {
          throw new Error(`Ending node ${id} should not have choices`);
        }
        continue;
      }

      if (!node.choices || node.choices.length === 0) {
        throw new Error(`Node ${id} must have at least one choice`);
      }

      for (const choice of node.choices) {
        if (!this.nodeIds.includes(choice.next)) {
          throw new Error(
            `Choice in node ${id} references non-existent node ${choice.next}`,
          );
        }
      }
    }
  }

  /* ---------- reachability check ---------- */

  validateReachability() {
    const reachable = new Set();

    const dfs = (id) => {
      if (reachable.has(id)) return;

      reachable.add(id);
      const node = this.nodes[id];

      for (const choice of node.choices || []) {
        dfs(choice.next);
      }
    };

    dfs(this.startId);

    const unreachable = this.nodeIds.filter((id) => !reachable.has(id));

    if (unreachable.length > 0) {
      throw new Error(`Unreachable nodes detected: ${unreachable.join(", ")}`);
    }
  }

  /* ---------- ending path check ---------- */

  validatePathsReachEnding() {
    const visiting = new Set();
    const verified = new Set();

    const dfs = (id) => {
      const node = this.nodes[id];

      if (node.type === "ending") {
        return true;
      }

      if (visiting.has(id)) {
        throw new Error(
          `Infinite loop detected at node ${id} without reaching an ending`,
        );
      }

      if (verified.has(id)) {
        return true;
      }

      visiting.add(id);

      for (const choice of node.choices || []) {
        dfs(choice.next);
      }

      visiting.delete(id);
      verified.add(id);

      return true;
    };

    dfs(this.startId);
  }

  /* ---------- run validator ---------- */

  validate() {
    this.validateSingleStart();

    this.validateNodeReferences();

    this.validateReachability();

    this.validatePathsReachEnding();

    return true;
  }
}
