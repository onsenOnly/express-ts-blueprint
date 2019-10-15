import ContentText from "../contentText";
import * as core from "express-serve-static-core";
export class Controller {
    contextText: ContentText;
    app: core.Express;
    constructor(contextText: ContentText, app: core.Express) {
        this.contextText = contextText;
        this.app = app;
    }
}