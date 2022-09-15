import fetch from "node-fetch";
import { Cheerio, Element, load } from "cheerio";
import consola from "consola";
import {
	hasExtension,
	removeDuplicates,
	removeTrailingSlash,
	areSameDomain,
	isCorrectUrl,
	tryEncodeURI,
} from "./utils.js";

export const exploreSite = async (
	urlsToCheck: string[],
	visitedLinks: string[] = [],
	urlsMap: Record<string, string[]> = {}
): Promise<Record<string, string[]>> => {
	if (urlsToCheck.length === 0) {
		return urlsMap;
	}
	const linksToCrawl: string[] = [];
	const urlsWithoutTrailingSlash = urlsToCheck.map(removeTrailingSlash);

	for (const url of urlsWithoutTrailingSlash) {
		consola.info(`Checking: ${url}`);
		const $ = await getCheerioInstanceFromResource(url);
		const allLinks = $("a");

		const sameDomainLinks = getCorrectLinksWithoutTrailingSlash(url, allLinks);
		const linksWithoutDuplicates = removeDuplicates(sameDomainLinks);

		consola.success(`Found ${linksWithoutDuplicates.length} links on page`);

		urlsMap[url] = linksWithoutDuplicates;
		visitedLinks.push(url);

		const linksToCrawlFromUrl = linksWithoutDuplicates.filter(
			(el) =>
				!hasExtension(el) &&
				areSameDomain(url, el) &&
				!visitedLinks.includes(el)
		);

		linksToCrawl.push(...linksToCrawlFromUrl);
	}

	const linksToCrawlWithoutDuplicates = removeDuplicates(linksToCrawl);
	const withoutVisited = removeVisitedUrls(
		linksToCrawlWithoutDuplicates,
		visitedLinks
	);

	consola.info(`Found ${withoutVisited.length} new links`);
	return exploreSite(withoutVisited, visitedLinks, urlsMap);
};

const removeVisitedUrls = (urls: string[], visitedUrls: string[]) =>
	urls.filter((url) => !visitedUrls.includes(url));

const getCheerioInstanceFromResource = async (url: string) => {
	const result = await fetch(url).then((body) => body.text());
	return load(result);
};

const getCorrectLinksWithoutTrailingSlash = (
	url: string,
	allLinks: Cheerio<Element>
) => {
	return allLinks
		.map((_, el) => {
			return el.attributes.flatMap((attribute) => {
				const trimmed = attribute.value.trim();
				const withoutTrailingSlash = removeTrailingSlash(trimmed);

				const encoded = tryEncodeURI(withoutTrailingSlash);

				if (
					attribute.name === "href" &&
					url !== withoutTrailingSlash &&
					isCorrectUrl(trimmed)
				) {
					return [encoded];
				}

				return [];
			});
		})
		.toArray();
};
