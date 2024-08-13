const express = require("express");
const {
  create,
  getById,
  deleteById,
  editCountry,
  fetchAll,
  getByCountryName,
  getByCountryCodeIso,
} = require("../../controllers/country.controller");
const { countryByCode } = require("../../controllers/country.controller");
const { runValidation } = require("../../validations");
const {
  countryCreateValidator,
  countryUpdateValidator,
} = require("../../validations/country");
const router = express.Router();

/**
 * @swagger
 *  /api/country:
 *   post:
 *     summary: Add country details
 *     tags : ["Country"]
 *     description: Add new country details
 *     parameters:
 *        - in: body
 *          name: book
 *          description: To add the country details
 *          schema:
 *            type:  object
 *            required:
 *              - country_code
 *              - country_name
 *              - country_currency
 *              - country_states
 *            properties:
 *              country_code:
 *                type: string
 *              country_name:
 *                type: string
 *              country_currency:
 *                type: string
 *              country_states:
 *                type: object
 *     responses:
 *       200:
 *          description: Country added Successfully
 */

router.post("/", countryCreateValidator, runValidation, create);

/**
 * @swagger
 *  /api/country:
 *   put:
 *     summary: Edit country details
 *     tags : ["Country"]
 *     description: edit country details
 *     parameters:
 *        - in: body
 *          name: book
 *          description: To add the country details
 *          schema:
 *            type:  object
 *            required:
 *              - country_code
 *              - country_name
 *              - country_currency
 *              - country_states
 *            properties:
 *              country_code:
 *                type: string
 *              country_name:
 *                type: string
 *              country_currency:
 *                type: string
 *              country_states:
 *                type: object
 *              country_id:
 *                type: integer
 *     responses:
 *       200:
 *          description: Country edited successfully
 */

router.put("/", countryUpdateValidator, runValidation, editCountry);

/**
 * @swagger
 *  /api/country/get/{id}:
 *   get:
 *     summary: get by Country Details Using Id
 *     tags : ["Country"]
 *     description: get country details
 *     parameters:
 *        - in: path
 *          name: id
 *          description: country id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *          description: Success
 */

router.get("/get/:id", getById);

/**
* @swagger
*  /api/country/getAll:
*   get:
*     summary: Get country
*     tags : ["Country"]
*     description: Get country details
*     responses:
*       200:
*         content:
*           application/json:
*             schema:       
*                type: object
*                properties: 
*                 country_id:
*                   type: int
*                   description: country id
*                   example: ''
*                 country_code:
*                   type: varchar
*                   description: country code details
*                   example: ''
*                 country_name:
*                   type: varchar
*                   description: country name
*                   example: ''
*                 country_currency:
*                   type: varchar
*                   description: country currency
*                   example: ''
*                 country_states:
*                   type: jsonb
*                   description: country states
*                   example: ''
*                 created_date:
*                   type: timestamptz
*                   description: created date
*                   example: '2022-06-29 13:59:22.138 +0530'
*                 updated_date:
*                   type: timestamptz
*                   description: updated date
*                   example: '2022-06-30 13:59:22.138 +0530'

 */

router.get("/getAll", fetchAll);

/**
 * @swagger
 * paths:
 *  /api/country/delete/{id}:
 *   delete:
 *     summary: Delete Country
 *     tags : ["Country"]
 *     description: Delete country details
 *     parameters:
 *        - in: path
 *          name: id
 *          description: country id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Sucessfully deleted
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  country_id:
 *                    type: int
 *                    description: country id
 *                    example: ''
 *                  country_code:
 *                    type: varchar
 *                    description: country code details
 *                    example: ''
 *                  country_name:
 *                    type: varchar
 *                    description: country name
 *                    example: ''
 *                  country_currency:
 *                    type: varchar
 *                    description: country currency
 *                    example: ''
 *                  country_states:
 *                    type: jsonb
 *                    description: country states
 *                    example: ''
 */

router.delete("/delete/:id", deleteById);

/**
 * @swagger
 *  /api/country/fetchCountryByCode/{country_code}:
 *   get:
 *     summary: get by country details using country code
 *     tags : ["Country"]
 *     description: get country details
 *     parameters:
 *        - in: path
 *          name: country_code
 *          description: country code
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *          description: Success
 */
router.get("/fetchCountryByCode/:country_code", countryByCode);

/**
 * @swagger
 *  /api/country/getCountryName/{country_name}:
 *   get:
 *     summary: get by country details using country name
 *     tags : ["Country"]
 *     description: get country details
 *     parameters:
 *        - in: path
 *          name: country_name
 *          description: country name
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *          description: Success
 */

router.get("/getCountryName/:country_name", getByCountryName);

/**
 * @swagger
 *  /api/country/getByCountryCodeIso/{country_code_iso}:
 *   get:
 *     summary: get by country details using country code iso
 *     tags : ["Country"]
 *     description: get country details
 *     parameters:
 *        - in: path
 *          name: country_code_iso
 *          description: country code iso
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *          description: Success
 */
router.get("/getByCountryCodeIso/:country_code_iso", getByCountryCodeIso);

module.exports = router;
