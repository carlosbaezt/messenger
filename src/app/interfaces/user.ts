export interface User {
    nick: string;
    // el operador "?" permite hacer los campos opcionales.
    subnick?: string;
    age?: number;
    email: string;
    uid: any;
    status?: string;
    avatar?: string;
    friends?: any[];
}
