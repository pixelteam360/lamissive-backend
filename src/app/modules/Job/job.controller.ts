import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { JobService } from "./job.service";
import { jobFilterableFields } from "./job.costant";

const createJob = catchAsync(async (req, res) => {
  const result = await JobService.createJob(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Job Created successfully!",
    data: result,
  });
});

const getJobs = catchAsync(async (req, res) => {
  const filters = pick(req.query, jobFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await JobService.getJobsFromDb(
    filters,
    options
  );
  sendResponse(res, {
    message: "Jobs retrieve successfully!",
    data: result,
  });
});

const getSingleJob = catchAsync(async (req, res) => {
  const result = await JobService.getSingleJob(
    req.params.id
  );
  sendResponse(res, {
    message: "Job profile retrieved successfully",
    data: result,
  });
});

const getMyProjects = catchAsync(async (req, res) => {
  const result = await JobService.getMyProjects(req.user.id);
  sendResponse(res, {
    message: "Projects retrieved successfully!",
    data: result,
  });
});

const confirmApplicant = catchAsync(async (req, res) => {
  const result = await JobService.confirmApplicant(
    req.body,
    req.params.id,
    req.user.id
  );
  sendResponse(res, {
    message: "Applicant confirm successfully!",
    data: result,
  });
});

export const JobController = {
  createJob,
  getJobs,
  getSingleJob,
  getMyProjects,
  confirmApplicant,
};
