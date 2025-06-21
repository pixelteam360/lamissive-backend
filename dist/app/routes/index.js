"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/Auth/auth.routes");
const user_routes_1 = require("../modules/User/user.routes");
const userProfile_routes_1 = require("../modules/UserProfile/userProfile.routes");
const clientProject_routes_1 = require("../modules/ClientProject/clientProject.routes");
const serviceProvider_routes_1 = require("../modules/ServiceProvider/serviceProvider.routes");
const job_routes_1 = require("../modules/Job/job.routes");
const subscription_routes_1 = require("../modules/Subscription/subscription.routes");
const purchasedSubscription_routes_1 = require("../modules/PurchasedSubscription/purchasedSubscription.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/user-profile",
        route: userProfile_routes_1.UserProfileRoutes,
    },
    {
        path: "/client-Project",
        route: clientProject_routes_1.ClientProjectRoutes,
    },
    {
        path: "/jobs",
        route: job_routes_1.JobRoutes,
    },
    {
        path: "/service-provider",
        route: serviceProvider_routes_1.ServiceProviderRoutes,
    },
    {
        path: "/subscription",
        route: subscription_routes_1.SubscriptionRoutes,
    },
    {
        path: "/purchased-subscription",
        route: purchasedSubscription_routes_1.PurchasedSubscriptionRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
