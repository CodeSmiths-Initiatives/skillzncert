/**
 * enrollment controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::enrollment.enrollment",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("Login required");
      }

      // 🔒 Prevent duplicate enrollment per user
      const existing = await strapi.entityService.findMany(
        "api::enrollment.enrollment",
        {
          filters: { user: user.id },
        }
      );

      if (existing.length > 0) {
        return ctx.badRequest(
          "Enrollment already exists for this user"
        );
      }

      // 🔐 Attach user securely
      ctx.request.body.data.user = user.id;

      return super.create(ctx);
    },
  })
);
