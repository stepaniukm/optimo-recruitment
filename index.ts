import { writeToFile } from "./src/writeToFile.js";
import { exploreSite } from "./src/exploreSite.js";

const result = await exploreSite(["https://bfgames.com"]);

await writeToFile(result);
