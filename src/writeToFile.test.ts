import { readFile, rm } from "node:fs/promises";
import { writeToFile } from "./writeToFile.js";

const file = "tmp_urls.txt";

describe("writeToFile", () => {
	afterEach(async () => {
		await rm(file);
	});

	it("should write to file", async () => {
		await writeToFile(file, {
			"https://example.com": [
				"https://example.com/asd",
				"https://example.com/asdqweerty",
			],
			"https://example.com/asd": ["https://example.com/qwe"],
		});

		const content = await readFile(file, "utf-8");

		const expected =
			"https://example.com\n\thttps://example.com/asd\n\thttps://example.com/asdqweerty\n\nhttps://example.com/asd\n\thttps://example.com/qwe\n\n";

		expect(content).toEqual(expected);
	});
});
