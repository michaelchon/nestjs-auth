import { ITransport } from "./transport.interface";

export interface ICreateTransport {
    (email: string, password: string): ITransport;
}
