import { handle } from "hono/vercel";
import { app } from "../src/app";

export const config = {
  runtime: "nodejs", // or 'edge' if preferred, but nodejs is safer for now
};

export default handle(app);
