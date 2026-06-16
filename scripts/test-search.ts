import "dotenv/config";
import { semanticSearch } from "../lib/semanticSearch";

async function main() {
  const results = await semanticSearch(
    "how to learn three.js shaders"
  );

  console.log(results);
}

main();