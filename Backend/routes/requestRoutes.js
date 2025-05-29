const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");

// Staff creates a request
router.post("/", requestController.createRequest);
// Staff creates a request for new asset
router.post(
  "/unfulfilled-requests",
  requestController.createUnfulfilledRequest
);
// Staff deletes a request
router.delete("/:id", requestController.cancelRequest);
// Department Head approves/denies
router.put("/approve/:id", requestController.approveByDeptHead);

// Manager allocates
router.put("/allocate/:id", requestController.allocateByManager);

// Store Keeper confirms and issues
router.put("/confirm/:id", requestController.confirmByStoreman);
// User User to Confirm
router.put("/user/:id", requestController.confirmAssetReceived);
// Get all requests for staff
router.get("/", requestController.getAllRequests);
// GET all pending requests for approval by a Department Head
router.get(
  "/department-head/:id/pending-requests",
  requestController.getRequestsForDepartmentHead
);
// Get all requests for manager to approve
router.get("/manager", requestController.getRequestsForManager);
// Get all request for store man
router.get("/storeman", requestController.getRequestsForStoreman);
// Get all handled requests for store man
router.get("/storeman/handled", requestController.getHandledRequestsByStoreman);
// Get all requests for a specific user
router.get("/user/:id", requestController.getUserRequests);
// Get Requests  for return asset to storekeeper from staff/DepartmentHead
router.get("/return-requests", requestController.getRequestReturn);
// PUT request for return asset to storekeeper from staff/DepartmentHead
router.put("/return/:id", requestController.requestReturn);
// PUT request for confirm return by storekeeper
router.put("/confirm-return/:id", requestController.confirmReturn);
module.exports = router;
