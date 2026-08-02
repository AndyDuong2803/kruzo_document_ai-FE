import { describe, expect, it } from "vitest";

import { runWithConcurrency } from "./processUploads";

describe("bounded document queue", () => {
  it("runs no more than two document jobs concurrently", async () => {
    let active = 0;
    let maxActive = 0;
    await runWithConcurrency([1, 2, 3, 4, 5, 6], 2, async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active -= 1;
    });
    expect(maxActive).toBe(2);
  });
});
