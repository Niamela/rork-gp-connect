import { publicProcedure } from "../../create-context.js";
import { z } from "zod";
import { db } from "../../../db/storage.js";
import { TRPCError } from "@trpc/server";

export const loginProcedure = publicProcedure
  .input(
    z.object({
      contact: z.string(),
      password: z.string(),
    })
  )
  .query(async ({ input }) => {
    console.log("[Backend] Login attempt with contact:", input.contact);

    const user = db.users.findByContact(input.contact);

    if (!user) {
      console.log("[Backend] User not found for contact:", input.contact);
      return null;
    }

    if (user.password !== input.password) {
      console.log("[Backend] Invalid password for contact:", input.contact);
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Mot de passe incorrect"
      });
    }

    console.log("[Backend] User found:", user);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

export default loginProcedure;
