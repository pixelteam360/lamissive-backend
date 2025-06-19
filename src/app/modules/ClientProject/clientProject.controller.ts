import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { ClientProjectService } from "./clientProject.service";
import { clientProjectFilterableFields } from "./clientProject.costant";

const createClientProject = catchAsync(async (req, res) => {
  const result = await ClientProjectService.createClientProject(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "ClientProject Created successfully!",
    data: result,
  });
});

const getClientProjects = catchAsync(async (req, res) => {
  const filters = pick(req.query, clientProjectFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await ClientProjectService.getClientProjectsFromDb(
    filters,
    options
  );
  sendResponse(res, {
    message: "ClientProjects retrieve successfully!",
    data: result,
  });
});

const getSingleClientProject = catchAsync(async (req, res) => {
  const result = await ClientProjectService.getSingleClientProject(
    req.params.id
  );
  sendResponse(res, {
    message: "ClientProject profile retrieved successfully",
    data: result,
  });
});

const getMyProjects = catchAsync(async (req, res) => {
  const result = await ClientProjectService.getMyProjects(req.user.id);
  sendResponse(res, {
    message: "Projects retrieved successfully!",
    data: result,
  });
});

const confirmApplicant = catchAsync(async (req, res) => {
  const result = await ClientProjectService.confirmApplicant(
    req.body,
    req.params.id,
    req.user.id
  );
  sendResponse(res, {
    message: "Applicant confirm successfully!",
    data: result,
  });
});

const rejectApplicant = catchAsync(async (req, res) => {
  const result = await ClientProjectService.rejectApplicant(req.params.id);
  sendResponse(res, {
    message: "Applicant rejected successfully!",
    data: result,
  });
});

export const ClientProjectController = {
  createClientProject,
  getClientProjects,
  getSingleClientProject,
  getMyProjects,
  confirmApplicant,
  rejectApplicant
};
