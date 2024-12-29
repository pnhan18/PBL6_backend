import { grantAccess } from "../middlewares/permission.middleware";
import CatchAsync from "../utils/CatchAsync";
import BaseRouter from "./base.router";
import { authentication } from "../middlewares/auth.middleware";
import { RecognitionHistoryController } from "../controllers/recognitionHistory.controller";

class RecognitionHistoryRouter extends BaseRouter {
  constructor() {
    super(new RecognitionHistoryController());
  }
  routes(): void {
    this.router
      .route("/:user_id")
      .get(
        authentication,
        grantAccess("readOwn", "recognition-history"),
        CatchAsync(this.controller.getRecognitionHistory)
      );
  }
}

export default new RecognitionHistoryRouter().router;