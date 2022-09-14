import { readFile } from "node:fs/promises";
import nock from "nock";
import { exploreSite } from "./exploreSite.js";

describe("exploreSite", () => {
	beforeEach(async () => {
		const index = await readFile("./__TEST__/exampleSite/index.html", "utf-8");
		const asd = await readFile("./__TEST__/exampleSite/asd.html", "utf-8");

		nock("https://example.com")
			.get("/")
			.reply(200, index)
			.get("/asd")
			.reply(200, asd);
	});
	it("exploreSite", async () => {
		const result = await exploreSite(["https://example.com"]);
		expect(result).toStrictEqual({
			"https://example.com": ["https://example.com/asd"],
			"https://example.com/asd": [],
		});
	});
});
