import { writeFile } from "node:fs/promises";

export const writeToFile = async (
	file: string,
	urlsMap: Record<string, string[]>
) => {
	const str = Object.entries(urlsMap).reduce((acc, [page, pageUrls]) => {
		const butLastItems = pageUrls.slice(0, -1);
		const lastItem = pageUrls.at(-1);

		acc += `${page}\n\t`;
		acc += butLastItems.join("\n\t");
		acc += `\n\t${lastItem}\n\n`;

		return acc;
	}, "");

	await writeFile(file, str);
};
