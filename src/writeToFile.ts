import { writeFile } from "node:fs/promises";

export const writeToFile = async (
	file: string,
	urlsMap: Record<string, string[]>
) => {
	const str = Object.entries(urlsMap).reduce((acc, [page, pageUrls]) => {
		acc += `${page}\n\t`;
		acc += pageUrls.join("\n\t") + "\n\n";

		return acc;
	}, "");

	await writeFile(file, str);
};
