"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientProjectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const clientProject_controller_1 = require("./clientProject.controller");
const clientProject_validation_1 = require("./clientProject.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .route("/")
    .get(clientProject_controller_1.ClientProjectController.getClientProjects)
    .post((0, auth_1.default)(client_1.UserRole.CLIENT, client_1.UserRole.EMPLOYER), (0, validateRequest_1.default)(clientProject_validation_1.ClientProjectValidation.CreateClientProjectValidationSchema), clientProject_controller_1.ClientProjectController.createClientProject);
router
    .route("/direct-hire")
    .post((0, auth_1.default)(client_1.UserRole.CLIENT, client_1.UserRole.EMPLOYER), (0, validateRequest_1.default)(clientProject_validation_1.ClientProjectValidation.CreateClientProjectValidationSchema), clientProject_controller_1.ClientProjectController.directHire);
router
    .route("/my")
    .get((0, auth_1.default)(client_1.UserRole.CLIENT, client_1.UserRole.EMPLOYER), clientProject_controller_1.ClientProjectController.getMyProjects);
router
    .route("/:id")
    .get((0, auth_1.default)(), clientProject_controller_1.ClientProjectController.getSingleClientProject)
    .put((0, auth_1.default)(client_1.UserRole.CLIENT, client_1.UserRole.EMPLOYER), (0, validateRequest_1.default)(clientProject_validation_1.ClientProjectValidation.confirmApplicantSchema), clientProject_controller_1.ClientProjectController.confirmApplicant)
    .patch((0, auth_1.default)(client_1.UserRole.CLIENT, client_1.UserRole.EMPLOYER), clientProject_controller_1.ClientProjectController.rejectApplicant)
    .delete((0, auth_1.default)(client_1.UserRole.CLIENT, client_1.UserRole.EMPLOYER), clientProject_controller_1.ClientProjectController.cancelProject);
exports.ClientProjectRoutes = router;
