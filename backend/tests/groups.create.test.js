import { jest } from "@jest/globals";
import request from "supertest";

// ---- Mock Supabase before importing app ----
const mockInsertSingle = jest.fn();
const mockUpdateSingle = jest.fn();
const mockUpsert = jest.fn();

const mockGroupsInsert = jest.fn(() => ({ select: () => ({ single: mockInsertSingle }) }));
const mockUsersUpdate = jest.fn(() => ({ eq: () => ({ select: () => ({ single: mockUpdateSingle }) }) }));
const mockMembershipUpsert = jest.fn(() => ({ }));

const supabaseAdminMock = {
  from: (table) => {
    if (table === "groups") return { insert: mockGroupsInsert };
    if (table === "users") return { update: mockUsersUpdate };
    if (table === "group_memberships") return { upsert: mockUpsert };
    throw new Error(`Unexpected table: ${table}`);
  }
};

jest.unstable_mockModule("../src/lib/supabaseClient.js", () => {
  return {
    supabaseAdmin: supabaseAdminMock,
    supabaseUser: {} // not used by createGroup
  };
});

const { default: app } = await import("../src/app.js");

describe("POST /groups create group", () => {
  beforeEach(() => {
    mockInsertSingle.mockReset();
    mockUpdateSingle.mockReset();
    mockUpsert.mockReset();
    mockGroupsInsert.mockClear();
  });

  test("400 if missing x-user-id", async () => {
    const res = await request(app).post("/groups").send({ name: "My Group" });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Missing user id");
  });

  test("400 if missing group name", async () => {
    const res = await request(app)
      .post("/groups")
      .set("x-user-id", "demo") // allowed in normalizeUserId
      .send({ name: "   " });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Group name is required" });
  });

  test("201 creates group and returns group + updated user", async () => {
    const fakeGroup = {
      group_id: "g1",
      name: "New Group",
      type: "society",
      created_at: "2026-02-12T00:00:00Z",
      created_by: "c1aae9c3-5157-4a26-a7b3-28d8905cfef0"
    };

    const fakeUser = {
      user_id: "c1aae9c3-5157-4a26-a7b3-28d8905cfef0",
      username: "demouser",
      display_name: "Demo User",
      role: "user",
      group_id: "g1"
    };

    // groups insert
    mockInsertSingle.mockResolvedValue({ data: fakeGroup, error: null });
    // users update
    mockUpdateSingle.mockResolvedValue({ data: fakeUser, error: null });
    // membership upsert
    mockUpsert.mockResolvedValue({ error: null });

    const res = await request(app)
      .post("/groups")
      .set("x-user-id", "demo") // becomes DEMO_USER_ID
      .send({ name: "New Group", type: "society" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ group: fakeGroup, user: fakeUser });

    // verify Supabase calls happened
    expect(mockGroupsInsert).toHaveBeenCalledTimes(1);
    expect(mockUpsert).toHaveBeenCalledTimes(1);
  });
});
