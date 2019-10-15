import * as fs from "fs";
import express from "express";
import * as core from "express-serve-static-core";
import { Router } from "express";
import ContentText from "./contentText";
import { blueprint } from './blueprint';

export class Loader {
    router: Router = express.Router();
    controller: any = {};
    app: core.Express;
    contentText: ContentText = { req: null, res: null, service: null };

    constructor(app: core.Express) {
        this.app = app;
    }

    loadService() {
        const service = fs.readdirSync(__dirname + '/service');
        Object.defineProperty(this.contentText, 'service', {
            get() {
                if (!(<any>this)['cache']) {
                    (<any>this)['cache'] = {};
                }
                const loaded = (<any>this)['cache'];
                if (!loaded['service']) {
                    loaded['service'] = {};
                    service.forEach((d) => {
                        const name = d.split('.')[0];
                        if (name !== "baseService") {
                            const mod = require(__dirname + '/service/' + d);
                            loaded['service'][name] = new mod(this);
                        }
                    });
                    return loaded.service;
                }
                return loaded.service;
            }
        });
    }

    loadController() {
        const dirs = fs.readdirSync(__dirname + '/controller');
        dirs.forEach((filename) => {
            const property = filename.split('.')[0];
            const mod = require(__dirname + '/controller/' + filename).default;
            if (mod) {
                // constructor
                // user
                // userInfo
                const methodNames = Object.getOwnPropertyNames(mod.prototype).filter((names) => {
                    if (names !== 'constructor') {
                        return names;
                    }
                });

                // Object.defineProperty(obj, prop, descriptor)
                // property即：controller中default定义模块的命名，作为新定义的属性。
                // this.controller即：app中new的loader对象的controller对象。
                Object.defineProperty(this.controller, property, {
                    get() {
                        const merge: { [key: string]: any } = {};
                        methodNames.forEach((name) => {
                            merge[name] = {
                                type: mod,
                                methodName: name
                            }
                        });
                        console.log(merge, 22);
                        return merge;
                    }
                });
            }
        });

    }

    loadRouter() {
        this.loadController();
        this.loadService();
        const mod = require(__dirname + '/routers.js');
        const routers = mod(this.controller);//初始化routers.ts中的路由配置

        // { 'get /': { type: [Function: User], methodName: 'user' },
        //   'get /userinfo': { type: [Function: User], methodName: 'userInfo' } }
        // Object.keys(routers).forEach((key) => {
        //     const [method, path] = key.split(' ');
        //     (<any>this.router)[method](path, (req: any, res: any) => {
        //         const _class = routers[key].type;
        //         const handler = routers[key].methodName;
        //         this.contentText.req=req;
        //         this.contentText.res=res;
        //         const instance = new _class(this.contentText);
        //         instance[handler]();
        //     })
        // })
        // return this.router;

        const r = blueprint.getRoute();
        Object.keys(r).forEach((url) => {
            r[url].forEach((object) => {
                (<any>this.router)[object.httpMethod](url, async (req: any, res: any) => {
                    this.contentText.req = req;
                    this.contentText.res = res;
                    const instance = new object.constructor(this.contentText,this.app);
                    await instance[object.handler]();
                })
            })
        });
        return this.router;
    }
}