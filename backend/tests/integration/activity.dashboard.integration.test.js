import request from "supertest";
import app from "../../src/app.js";
import { supabaseAdmin } from "../../src/lib/supabaseClient.js";

const USER_HEADER = { "x-user-id": "demo" };
const DEMO_USER_ID =
  process.env.DEMO_USER_ID || "c1aae9c3-5157-4a26-a7b3-28d8905cfef0";

function findDemoUserPoints(leaderboards) {
  const row =
    leaderboards.find((u) => u.user_id === DEMO_USER_ID) ||
    leaderboards.find((u) => u.username === "demouser");
  return row ? Number(row.points || 0) : null;
}

describe("Leaderboards integration: activity affects points", () => {
  let createdLogId = null;

  afterAll(async () => {
    if (createdLogId) {
      await supabaseAdmin.from("action_logs").delete().eq("log_id", createdLogId);
    }
  });

  test(
    "posting an activity increases demo user's leaderboard points by the log score",
    async () => {
      // 1) Baseline leaderboard
      const beforeRes = await request(app).get("/leaderboards/users");
      expect(beforeRes.status).toBe(200);

      const beforeBoards = beforeRes.body?.leaderboards;
      expect(Array.isArray(beforeBoards)).toBe(true);

      const pointsBefore = findDemoUserPoints(beforeBoards);
      expect(pointsBefore).not.toBeNull();

      // 2) Get an action type key
      const typesRes = await request(app).get("/action-types");
      expect(typesRes.status).toBe(200);

      const actionTypes = typesRes.body?.actionTypes;
      expect(Array.isArray(actionTypes)).toBe(true);
      expect(actionTypes.length).toBeGreaterThan(0);

      const actionTypeKey = actionTypes[0]?.key;
      expect(actionTypeKey).toBeDefined();

      // 3) Post an activity (creates an action_log with a score)
      const createRes = await request(app)
        .post("/action-logs")
        .set(USER_HEADER)
        .send({
          action_type_key: actionTypeKey,
          quantity: 1,
        });

      expect(createRes.status).toBe(201);

      createdLogId = createRes.body?.log?.log_id ?? null;
      expect(createdLogId).toBeDefined();

      const addedScore = Number(createRes.body?.log?.score);
      expect(Number.isFinite(addedScore)).toBe(true);

      // 4) Leaderboard after
      const afterRes = await request(app).get("/leaderboards/users");
      expect(afterRes.status).toBe(200);

      const afterBoards = afterRes.body?.leaderboards;
      expect(Array.isArray(afterBoards)).toBe(true);

      const pointsAfter = findDemoUserPoints(afterBoards);
      expect(pointsAfter).not.toBeNull();

      // 5) Points increased by exactly the log score
      expect(pointsAfter).toBe(pointsBefore + addedScore);
    },
    20000
  );
});




