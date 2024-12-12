import { uploadMemory } from "../config/multer.config";
import UserController from "../controllers/user.controller";
import { authentication } from "../middlewares/auth.middleware";
import { grantAccess } from "../middlewares/permission.middleware";
import CatchAsync from "../utils/CatchAsync";
import BaseRouter from "./base.router";


class UserRouter extends BaseRouter {
    constructor() {
        super(new UserController());
    }
    routes(): void {
        this.router.route("/").get(authentication, grantAccess("readAny", "users"),CatchAsync(this.controller.getUsers));
        this.router
          .route("/:user_id")
          .get(authentication, CatchAsync(this.controller.getUserById))
          .patch(authentication, grantAccess("updateOwn", "users"), CatchAsync(this.controller.updateUserById));
        
        this.router
          .route("/:user_id/change-avatar")
          .patch(authentication, grantAccess("createOwn", "users"), uploadMemory.single("file"), CatchAsync(this.controller.changeAvatar));
    }
}

export default new UserRouter().router;