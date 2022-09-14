export const removeTrailingSlash = (str: string) => {
	return str.replace(/\/+$/, "");
};

function getDomain(url: string) {
	const prefix = /^https?:\/\//i;
	const domain = /^[^/:]+/;

	const withoutPrefix = url.replace(prefix, "");

	const match = withoutPrefix.match(domain);

	if (match) {
		return match[0];
	}
	return null;
}

export const areSameDomain = (url1: string, url2: string) => {
	return getDomain(url1) === getDomain(url2);
};

export const hasExtension = (url: string) => {
	const extension = /\.[0-9a-z]+$/i;
	return extension.test(url);
};

export const removeDuplicates = <T>(arr: T[]) => {
	return Array.from(new Set(arr));
};
