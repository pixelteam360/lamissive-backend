import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { UserProfileRoutes } from "../modules/UserProfile/userProfile.routes";
import { ClientProjectRoutes } from "../modules/ClientProject/clientProject.routes";
import { ServiceProviderRoutes } from "../modules/ServiceProvider/serviceProvider.routes";
import { JobRoutes } from "../modules/Job/job.routes";
import { SubscriptionRoutes } from "../modules/Subscription/subscription.routes";
import { PurchasedSubscriptionRoutes } from "../modules/PurchasedSubscription/purchasedSubscription.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user-profile",
    route: UserProfileRoutes,
  },
  {
    path: "/client-Project",
    route: ClientProjectRoutes,
  },
  {
    path: "/jobs",
    route: JobRoutes,
  },
  {
    path: "/service-provider",
    route: ServiceProviderRoutes,
  },
  {
    path: "/subscription",
    route: SubscriptionRoutes,
  },
  {
    path: "/purchased-subscription",
    route: PurchasedSubscriptionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
