import { Controller } from "./base";
import { blueprint } from "../blueprint";
export default class User extends Controller{
    async user() {
        let a=this.contextText.service.userService.index();
        this.contextText.res.send('444'+a);
        // this.ctx.body = 'hello user';
        // this.ctx.body = this.ctx.service.userService.index();//注意看这里
    }

    @blueprint.get('/test')
    async userInfo() {
        this.contextText.res.send('我是装饰器');
    }
}