export interface IGenerateCode {
    (): string;
}

export interface IHash {
    (value: string): Promise<string>;
}
