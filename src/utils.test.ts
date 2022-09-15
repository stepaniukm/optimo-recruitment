import {
	areSameDomain,
	tryEncodeURI,
	getDomain,
	hasExtension,
	isCorrectUrl,
	removeDuplicates,
	removeTrailingSlash,
} from "./utils.js";

describe("Utils", () => {
	describe("removeTrailingSlash", () => {
		it("correctly removes trailing slash", () => {
			const before = "https://example.com/";
			const after = "https://example.com";

			expect(removeTrailingSlash(before)).toBe(after);
		});
		it("does not remove trailing slash if not present", () => {
			const before = "https://example.com";
			const after = "https://example.com";

			expect(removeTrailingSlash(before)).toBe(after);
		});
	});

	describe("getDomain", () => {
		it("gets domain from url", () => {
			const url = "https://example.com";
			const domain = "example.com";

			expect(getDomain(url)).toBe(domain);
		});
		it("gets domain from url with path", () => {
			const url = "https://example.com/path";
			const domain = "example.com";

			expect(getDomain(url)).toBe(domain);
		});
		it("gets domain from url with port", () => {
			const url = "https://example.com:8080";
			const domain = "example.com";

			expect(getDomain(url)).toBe(domain);
		});
		it("gets domain from url with port and path", () => {
			const url = "https://example.com:8080/path";
			const domain = "example.com";

			expect(getDomain(url)).toBe(domain);
		});
		it("gets domain from url with port and path and query", () => {
			const url = "https://example.com:8080/path?query";
			const domain = "example.com";

			expect(getDomain(url)).toBe(domain);
		});
		it("gets domain from subdomain", () => {
			const url = "https://subdomain.example.com";
			const domain = "subdomain.example.com";

			expect(getDomain(url)).toBe(domain);
		});
		it("returns null if string is not a domain", () => {
			const url = ":sad:";

			expect(getDomain(url)).toBeNull();
		});
	});

	describe("areSameDomain", () => {
		it("returns true if domains are the same", () => {
			const url1 = "https://example.com";
			const url2 = "https://example.com/test";

			expect(areSameDomain(url1, url2)).toBe(true);
		});
		it("returns false if domains are different", () => {
			const url1 = "https://example.com";
			const url2 = "https://example2.com/test";

			expect(areSameDomain(url1, url2)).toBe(false);
		});
		it("returns false if domains are different with subdomain", () => {
			const url1 = "https://example.com";
			const url2 = "https://subdomain.example.com";

			expect(areSameDomain(url1, url2)).toBe(false);
		});
	});

	describe("hasExtensions", () => {
		it("returns true if url has extension", () => {
			const url = "https://example.com/test.jpg";

			expect(hasExtension(url)).toBe(true);
		});
		it("returns false if url has no extension", () => {
			const url = "https://example.com/test";

			expect(hasExtension(url)).toBe(false);
		});
	});

	describe("removeDuplicates", () => {
		it("removes duplicates", () => {
			const arr = [1, 2, 3, 1, 2, 3];

			expect(removeDuplicates(arr)).toEqual([1, 2, 3]);
		});
	});

	describe("isCorrectUrl", () => {
		it.each([
			["https://example.com", true],
			["https://example.com/", true],
			["https://example.com/test", true],
			["https://example.com/test/", true],
			["https://example.com/test.jpg", true],
			["https://example.com/test.jpg/", true],
			["https://example.com/test.jpg?query", true],
			["https://example.com/test.jpg?query=", true],
			["https://example.com/test.jpg?query=1", true],
			["https://example.com/test.jpg?query=1&query2=2", true],
		])("returns true for %s", (url, expected) => {
			expect(isCorrectUrl(url)).toBe(expected);
		});

		it.each([
			["javascript:void", false],
			["qweqiuhih", false],
			["ht\tps://example.com/test.jp", false],
		])("returns false for %s", (url, expected) => {
			expect(isCorrectUrl(url)).toBe(expected);
		});
	});

	describe("tryEncodeURI", () => {
		it("encodes url if necessary", () => {
			const url = "https://example.com/тест";
			const encodedUrl = "https://example.com/%D1%82%D0%B5%D1%81%D1%82";

			expect(tryEncodeURI(url)).toBe(encodedUrl);
		});
		it("does not encode url if not necessary", () => {
			const url = "https://example.com/%D1%82%D0%B5%D1%81%D1%82";

			expect(tryEncodeURI(url)).toBe(url);
		});
	});
});
