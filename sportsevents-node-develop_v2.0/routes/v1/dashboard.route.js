const express = require('express');
const { fetchGraph, fetchApprovals,getTopFollower,fetchDashBoard } =require ("../../controllers/dashboard.controller");
const router = express.Router();

/**
* @swagger
*  /api/dashboard/getGraph:
*   get:
*     summary: Get Dashboard Graph Details
*     tags : ["Dashboard"]
*     description: Get Dashboard Graph Details
*     responses:
*       200:
*         description: Success
*/

router.get(
    "/getGraph",
    fetchGraph
    )
    
/**
* @swagger
*  /api/dashboard/getApprovals:
*   get:
*     summary: Get Dashboard Approvals Details
*     tags : ["Dashboard"] 
*     description: Get Dashboard Approvals Details
*     responses:
*       200:
*         description: Success
*/

router.get(
    "/getApprovals",
    fetchApprovals
)

/**
* @swagger
*  /api/dashboard/getUsersCount:
*   get:
*     summary: Get Dashboard Users Count Details
*     tags : ["Dashboard"]
*     description: Get Dashboard Users Count Details
*     responses:
*       200:
*         description: Success
*/


router.get(
    '/getUsersCount',
    fetchDashBoard
);

/**
* @swagger
*  /api/dashboard/topFollowers:
*   get:
*     summary: Get Dashboard Top Followers Details
*     tags : ["Dashboard"]
*     description: Get Dashboard Top Followers Details
*     responses:
*       200:
*         description: Success
*/


router.get(
    '/topFollowers',
    getTopFollower
);
module.exports = router;