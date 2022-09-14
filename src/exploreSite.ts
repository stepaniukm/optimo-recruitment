import fetch from "node-fetch";
import { Cheerio, Element, load } from "cheerio";
import consola from "consola";
import {
	hasExtension,
	removeDuplicates,
	removeTrailingSlash,
	areSameDomain,
	isCorrectUrl,
} from "./utils.js";

export const exploreSite = async (
	urlsToCheck: string[],
	visitedLinks: string[] = [],
	urlsMap: Record<string, string[]> = {}
): Promise<Record<string, string[]>> => {
	if (urlsToCheck.length === 0) {
		return urlsMap;
	}
	const newLinks: string[] = [];

	for (const url of urlsToCheck.map(removeTrailingSlash)) {
		consola.info(`Checking: ${url}`);
		const $ = await getCheerioInstanceFromResource(url);
		const allLinks = $("a");

		const sameDomainLinks = getCorrectLinksWithoutTrailingSlash(url, allLinks);
		const linksWithoutDuplicates = removeDuplicates(sameDomainLinks);

		consola.success(`Found ${linksWithoutDuplicates.length} links on page`);

		urlsMap[url] = linksWithoutDuplicates;
		visitedLinks.push(url);

		const newPreparedLinks = linksWithoutDuplicates.filter(
			(el) =>
				!hasExtension(el) &&
				areSameDomain(url, el) &&
				!visitedLinks.includes(el)
		);

		newLinks.push(...newPreparedLinks);
	}

	const newLinksWithoutDuplicates = removeDuplicates(newLinks);
	const withoutVisited = removeVisitedUrls(
		newLinksWithoutDuplicates,
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
				const value = removeTrailingSlash(attribute.value.trim());

				if (attribute.name === "href" && url !== value && isCorrectUrl(value)) {
					return [value];
				}

				return [];
			});
		})
		.toArray();
};
