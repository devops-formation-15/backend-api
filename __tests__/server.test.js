import request from 'supertest';
import { app } from '../server'; // Import the app

describe("Express App Tests", () => {
  it("should return 200 OK on GET /", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Server is running!!");
  });
});
