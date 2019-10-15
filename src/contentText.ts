import * as core from "express-serve-static-core";

export default interface ContentText{
    req: core.Request,
    res: core.Response,
    service: any
}