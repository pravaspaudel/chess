import { createClient } from "redis";
import { saveMove, getMove } from "./utils/handleMoveStatus";

//default
const client = createClient({
  url: "redis://127.0.0.1:6379",
});

const startRedis = async () => {
  client.on("error", (err) => {
    console.log("REDIS_ERROR ", err);
  });

  await client.connect();

  console.log("redis connected");
};

export { client, startRedis };
export { saveMove, getMove };
