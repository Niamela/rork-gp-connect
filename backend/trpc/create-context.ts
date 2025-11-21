import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC } from "@trpc/server";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  return {
    req: opts.req,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Temporarily removing superjson transformer to fix ES module issues
// TODO: Re-add transformer with proper ES module handling
const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
