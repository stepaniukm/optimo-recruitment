import { writeToFile } from "./src/writeToFile.js";
import { exploreSite } from "./src/exploreSite.js";

const result = await exploreSite(["https://bfgames.com"]);

console.log(JSON.stringify(result, null, 2));

await writeToFile(result);
