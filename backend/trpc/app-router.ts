import { createTRPCRouter } from "./create-context.js";
import hiRoute from "./routes/example/hi/route.js";
import createProfileProcedure from "./routes/users/create-profile.js";
import getProfileProcedure from "./routes/users/get-profile.js";
import updateProfileProcedure from "./routes/users/update-profile.js";
import subscribeGpProcedure from "./routes/users/subscribe-gp.js";
import loginProcedure from "./routes/users/login.js";
import createRequestProcedure from "./routes/requests/create-request.js";
import getAllRequestsProcedure from "./routes/requests/get-all-requests.js";
import getUserRequestsProcedure from "./routes/requests/get-user-requests.js";
import deleteRequestProcedure from "./routes/requests/delete-request.js";
import createTravelProcedure from "./routes/travels/create-travel.js";
import getAllTravelsProcedure from "./routes/travels/get-all-travels.js";
import getGpTravelsProcedure from "./routes/travels/get-gp-travels.js";
import updateTravelProcedure from "./routes/travels/update-travel.js";
import deleteTravelProcedure from "./routes/travels/delete-travel.js";
import createConversationProcedure from "./routes/messages/create-conversation.js";
import getConversationsProcedure from "./routes/messages/get-conversations.js";
import getMessagesProcedure from "./routes/messages/get-messages.js";
import sendMessageProcedure from "./routes/messages/send-message.js";
import markAsReadProcedure from "./routes/messages/mark-as-read.js";
import createShipmentProcedure from "./routes/shipments/create-shipment.js";
import updateShipmentStatusProcedure from "./routes/shipments/update-status.js";
import getUserShipmentsProcedure from "./routes/shipments/get-user-shipments.js";
import getGpShipmentsProcedure from "./routes/shipments/get-gp-shipments.js";

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
  shipments: createTRPCRouter({
    create: createShipmentProcedure,
    updateStatus: updateShipmentStatusProcedure,
    getUserShipments: getUserShipmentsProcedure,
    getGpShipments: getGpShipmentsProcedure,
  }),
});

export type AppRouter = typeof appRouter;
