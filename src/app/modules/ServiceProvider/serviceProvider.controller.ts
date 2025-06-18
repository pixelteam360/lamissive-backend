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
    message: "Profile updated successfully!",
    data: result,
  });
});

const rateServiceProvider = catchAsync(async (req, res) => {
  const result = await ServiceProviderService.rateServiceProvider(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Rate Service provider successfully!",
    data: result,
  });
});

const getAllServiceProvider = catchAsync(async (req, res) => {
  const filters = pick(req.query, ServiceProviderFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await ServiceProviderService.getAllServiceProvider(
    filters,
    options
  );
  sendResponse(res, {
    message: "ServiceProvider profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { id } = req?.user;
  const result = await ServiceProviderService.updateProfile(
    req.body,
    req.file,
    id
  );
  sendResponse(res, {
    message: "Profile updated successfully!",
    data: result,
  });
});

export const ServiceProviderController = {
  applyToProject,
  getAllServiceProvider,
  updateProfile,
  rateServiceProvider,
};
