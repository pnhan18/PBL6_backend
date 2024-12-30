import { grantAccess } from "../middlewares/permission.middleware";
import CatchAsync from "../utils/CatchAsync";
import BaseRouter from "./base.router";
import { authentication } from "../middlewares/auth.middleware";
import { SignLanguageController } from "../controllers/signLanguage.controller";
import { uploadDisk } from "../config/multer.config";

class SignLanguageRouter extends BaseRouter {
  constructor() {
    super(new SignLanguageController());
  }
  routes(): void {
    this.router
      .route("/")
      .get(authentication, CatchAsync(this.controller.getSignLanguages))
      .post(authentication, uploadDisk.single("video"),CatchAsync(this.controller.addSignLanguage));
    this.router.route('/:id').delete(authentication, CatchAsync(this.controller.deleteSignLanguage));
  }
}

export default new SignLanguageRouter().router;
