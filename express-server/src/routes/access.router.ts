import BaseRouter from "./base.router";
import { AccessController } from "../controllers/access.controller";
import CatchAsync from "../utils/CatchAsync";
import { authentication } from "../middlewares/auth.middleware";
import { signUp } from "../validators/user.validate";
import { grantAccess } from "../middlewares/permission.middleware";
import passport from "passport";

class AccessRouter extends BaseRouter {
  constructor() {
    super(new AccessController());
  }
  routes(): void {
    this.router.post("/signup", signUp, CatchAsync(this.controller.signUp));
    this.router.post("/login", CatchAsync(this.controller.logIn));
    this.router.post(
      "/get-access-token",
      CatchAsync(this.controller.getAccessToken)
    );
    this.router.post(
      "/forgot-password",
      CatchAsync(this.controller.forgotPassword)
    );
    this.router.patch(
      "/reset-password",
      CatchAsync(this.controller.resetPassword)
    );
    this.router.get(
      "/google",
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );
    this.router.get(
      "/google/callback",
      passport.authenticate("google", { session: false }),
      CatchAsync(this.controller.logInWithGoogle)
    );
    /////// Authenticated routes
    this.router.post(
      "/logout",
      authentication,
      CatchAsync(this.controller.logOut)
    );
    this.router.patch(
      "/change-password",
      authentication,
      CatchAsync(this.controller.changePassword)
    );
  }
}

export default new AccessRouter().router;
