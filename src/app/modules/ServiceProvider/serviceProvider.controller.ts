import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { ServiceProviderFilterableFields } from "./serviceProvider.costant";
import { ServiceProviderService } from "./serviceProvider.service";

const applyToProject = catchAsync(async (req, res) => {
  const result = await ServiceProviderService.applyToProject(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Project applyed successfully!",
    data: result,
  });
});

const applyToJob = catchAsync(async (req, res) => {
  const data = JSON.parse(req.body.data);
  const result = await ServiceProviderService.applyToJob(
    data,
    req.file,
    req.user.id
  );
  sendResponse(res, {
    message: "Job applyed successfully!",
    data: result,
  });
});

const rateServiceProvider = catchAsync(async (req, res) => {
  const result = await ServiceProviderService.rateServiceProvider(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Rated Service provider successfully!",
    data: result,
  });
});

const getAllServiceProvider = catchAsync(async (req, res) => {
  const filters = pick(req.query, ServiceProviderFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await ServiceProviderService.getAllServiceProvider(
    filters,
    options,
    req.user.id,
    req.user.role
  );
  sendResponse(res, {
    message: "ServiceProviders retrieved successfully",
    data: result,
  });
});

const getSingleServiceProvide = catchAsync(async (req, res) => {
  const result = await ServiceProviderService.getSingleServiceProvide(
    req.params.id
  );
  sendResponse(res, {
    message: "ServiceProvider retrieved  successfully!",
    data: result,
  });
});

const myWorkschedule = catchAsync(async (req, res) => {
  const result = await ServiceProviderService.myWorkschedule(
    req.params.id
  );
  sendResponse(res, {
    message: "ServiceProvider schedule retrieved  successfully!",
    data: result,
  });
});

const myProjects = catchAsync(async (req, res) => {
  const result = await ServiceProviderService.myProjects(
    req.user.id
  );
  sendResponse(res, {
    message: "ServiceProvider project retrieved  successfully!",
    data: result,
  });
});

export const ServiceProviderController = {
  applyToProject,
  applyToJob,
  getAllServiceProvider,
  getSingleServiceProvide,
  rateServiceProvider,
  myWorkschedule,
  myProjects
};
