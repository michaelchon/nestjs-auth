export interface IHash {
    (value: string): Promise<string>;
}

export interface ICompareHash {
    (values: { plain: string; hash: string }): Promise<boolean>;
}

export interface IValidateUuid {
    (uuid: string): boolean;
}
