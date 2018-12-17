import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";

import {mongoUrl} from "./config/db";

(mongoose as any).Promise = global.Promise;

/**
 * App routes
 */
import AppRouters from "./app.routes";
import UserRouters from "./components/user/user.routes";
import SkillsRouters from "./components/skills/skills.routes";
import SocialRouters from "./components/social_links/social_links.routes";
import LanguagesRouters from "./components/languages/languages.routes";

class App {

    public app: express.Application;

    public mongoUrl = mongoUrl;

    constructor() {
        this.app = express();

        this.middleware();

        this.routes();

        this.mongoSetup();

        this.app.use(App.handleError);
    }

    private mongoSetup(): void{
        mongoose.connect(this.mongoUrl, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
        }, () => {

        });
    }

    static handleError(err, req, res, next){
        const output: any = {
            "success": false,
            "data": null,
            "error": {
                "code": err.status,
                "message": err.message
            }
        };
        const statusCode = err.status || 500;
        res.status(statusCode).json(output);
    }

    private middleware(): void {

        /**
         * support application/json type post data
         */
        this.app.use(bodyParser.json());

        /**
         * support application/x-www-form-urlencoded post data
         */
        this.app.use(bodyParser.urlencoded({extended: false}));

    }


    /**
     * Configure API endpoints.
     */
    private routes(): void {

        this.app.use('/', AppRouters);
        this.app.use('/user', UserRouters);
        this.app.use('/skills', SkillsRouters);
        this.app.use('/socials', SocialRouters);
        this.app.use('/languages', LanguagesRouters);

    }

}

export default new App().app;