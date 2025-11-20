import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import createProfileProcedure from "./routes/users/create-profile";
import getProfileProcedure from "./routes/users/get-profile";
import updateProfileProcedure from "./routes/users/update-profile";
import subscribeGpProcedure from "./routes/users/subscribe-gp";
import loginProcedure from "./routes/users/login";
import createRequestProcedure from "./routes/requests/create-request";
import getAllRequestsProcedure from "./routes/requests/get-all-requests";
import getUserRequestsProcedure from "./routes/requests/get-user-requests";
import deleteRequestProcedure from "./routes/requests/delete-request";
import createTravelProcedure from "./routes/travels/create-travel";
import getAllTravelsProcedure from "./routes/travels/get-all-travels";
import getGpTravelsProcedure from "./routes/travels/get-gp-travels";
import updateTravelProcedure from "./routes/travels/update-travel";
import deleteTravelProcedure from "./routes/travels/delete-travel";
import createConversationProcedure from "./routes/messages/create-conversation";
import getConversationsProcedure from "./routes/messages/get-conversations";
import getMessagesProcedure from "./routes/messages/get-messages";
import sendMessageProcedure from "./routes/messages/send-message";
import markAsReadProcedure from "./routes/messages/mark-as-read";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  users: createTRPCRouter({
    createProfile: createProfileProcedure,
    getProfile: getProfileProcedure,
    updateProfile: updateProfileProcedure,
    subscribeGp: subscribeGpProcedure,
    login: loginProcedure,
  }),
  requests: createTRPCRouter({
    create: createRequestProcedure,
    getAll: getAllRequestsProcedure,
    getUserRequests: getUserRequestsProcedure,
    delete: deleteRequestProcedure,
  }),
  travels: createTRPCRouter({
    create: createTravelProcedure,
    getAll: getAllTravelsProcedure,
    getGpTravels: getGpTravelsProcedure,
    update: updateTravelProcedure,
    delete: deleteTravelProcedure,
  }),
  messages: createTRPCRouter({
    createConversation: createConversationProcedure,
    getConversations: getConversationsProcedure,
    getMessages: getMessagesProcedure,
    sendMessage: sendMessageProcedure,
    markAsRead: markAsReadProcedure,
  }),
});

export type AppRouter = typeof appRouter;
