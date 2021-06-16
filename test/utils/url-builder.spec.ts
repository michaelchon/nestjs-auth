import { UrlBuilder } from "./url-builder";

describe("url builder", () => {
    const urlBuilder = new UrlBuilder("/users");

    it("should build url", () => {
        const url = urlBuilder.build("/register");

        expect(url).toBe("/users/register");
    });

    it("should build nested url", () => {
        const url = urlBuilder.build("/1/edit");

        expect(url).toBe("/users/1/edit");
    });
});
