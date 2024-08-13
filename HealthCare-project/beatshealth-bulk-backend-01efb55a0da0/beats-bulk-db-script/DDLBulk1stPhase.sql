--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `address_type` varchar(45) DEFAULT NULL,
  `address_line1` varchar(100) DEFAULT NULL,
  `address_line2` varchar(100) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `zip_code` varchar(45) DEFAULT NULL,
  `work_email` varchar(45) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `client_master`
--

DROP TABLE IF EXISTS `client_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_master` (
  `client_master_id` int NOT NULL AUTO_INCREMENT,
  `client_id` varchar(45) DEFAULT NULL,
  `client_name` varchar(45) DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`client_master_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `client_master_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_master_history` (
  `client_master_history_id` int NOT NULL AUTO_INCREMENT,
  `client_id` varchar(45) DEFAULT NULL,
  `client_name` varchar(45) DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`client_master_history_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `era`
--

DROP TABLE IF EXISTS `era`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `era` (
  `era_id` int NOT NULL AUTO_INCREMENT,
  `claims_number` varchar(45) DEFAULT NULL,
  `patient_name` varchar(100) DEFAULT NULL,
  `procedure_code` varchar(15) DEFAULT NULL,
  `qualifier` varchar(10) DEFAULT NULL,
  `payer_name` varchar(100) DEFAULT NULL,
  `transaction_date` date DEFAULT NULL,
  `provider_name` varchar(45) DEFAULT NULL,
  `user_id` varchar(45) DEFAULT NULL,
  `processed_date` timestamp NULL DEFAULT NULL,
  `matched_timestamp` timestamp NULL DEFAULT NULL,
  `modifier` varchar(45) DEFAULT NULL,
  `allowed_units` tinyint DEFAULT NULL,
  `billed_units` tinyint DEFAULT NULL,
  `charge_amount` decimal(10,2) DEFAULT NULL,
  `allowed_amount` decimal(10,2) DEFAULT NULL,
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `era_matched` char(1) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`era_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `adjustment`
--

DROP TABLE IF EXISTS `adjustment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adjustment` (
  `adjustment_id` int NOT NULL AUTO_INCREMENT,
  `adjustment_amount` decimal(10,2) DEFAULT NULL,
  `adjustment_reason_code` varchar(45) DEFAULT NULL,
  `adjustment_reason_description` varchar(100) DEFAULT NULL,
  `era_id` int DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`adjustment_id`),
  KEY `era_id_fk_idx` (`era_id`),
  CONSTRAINT `era_id_fk` FOREIGN KEY (`era_id`) REFERENCES `era` (`era_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `file_upload`
--

DROP TABLE IF EXISTS `file_upload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_upload` (
  `file_upload_id` int NOT NULL AUTO_INCREMENT,
  `job_id` varchar(45) DEFAULT NULL,
  `file_processing_status` varchar(45) NOT NULL,
  `file_name` varchar(45) DEFAULT NULL,
  `file_type` varchar(45) NOT NULL,
  `widget_name` varchar(45) DEFAULT NULL,
  `summary_dashboard_display` tinyint(1) DEFAULT '1',
  `s3_bucket_url` varchar(100) DEFAULT NULL,
  `created_on` timestamp NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`file_upload_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group_master`
--

DROP TABLE IF EXISTS `group_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_master` (
  `group_master_id` int NOT NULL AUTO_INCREMENT,
  `client_master_id` int DEFAULT NULL,
  `group_name` varchar(100) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`group_master_id`),
  KEY `client_master_id_fk_idx` (`client_master_id`),
  KEY `idx_group_name` (`group_name`),
  CONSTRAINT `client_master_id_fk` FOREIGN KEY (`client_master_id`) REFERENCES `client_master` (`client_master_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group_master_history`
--

DROP TABLE IF EXISTS `group_master_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_master_history` (
  `group_master_history_id` int NOT NULL AUTO_INCREMENT,
  `client_master_history_id` int DEFAULT NULL,
  `group_name` varchar(100) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`group_master_history_id`),
  KEY `client_master_history_id_fk0_idx` (`client_master_history_id`),
  KEY `idx_group_name` (`group_name`),
  CONSTRAINT `client_master_history_id_fk0` FOREIGN KEY (`client_master_history_id`) REFERENCES `client_master_history` (`client_master_history_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `patient_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `from_date_of_service` date DEFAULT NULL,
  `to_date_of_service` date DEFAULT NULL,
  `mrn_patient_account_no` varchar(45) DEFAULT NULL,
  `payer_id` varchar(45) DEFAULT NULL,
  `service_type_id` int DEFAULT NULL,
  `member_id` varchar(45) DEFAULT NULL,
  `file_upload_id` int DEFAULT NULL,
  `relationship_to_subscriber` varchar(45) DEFAULT NULL,
  `processing_status` varchar(45) DEFAULT NULL,
  `comments` text,
  `provider_npi` int DEFAULT NULL,
  `client_id` varchar(45) DEFAULT NULL,
  `delete_flag` char(1) DEFAULT 'N',
  `api_status` varchar(45) DEFAULT NULL,
  `patient_unique_id` varchar(45) DEFAULT NULL,
  `record_type` varchar(45) DEFAULT NULL,
  `payer_alias` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`patient_id`),
  UNIQUE KEY `patient_unique_id_UNIQUE` (`patient_unique_id`),
  KEY `idx_last_name` (`last_name`),
  KEY `idx_last_name_first_name` (`last_name`,`first_name`),
  KEY `idx_created_by` (`created_by`),
  KEY `idx_file_upload_id` (`file_upload_id`),
  KEY `idx_created_on` (`created_on`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `patient_eligibility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_eligibility` (
  `patient_eligibility_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `from_date_of_service` date DEFAULT NULL,
  `to_date_of_service` date DEFAULT NULL,
  `mrn_patient_account_no` varchar(45) DEFAULT NULL,
  `payer_id` varchar(45) DEFAULT NULL,
  `service_type_id` int DEFAULT NULL,
  `member_id` varchar(45) DEFAULT NULL,
  `file_upload_id` int DEFAULT NULL,
  `relationship_to_subscriber` varchar(45) DEFAULT NULL,
  `processing_status` varchar(45) DEFAULT NULL,
  `comments` text,
  `provider_npi` int DEFAULT NULL,
  `client_id` varchar(45) DEFAULT NULL,
  `delete_flag` char(1) DEFAULT 'N',
  `api_status` varchar(45) DEFAULT NULL,
  `patient_eligibility_unique_id` varchar(45) DEFAULT NULL,
  `record_type` varchar(45) DEFAULT NULL,
  `payer_alias` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`patient_eligibility_id`),
  UNIQUE KEY `patient_eligibility_unique_id_UNIQUE` (`patient_eligibility_unique_id`),
  KEY `idx_last_name` (`last_name`),
  KEY `idx_last_name_first_name` (`last_name`,`first_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `patient_eligibility_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_eligibility_history` (
  `patients_eligibility_history_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `from_date_of_service` date DEFAULT NULL,
  `to_date_of_service` date DEFAULT NULL,
  `mrn_patient_account_no` varchar(45) DEFAULT NULL,
  `payer_id` varchar(45) DEFAULT NULL,
  `service_type_id` int DEFAULT NULL,
  `member_id` varchar(45) DEFAULT NULL,
  `file_upload_id` int DEFAULT NULL,
  `relationship_to_subscriber` varchar(45) DEFAULT NULL,
  `processing_status` varchar(45) DEFAULT NULL,
  `comments` text,
  `provider_npi` int DEFAULT NULL,
  `userid` varchar(10) DEFAULT NULL,
  `client_id` varchar(45) DEFAULT NULL,
  `api_status` varchar(45) DEFAULT NULL,
  `patient_eligibility_unique_id` varchar(45) DEFAULT NULL,
  `record_type` varchar(45) DEFAULT NULL,
  `payer_alias` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`patients_eligibility_history_id`),
  UNIQUE KEY `patient_eligibility_unique_id_UNIQUE` (`patient_eligibility_unique_id`),
  KEY `idx_last_name` (`last_name`),
  KEY `idx_last_name_first_name` (`last_name`,`first_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `patient_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_history` (
  `patients_history_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `from_date_of_service` date DEFAULT NULL,
  `to_date_of_service` date DEFAULT NULL,
  `mrn_patient_account_no` varchar(45) DEFAULT NULL,
  `payer_id` varchar(45) DEFAULT NULL,
  `service_type_id` int DEFAULT NULL,
  `member_id` varchar(45) DEFAULT NULL,
  `file_upload_id` int DEFAULT NULL,
  `relationship_to_subscriber` varchar(45) DEFAULT NULL,
  `processing_status` varchar(45) DEFAULT NULL,
  `comments` text,
  `provider_npi` int DEFAULT NULL,
  `userid` varchar(10) DEFAULT NULL,
  `client_id` varchar(45) DEFAULT NULL,
  `api_status` varchar(45) DEFAULT NULL,
  `patient_unique_id` varchar(45) DEFAULT NULL,
  `record_type` varchar(45) DEFAULT NULL,
  `payer_alias` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`patients_history_id`),
  UNIQUE KEY `patient_unique_id_UNIQUE` (`patient_unique_id`),
  KEY `idx_last_name` (`last_name`),
  KEY `idx_last_name_first_name` (`last_name`,`first_name`),
  KEY `idx_created_by` (`created_by`),
  KEY `idx_file_upload_id` (`file_upload_id`),
  KEY `idx_created_on` (`created_on`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `patient_insurance_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_insurance_records` (
  `patient_insurance_record_id` int NOT NULL AUTO_INCREMENT,
  `patient_eligibility_id` int DEFAULT NULL,
  `external_payer_id` varchar(45) DEFAULT NULL,
  `eligibility_status` varchar(45) DEFAULT NULL,
  `copay` text,
  `coinsurance` text,
  `deductible` text,
  `out_of_pocket` text,
  `limitations` text,
  `subscriber_id` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`patient_insurance_record_id`),
  KEY `fk_patient_insurance_records_patients_idx` (`patient_eligibility_id`),
  CONSTRAINT `fk_patient_insurance_records_patients` FOREIGN KEY (`patient_eligibility_id`) REFERENCES `patient_eligibility` (`patient_eligibility_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `patient_insurance_records_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_insurance_records_history` (
  `patient_insurance_records_history_id` int NOT NULL AUTO_INCREMENT,
  `patient_eligibility_history_id` int DEFAULT NULL,
  `external_payer_id` varchar(45) DEFAULT NULL,
  `eligibility_status` varchar(45) DEFAULT NULL,
  `copay` text,
  `coinsurance` text,
  `deductible` text,
  `out_of_pocket` text,
  `limitations` text,
  `subscriber_id` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`patient_insurance_records_history_id`),
  KEY `patient_history_id_fk1_idx` (`patient_eligibility_history_id`),
  CONSTRAINT `patient_history_id_fk1` FOREIGN KEY (`patient_eligibility_history_id`) REFERENCES `patient_eligibility_history` (`patients_eligibility_history_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payer_mapping`
--

DROP TABLE IF EXISTS `payer_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payer_mapping` (
  `payer_mapping_id` int NOT NULL AUTO_INCREMENT,
  `external_payer_name` varchar(100) DEFAULT NULL,
  `display_id` varchar(45) DEFAULT NULL,
  `eligibility_payer_id` varchar(45) DEFAULT NULL,
  `eligibility_enrollment_required` varchar(5) DEFAULT NULL,
  `claims_payer_id` varchar(45) DEFAULT NULL,
  `claims_enrollment_required` varchar(5) DEFAULT NULL,
  `era_payer_id` varchar(45) DEFAULT NULL,
  `enrollment_required` varchar(5) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`payer_mapping_id`),
  KEY `idx_external_payer_name` (`external_payer_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `preconfigured_users`
--

DROP TABLE IF EXISTS `preconfigured_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preconfigured_users` (
  `preconfigured_users_id` int NOT NULL AUTO_INCREMENT,
  `user_email` varchar(100) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `is_enabled` char(1) DEFAULT 'Y',
  `created_by` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`preconfigured_users_id`),
  UNIQUE KEY `user_email_UNIQUE` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service_types`
--

DROP TABLE IF EXISTS `service_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_types` (
  `service_type_Id` int NOT NULL AUTO_INCREMENT,
  `service_type_name` varchar(100) DEFAULT NULL,
  `service_name` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`service_type_Id`),
  KEY `idx_service_name` (`service_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `subscriber_details`
--

DROP TABLE IF EXISTS `subscriber_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriber_details` (
  `subscriber_details_id` int NOT NULL AUTO_INCREMENT,
  `cognito_user_id` varchar(100) DEFAULT NULL,
  `is_company_user_registered` char(1) DEFAULT NULL,
  `ein` varchar(45) DEFAULT NULL,
  `entity_type` varchar(45) DEFAULT NULL,
  `entity_registered_state` varchar(45) DEFAULT NULL,
  `legal_name_of_company` varchar(100) DEFAULT NULL,
  `physical_address` int DEFAULT NULL,
  `invoice_address` int DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `registered_state` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`subscriber_details_id`),
  KEY `physical_address_idx` (`physical_address`),
  KEY `invoice_address_fk_idx` (`invoice_address`),
  CONSTRAINT `invoice_address_fk` FOREIGN KEY (`invoice_address`) REFERENCES `address` (`address_id`),
  CONSTRAINT `physical_address_fk` FOREIGN KEY (`physical_address`) REFERENCES `address` (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `users_id` int NOT NULL AUTO_INCREMENT,
  `userid` varchar(10) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `cognito_id` varchar(100) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`users_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `admin_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_config` (
  `admin_config_id` int NOT NULL AUTO_INCREMENT,
  `dashboard_cleanup_frequency` tinyint DEFAULT NULL,
  `summary_status_cleanup` tinyint DEFAULT NULL,
  `company_domain` varchar(100) DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `users_id` int DEFAULT NULL,
  PRIMARY KEY (`admin_config_id`),
  KEY `users_id` (`users_id`),
  CONSTRAINT `admin_config_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group_mapping`
--

DROP TABLE IF EXISTS `group_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_mapping` (
  `group_mapping_id` int NOT NULL AUTO_INCREMENT,
  `provider_npi` int DEFAULT NULL,
  `group_master_id` int DEFAULT NULL,
  `admin_user_id` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`group_mapping_id`),
  KEY `group_id_fk_idx` (`group_master_id`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `group_master_id_fk` FOREIGN KEY (`group_master_id`) REFERENCES `group_master` (`group_master_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `group_mapping_history`
--

DROP TABLE IF EXISTS `group_mapping_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_mapping_history` (
  `group_mapping_history_id` int NOT NULL AUTO_INCREMENT,
  `provider_npi` int DEFAULT NULL,
  `group_master_history_id` int DEFAULT NULL,
  `admin_user_id` varchar(45) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`group_mapping_history_id`),
  KEY `group_master_history_id_fk0_idx` (`group_master_history_id`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `group_master_history_id_fk0` FOREIGN KEY (`group_master_history_id`) REFERENCES `group_master_history` (`group_master_history_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `payer_alias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payer_alias` (
  `payer_alias_id` int NOT NULL AUTO_INCREMENT,
  `payer_alias_identifier` varchar(45) DEFAULT NULL,
  `payer_alias_name` varchar(100) DEFAULT NULL,
  `payer_mapping_id` int DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`payer_alias_id`),
  KEY `payer_mapping_id_fk_idx` (`payer_mapping_id`),
  CONSTRAINT `payer_mapping_id_fk` FOREIGN KEY (`payer_mapping_id`) REFERENCES `payer_mapping` (`payer_mapping_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `patient_claims`
--

DROP TABLE IF EXISTS `patient_claims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_claims` (
  `patient_claims_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `external_payer_id` int DEFAULT NULL,
  `claimed_amount` decimal(10,2) DEFAULT NULL,
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `check_eft_number` varchar(45) DEFAULT NULL,
  `claim_number` varchar(45) DEFAULT NULL,
  `claim_status` varchar(255) DEFAULT NULL,
  `delete_flag` char(1) DEFAULT 'N',
  `effective_date` date DEFAULT NULL,
  `adjudication_date` date DEFAULT NULL,
  `remittance_date` date DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`patient_claims_id`),
  KEY `patient_id_fk_idx` (`patient_id`),
  CONSTRAINT `patient_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `patient_claims_history`
--

DROP TABLE IF EXISTS `patient_claims_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_claims_history` (
  `patient_claims_history_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `external_payer_id` int DEFAULT NULL,
  `claimed_amount` decimal(10,2) DEFAULT NULL,
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `check_eft_number` varchar(45) DEFAULT NULL,
  `claim_number` varchar(45) DEFAULT NULL,
  `claim_status` varchar(255) DEFAULT NULL,
  `effective_date` date DEFAULT NULL,
  `adjudication_date` date DEFAULT NULL,
  `remittance_date` date DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`patient_claims_history_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `claims_procedure`
--

DROP TABLE IF EXISTS `claims_procedure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `claims_procedure` (
  `claims_procedure_id` int NOT NULL AUTO_INCREMENT,
  `procedure_code` varchar(45) DEFAULT NULL,
  `patient_claims_id` int DEFAULT NULL,
  `era_matched` char(1) DEFAULT NULL,
  `modifier` varchar(45) DEFAULT NULL,
  `charge_amount` decimal(10,2) DEFAULT NULL,
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`claims_procedure_id`),
  KEY `patient_claims_id_fk_idx` (`patient_claims_id`),
  CONSTRAINT `patient_claims_id_fk` FOREIGN KEY (`patient_claims_id`) REFERENCES `patient_claims` (`patient_claims_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `claims_procedure_history`
--

DROP TABLE IF EXISTS `claims_procedure_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `claims_procedure_history` (
  `claims_procedure_history_id` int NOT NULL AUTO_INCREMENT,
  `procedure_code` varchar(45) DEFAULT NULL,
  `patient_claims_id` int DEFAULT NULL,
  `era_matched` char(1) DEFAULT NULL,
  `modifier` varchar(45) DEFAULT NULL,
  `charge_amount` decimal(10,2) DEFAULT NULL,
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`claims_procedure_history_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

ALTER TABLE `group_mapping` 
CHANGE COLUMN `provider_npi` `provider_npi` BIGINT NULL DEFAULT NULL ;

ALTER TABLE `group_mapping_history` 
CHANGE COLUMN `provider_npi` `provider_npi` BIGINT NULL DEFAULT NULL ;

ALTER TABLE `payer_mapping` 
ADD COLUMN `clearing_house` CHAR(2) NULL AFTER `enrollment_required`,
ADD COLUMN `npi_type` CHAR(2) NULL AFTER `clearing_house`;

update payer_mapping set clearing_house = 'AV' where clearing_house is null;

update payer_mapping set npi_type = 'BN' where npi_type is null;

ALTER TABLE `group_mapping` 
ADD COLUMN `billing_npi` BIGINT NULL AFTER `admin_user_id`;

ALTER TABLE `group_mapping_history` 
ADD COLUMN `billing_npi` BIGINT NULL AFTER `admin_user_id`;

ALTER TABLE `patient_eligibility` 
CHANGE COLUMN `patient_eligibility_unique_id` `patient_unique_id` VARCHAR(45) NULL DEFAULT NULL ;

ALTER TABLE `patient_eligibility_history` 
CHANGE COLUMN `patient_eligibility_unique_id` `patient_unique_id` VARCHAR(45) NULL DEFAULT NULL ;

ALTER TABLE `group_mapping` 
CHANGE COLUMN `billing_npi` `billing_npi` BIGINT NULL AFTER `group_master_id`;

ALTER TABLE `group_mapping_history` 
CHANGE COLUMN `billing_npi` `billing_npi` BIGINT NULL AFTER `group_master_history_id`;

CREATE TABLE `client` (
  `client_id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `description` TEXT NULL,
  `created_by` VARCHAR(45) NULL,
  `created_on` TIMESTAMP NULL,
  PRIMARY KEY (`client_id`));

CREATE TABLE `user_client` (
  `user_client_id` INT NOT NULL,
  `users_id` INT NULL,
  `client_id` INT NULL,
  PRIMARY KEY (`user_client_id`),
  INDEX `users_id_fk_idx` (`users_id` ASC) VISIBLE,
  INDEX `client_id_fk_idx` (`client_id` ASC) VISIBLE,
  CONSTRAINT `users_id_fk`
    FOREIGN KEY (`users_id`)
    REFERENCES `users` (`users_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `client_id_fk`
    FOREIGN KEY (`client_id`)
    REFERENCES `client` (`client_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

ALTER TABLE `patient_eligibility` 
ADD COLUMN `transaction_id` TEXT NULL AFTER `payer_alias`;

ALTER TABLE `patient_eligibility_history` 
ADD COLUMN `transaction_id` TEXT NULL AFTER `payer_alias`;

ALTER TABLE `patient` 
ADD COLUMN `transaction_id` TEXT NULL AFTER `payer_alias`;

ALTER TABLE `patient_history` 
ADD COLUMN `transaction_id` TEXT NULL AFTER `payer_alias`;

ALTER TABLE `preconfigured_users` 
ADD COLUMN `role` VARCHAR(45) NULL AFTER `is_enabled`;

ALTER TABLE `file_upload` 
ADD COLUMN `comments` VARCHAR(256) NULL AFTER `s3_bucket_url`;

ALTER TABLE `patient` 
CHANGE COLUMN `provider_npi` `provider_npi` BIGINT NULL DEFAULT NULL;

ALTER TABLE `patient_history` 
CHANGE COLUMN `provider_npi` `provider_npi` BIGINT NULL DEFAULT NULL;

ALTER TABLE `era` 
ADD COLUMN `provider_npi` BIGINT NULL AFTER `era_matched`;

ALTER TABLE `era` 
CHANGE COLUMN `era_matched` `era_matched` CHAR(1) NULL DEFAULT 'N' ;

ALTER TABLE `claims_procedure` 
CHANGE COLUMN `era_matched` `era_matched` CHAR(1) NULL DEFAULT 'N' ;

ALTER TABLE `claims_procedure_history` 
CHANGE COLUMN `era_matched` `era_matched` CHAR(1) NULL DEFAULT 'N' ;

ALTER TABLE `era` 
ADD COLUMN `file_upload_id` INT NULL AFTER `provider_npi`;


ALTER TABLE `era` 
ADD INDEX `idx_file_upload_id` (`file_upload_id` ASC) INVISIBLE;

ALTER TABLE `era` 
ADD INDEX `idx_procedure_code` (`procedure_code` ASC) INVISIBLE,
ADD INDEX `idx_claim_number` (`claims_number` ASC) INVISIBLE,
ADD INDEX `idx_provider_npi` (`provider_npi` ASC) VISIBLE;

ALTER TABLE `claims_procedure` 
ADD INDEX `idx_procedure_code` (`procedure_code` ASC) VISIBLE;

ALTER TABLE `patient_claims` 
ADD INDEX `idx_claim_number` (`claim_number` ASC) VISIBLE;

ALTER TABLE `patient` 
ADD INDEX `idx_provider_npi` (`provider_npi` ASC) VISIBLE;

ALTER TABLE `era` 
ADD COLUMN `payment_type` VARCHAR(256) NULL AFTER `file_upload_id`;

ALTER TABLE `patient_claims` 
ADD COLUMN `allowed_amount` DECIMAL(10,2) NULL AFTER `remittance_date`,
ADD COLUMN `deductible` DECIMAL(10,2) NULL AFTER `allowed_amount`,
ADD COLUMN `coinsurance` DECIMAL(10,2) NULL AFTER `deductible`,
ADD COLUMN `copay` DECIMAL(10,2) NULL AFTER `coinsurance`,
ADD COLUMN `providers_writeoff` DECIMAL(10,2) NULL AFTER `copay`;

ALTER TABLE `patient_claims_history` 
ADD COLUMN `allowed_amount` DECIMAL(10,2) NULL AFTER `remittance_date`,
ADD COLUMN `deductible` DECIMAL(10,2) NULL AFTER `allowed_amount`,
ADD COLUMN `coinsurance` DECIMAL(10,2) NULL AFTER `deductible`,
ADD COLUMN `copay` DECIMAL(10,2) NULL AFTER `coinsurance`,
ADD COLUMN `providers_writeoff` DECIMAL(10,2) NULL AFTER `copay`;

ALTER TABLE `preconfigured_users` 
DROP COLUMN `last_name`,
DROP COLUMN `first_name`,
ADD COLUMN `organization_name` VARCHAR(256) NULL DEFAULT NULL AFTER `preconfigured_users_id`,
CHANGE COLUMN `role` `role` VARCHAR(45) NULL DEFAULT NULL AFTER `user_email`,
CHANGE COLUMN `is_enabled` `status` CHAR(1) NULL DEFAULT 'A' ;

ALTER TABLE `users` 
ADD COLUMN `status` CHAR(1) NULL DEFAULT 'A' AFTER `role`;

update preconfigured_users set status = 'A' ;










