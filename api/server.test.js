const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

// Write your tests here
test("sanity", () => {
  expect(true).toBe(true);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db.seed.run();
});
afterAll(async () => {
  await db.destroy(); // disconnects from db
});

it("is the correct env", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

describe("jokes router", () => {
  describe("[GET] /api/jokes", () => {
    let response;
    beforeEach(async () => {
      response = await request(server).get("/api/jokes");
    });
    it("responds with 401 Error", async () => {
      expect(response.status).toBe(401);
    });
    it("responds with no jokes", async () => {
      expect(response.body).toStrictEqual({ message: "token required" });
    });
  });
});

describe("[POST] /auth/login", () => {
  let res;
  beforeEach(async () => {
    res = await request(server)
      .post("/api/auth/login")
      .send({ password: "1234", username: "admin" });
  });
  it("responds with a 200 ", async () => {
    expect(res.status).toBe(200);
  });

  it("responds with a registered user", async () => {
    expect(res.body).toHaveProperty("message", "welcome, admin");
  });
});
