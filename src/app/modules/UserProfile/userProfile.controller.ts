import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserProfileService } from "./userProfile.service";

const createUserProfile = catchAsync(async (req, res) => {
  const result = await UserProfileService.createClietnProfile(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Client profile created successfully!",
    data: result,
  });
});

const updateClietnProfile = catchAsync(async (req, res) => {
  const result = await UserProfileService.updateClietnProfile(
    req.body,
    req.file,
    req.user.id
  );
  sendResponse(res, {
    message: "Client profile updated successfully!",
    data: result,
  });
});

const createEmployerProfile = catchAsync(async (req, res) => {
  const result = await UserProfileService.createEmployerProfile(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Emploer profile created successfully!",
    data: result,
  });
});

const updateEmployerProfile = catchAsync(async (req, res) => {
  const result = await UserProfileService.updateEmployerProfile(
    req.body,
    req.file,
    req.user.id
  );
  sendResponse(res, {
    message: "Client profile updated successfully!",
    data: result,
  });
});

const createServiceProviderProfile = catchAsync(async (req, res) => {
  const result = await UserProfileService.createServiceProviderProfile(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Service provider profile created successfully!",
    data: result,
  });
});

const updateServiceProviderProfile = catchAsync(async (req, res) => {
  const result = await UserProfileService.updateServiceProviderProfile(
    req.body,
    req.file,
    req.user.id
  );
  sendResponse(res, {
    message: "Service provider updated successfully!",
    data: result,
  });
});

const createConciergeProfile = catchAsync(async (req, res) => {
  const result = await UserProfileService.createConciergeProfile(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Concierge profile created successfully!",
    data: result,
  });
});

const updateConciergeProfile = catchAsync(async (req, res) => {
  const result = await UserProfileService.updateConciergeProfile(
    req.body,
    req.file,
    req.user.id
  );
  sendResponse(res, {
    message: "Concierge updated successfully!",
    data: result,
  });
});

export const UserProfileController = {
  createUserProfile,
  updateClietnProfile,
  createEmployerProfile,
  updateEmployerProfile,
  createServiceProviderProfile,
  updateServiceProviderProfile,
  createConciergeProfile,
  updateConciergeProfile,
};
