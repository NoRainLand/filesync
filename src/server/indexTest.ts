import { HttpServer } from "./HttpServer";

export class indexTest {
    constructor(){
        HttpServer.startServer(4110);
    }
}
new indexTest();