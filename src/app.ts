import express from "express";
import path from "path";
import { Loader } from './loader';

const app = express();

app.set("port", process.env.PORT || 3100);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

const loader = new Loader(app);//注意这里将app实例，传给loader

app.use('/',loader.loadRouter());
export default app;