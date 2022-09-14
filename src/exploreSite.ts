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
	const withoutVisited = removeVisitedUrls(urlsToCheck, visitedLinks);

	for (const url of withoutVisited) {
		consola.info(`Checking: ${url}`);
		const $ = await getCheerioInstanceFromResource(url);
		const allLinks = $("a");

		const sameDomainLinks = getCorrectLinksWithoutTrailingSlash(url, allLinks);
		const linksWithoutDuplicates = removeDuplicates(sameDomainLinks);

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

	return exploreSite(newLinksWithoutDuplicates, visitedLinks, urlsMap);
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
				const value = removeTrailingSlash(attribute.value);
				return attribute.name === "href" && url !== value && isCorrectUrl(value)
					? [value]
					: [];
			});
		})
		.toArray();
};
