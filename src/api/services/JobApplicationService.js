/**
 * This service provides operations of JobApplications.
 */

const _ = require("lodash");
const Joi = require("joi");
const helper = require("../common/helper");
const errors = require("../common/errors");

/**
 * Get Job Applications of current user
 * @param {Object} currentUser the user who perform this operation.
 * @param {Object} criteria the search criteria
 * @returns {Array<Object>} the JobApplications
 */
async function getMyJobApplications(currentUser, criteria) {
  const page = criteria.page;
  const perPage = criteria.perPage;
  const emptyResult = {
    total: 0,
    page,
    perPage,
    result: [],
  };
  // we expect logged-in users
  if (currentUser.isMachine) {
    return emptyResult;
  }
  // get user id by calling taas-api with current user's token
  const { id: userId } = await helper.getCurrentUserDetails(
    currentUser.jwtToken
  );
  if (!userId) {
    throw new errors.NotFoundError(
      `Id for user: ${currentUser.userId} not found`
    );
  }
  // get jobCandidates of current user by calling taas-api
  const { result: jobCandidates } = await helper.getJobCandidates({
    userId,
    perPage: 10000,
  });
  // if no candidates found then return empty result
  if (jobCandidates.length === 0) {
    return emptyResult;
  }
  const jobIds = _.map(jobCandidates, "jobId");
  // get jobs of current user by calling taas-api
  const jobs = await helper.getJobs({ jobIds, page, perPage });
  // apply desired structure
  const JobApplications = _.map(jobs.result, (job) => {
    const jobApplication = {
      title: job.title,
      payment: {
        min: job.minSalary,
        max: job.maxSalary,
        frequency: job.rateType,
        currency: job.currency,
      },
      hoursPerWeek: job.hoursPerWeek,
      location: job.jobLocation,
      workingHours: job.jobTimezone,
      duration: job.duration,
    };
    // find the current user inside job's candidates
    const candidate = _.find(
      job.candidates,
      (candidate) => candidate.userId === userId
    );
    jobApplication.status = candidate.status;
    (jobApplication.interview = candidate.interviews),
      (jobApplication.remark = candidate.remark);
    return jobApplication;
  });
  return {
    total: jobs.total,
    page: jobs.page,
    perPage: jobs.perPage,
    result: JobApplications,
  };
}

getMyJobApplications.schema = Joi.object()
  .keys({
    currentUser: Joi.object().required(),
    criteria: Joi.object()
      .keys({
        page: Joi.page(),
        perPage: Joi.perPage(),
      })
      .required(),
  })
  .required();

module.exports = {
  getMyJobApplications,
};
