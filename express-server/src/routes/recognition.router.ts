import { uploadDisk } from "../config/multer.config";
import { RecognitionController } from "../controllers/recognition.controller";
import { authentication } from "../middlewares/auth.middleware";
import CatchAsync from "../utils/CatchAsync";
import BaseRouter from "./base.router";

class RecognitionRouter extends BaseRouter {
  constructor() {
    super(new RecognitionController());
  }
  routes(): void {
    this.router.post(
      "/",
      authentication,
      uploadDisk.single("video"),
      CatchAsync(this.controller.recognitionVideo)
    );
  }
}

export default new RecognitionRouter().router;
