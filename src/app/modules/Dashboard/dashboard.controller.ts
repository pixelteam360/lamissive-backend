import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { dashboardService } from "./dashboard.service";

const overView = catchAsync(async (req, res) => {
  const result = await dashboardService.overView();
  sendResponse(res, {
    message: "Dashboard overview retrieved successfully!",
    data: result,
  });
});

const createFees = catchAsync(async (req, res) => {
  const result = await dashboardService.createFees(req.body);
  sendResponse(res, {
    message: "Fees created successfully!",
    data: result,
  });
});

const getFees = catchAsync(async (req, res) => {
  const result = await dashboardService.getFees();
  sendResponse(res, {
    message: "Fees retrieved successfully!",
    data: result,
  });
});

const updateFees = catchAsync(async (req, res) => {
  const result = await dashboardService.updateFees(req.params.id, req.body);
  sendResponse(res, {
    message: "Fees updated successfully!",
    data: result,
  });
});

export const DashboardController = {
  overView,
  createFees,
  getFees,
  updateFees,
};
