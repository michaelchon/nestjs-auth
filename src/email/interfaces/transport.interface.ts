export interface ITransport {
    sendEmail: (options: {
        from: string;
        to: string;
        subject: string;
        html: string;
    }) => Promise<any>;
}
