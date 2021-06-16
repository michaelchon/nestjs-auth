export class UrlBuilder {
    constructor(private readonly prefix: string) {}

    build(suffix: string) {
        return this.prefix + suffix;
    }
}
