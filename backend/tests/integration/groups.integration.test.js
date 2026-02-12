import request from "supertest";
import app from "../../src/app.js";
import { supabaseAdmin } from "../../src/lib/supabaseClient.js";

const DEMO_USER_ID =
  process.env.DEMO_USER_ID || "c1aae9c3-5157-4a26-a7b3-28d8905cfef0";

describe("Groups integration test", () => {
  let createdGroupId = null;

  test("creates group in real database", async () => {
    const groupName = "Integration Test Group";

    // Call real API
    const res = await request(app)
      .post("/groups")
      .set("x-user-id", DEMO_USER_ID)
      .send({
        name: groupName,
        type: "society"
      });

    expect(res.status).toBe(201);

    createdGroupId = res.body.group.group_id;

    // Verify group exists in DB
    const { data: group } = await supabaseAdmin
      .from("groups")
      .select("*")
      .eq("group_id", createdGroupId)
      .single();

    expect(group).not.toBeNull();
    expect(group.name).toBe(groupName);
  });

  // Cleanup after test
  afterAll(async () => {
    if (createdGroupId) {
      await supabaseAdmin
        .from("groups")
        .delete()
        .eq("group_id", createdGroupId);
    }
  });
});
