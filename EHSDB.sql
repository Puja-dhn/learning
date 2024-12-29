

CREATE TABLE `t_inshe_apps` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `sht_name` varchar(50) NOT NULL,
  `app_desc` text DEFAULT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `t_inshe_apps`
--

INSERT INTO `t_inshe_apps` (`id`, `name`, `sht_name`, `app_desc`, `logo_path`, `status`, `created_at`, `created_by`) VALUES
(1, 'SIO', 'Inspection & Observation', 'Capturing Safety Inspections & Observations', '10_app_logo.png', 'Active', '2024-12-29 22:50:39', NULL),
(2, 'PTW', 'Permit To Work', 'Issuing the Work Permit', 'ptw.png', 'Active', '2024-12-29 22:50:39', NULL),
(3, 'IMS', 'Incident Management', 'Incident Capturing & Investigation', 'ims.png', 'Active', '2024-12-29 22:51:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_context_definitions`
--

CREATE TABLE `t_inshe_context_definitions` (
  `context_id` int(11) NOT NULL,
  `context_name` text NOT NULL,
  `parent_context_id` int(11) DEFAULT 0,
  `definitions_type` text NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `t_inshe_context_definitions`
--

INSERT INTO `t_inshe_context_definitions` (`context_id`, `context_name`, `parent_context_id`, `definitions_type`, `is_deleted`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Open', 0, 'SIO_STATUS', 0, '2024-12-29 23:41:54', NULL, '2024-12-29 23:41:54', NULL),
(2, 'PDC Assigned', 0, 'SIO_STATUS', 0, '2024-12-29 23:41:54', NULL, '2024-12-29 23:42:15', NULL),
(3, 'Closed', 0, 'SIO_STATUS', 0, '2024-12-29 23:42:07', NULL, '2024-12-29 23:42:20', NULL),
(4, 'Minor', 0, 'SIO_SEVERITY', 0, '2024-12-29 23:44:44', NULL, '2024-12-29 23:44:44', NULL),
(5, 'Serious', 0, 'SIO_SEVERITY', 0, '2024-12-29 23:44:44', NULL, '2024-12-29 23:44:52', NULL),
(6, 'Fatal', 0, 'SIO_SEVERITY', 0, '2024-12-29 23:45:06', NULL, '2024-12-29 23:45:06', NULL),
(7, 'NMC Minor', 0, 'IMS_LOG_INJURY_TYPE', 0, '2024-12-29 23:45:51', NULL, '2024-12-29 23:45:51', NULL),
(8, 'NMC Serious', 0, 'IMS_LOG_INJURY_TYPE', 0, '2024-12-29 23:45:51', NULL, '2024-12-29 23:46:57', NULL),
(9, 'NMC Hipo', 0, 'IMS_LOG_INJURY_TYPE', 0, '2024-12-29 23:46:39', NULL, '2024-12-29 23:47:00', NULL),
(10, 'First Aid Case', 0, 'IMS_LOG_INJURY_TYPE', 0, '2024-12-29 23:46:39', NULL, '2024-12-29 23:47:01', NULL),
(11, 'Medical Center FAC', 0, 'IMS_LOG_INJURY_TYPE', 0, '2024-12-29 23:46:47', NULL, '2024-12-29 23:47:08', NULL),
(12, 'Medical Center-FAC', 0, 'IMS_INJURY_TYPE', 0, '2024-12-29 23:48:27', NULL, '2024-12-29 23:48:27', NULL),
(13, 'Medical Center-LTI', 0, 'IMS_INJURY_TYPE', 0, '2024-12-29 23:48:27', NULL, '2024-12-29 23:49:36', NULL),
(14, 'Medical Center-RWC', 0, 'IMS_INJURY_TYPE', 0, '2024-12-29 23:49:08', NULL, '2024-12-29 23:49:54', NULL),
(15, 'Medical Center-MTC', 0, 'IMS_INJURY_TYPE', 0, '2024-12-29 23:49:08', NULL, '2024-12-29 23:50:02', NULL),
(16, 'Slip, Trip, Fall', 0, 'IMS_FACTORS', 0, '2024-12-30 00:02:37', NULL, '2024-12-30 00:02:37', NULL),
(17, 'Struck by Object', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:43', NULL, '2024-12-30 00:03:43', NULL),
(18, 'Crashed Between', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(19, 'Collision (Vehicle)', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(20, 'Electrical', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(21, 'Leaks, Spills and Gas release', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(22, 'Fire and Explosions', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(23, 'Process Deviation', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(24, 'Fall from height', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(25, 'Fall of objects', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(26, 'Caught in between', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(27, 'Unsafe Posture / Position', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(28, 'Defective tools / Wrong tools', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(29, 'Failure of tools & tackles', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(30, 'Failure to follow safety norms', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(31, 'Exposure to or Contact with Extreme Temparature', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(32, 'Exposure to or Contact with Harmful Substances, Including Radiations', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(33, 'Foreign body in eye', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(34, 'Welding Spatters', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(35, 'Spillage', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(36, 'Others', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(37, 'Motorcycle Skidding', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(38, 'Injury due to knife', 0, 'IMS_FACTORS', 0, '2024-12-30 00:03:44', NULL, '2024-12-30 00:03:44', NULL),
(39, 'Body Part', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:12', NULL, '2024-12-30 00:51:12', NULL),
(40, 'Head(Scalp)', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:12', NULL, '2024-12-30 00:51:12', NULL),
(41, 'Eye', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:12', NULL, '2024-12-30 00:51:12', NULL),
(42, 'Neck', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:12', NULL, '2024-12-30 00:51:12', NULL),
(43, 'Hand', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:12', NULL, '2024-12-30 00:51:12', NULL),
(44, 'Finger', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:12', NULL, '2024-12-30 00:51:12', NULL),
(45, 'Lower Leg', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:12', NULL, '2024-12-30 00:51:12', NULL),
(46, 'Foot', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:12', NULL, '2024-12-30 00:51:12', NULL),
(47, 'Forehead', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:12', NULL, '2024-12-30 00:51:12', NULL),
(48, 'Chest', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:12', NULL, '2024-12-30 00:51:12', NULL),
(49, 'Abdomen(belly)', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:12', NULL, '2024-12-30 00:51:12', NULL),
(50, 'Face', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(51, 'Ear', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(52, 'Nose', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(53, 'Dental', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(54, 'Upper Arm', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(55, 'Forearm', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(56, 'Joints', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(57, 'Upper trunk(Back)', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(58, 'Lower trunk(Back)', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(59, 'Genitals', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(60, 'Upper Leg(thigh)', 0, 'IMS_INJURY_BODYPART', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(61, 'Burn', 0, 'IMS_INJURY_NATURE', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(62, 'Cut Injury', 0, 'IMS_INJURY_NATURE', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(63, 'Blunt Injury', 0, 'IMS_INJURY_NATURE', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(64, 'Sprain', 0, 'IMS_INJURY_NATURE', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(65, 'Abrasion', 0, 'IMS_INJURY_NATURE', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(66, 'Puncture Wound', 0, 'IMS_INJURY_NATURE', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(67, 'Fracture', 0, 'IMS_INJURY_NATURE', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(68, 'Amputation', 0, 'IMS_INJURY_NATURE', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(69, 'Crush Injury', 0, 'IMS_INJURY_NATURE', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(70, 'Avulsion', 0, 'IMS_INJURY_NATURE', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(71, 'Strain', 0, 'IMS_INJURY_NATURE', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(72, 'Others', 0, 'IMS_INJURY_NATURE', 0, '2024-12-30 00:51:13', NULL, '2024-12-30 00:51:13', NULL),
(73, 'Personal Protective Equipment(PPE)', 0, 'SIO_CATEGORY', 0, '2024-12-30 01:01:02', NULL, '2024-12-30 01:01:02', NULL),
(74, 'Hazardous Material Handling', 0, 'SIO_CATEGORY', 0, '2024-12-30 01:01:02', NULL, '2024-12-30 01:01:02', NULL),
(75, 'Equipment or Machinery Usage', 0, 'SIO_CATEGORY', 0, '2024-12-30 01:02:26', NULL, '2024-12-30 01:02:26', NULL),
(76, 'Houskeeping and Cleanliness', 0, 'SIO_CATEGORY', 0, '2024-12-30 01:02:26', NULL, '2024-12-30 01:02:26', NULL),
(77, 'Emergency Preparedness', 0, 'SIO_CATEGORY', 0, '2024-12-30 01:03:37', NULL, '2024-12-30 01:03:37', NULL),
(78, 'Ergonomics and Body Mechanics', 0, 'SIO_CATEGORY', 0, '2024-12-30 01:03:37', NULL, '2024-12-30 01:03:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_contractors`
--

CREATE TABLE `t_inshe_contractors` (
  `id` int(11) NOT NULL,
  `contractor_name` varchar(255) NOT NULL,
  `esic_reg_no` varchar(255) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` varchar(100) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_incident_documents`
--

CREATE TABLE `t_inshe_incident_documents` (
  `id` int(11) NOT NULL,
  `incident_id` int(11) NOT NULL,
  `document_type` varchar(255) DEFAULT NULL,
  `document` text DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_incident_header`
--

CREATE TABLE `t_inshe_incident_header` (
  `id` int(11) NOT NULL,
  `inc_date_time` datetime NOT NULL,
  `department` varchar(255) NOT NULL,
  `area` varchar(255) NOT NULL,
  `reported_by` varchar(255) NOT NULL,
  `injury_type` varchar(255) NOT NULL,
  `factors` varchar(255) NOT NULL,
  `exact_location` varchar(255) NOT NULL,
  `potential_outcome` varchar(255) DEFAULT NULL,
  `action_taken` text DEFAULT NULL,
  `incident_details` text NOT NULL,
  `immediate_action` text NOT NULL,
  `status` varchar(20) NOT NULL,
  `medical_status` varchar(20) DEFAULT NULL,
  `pending_on` varchar(255) DEFAULT NULL,
  `close_date` varchar(100) DEFAULT NULL,
  `close_remarks` text DEFAULT NULL,
  `ims_photos` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(255) NOT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_incident_injury_dtls`
--

CREATE TABLE `t_inshe_incident_injury_dtls` (
  `id` int(11) NOT NULL,
  `header_id` int(11) NOT NULL,
  `company_type` varchar(50) NOT NULL,
  `employee_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `sex` varchar(10) NOT NULL,
  `deployed_date` date NOT NULL,
  `body_part` varchar(255) NOT NULL,
  `injury_nature` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `rejoin_date` varchar(100) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(255) NOT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_incident_investigation`
--

CREATE TABLE `t_inshe_incident_investigation` (
  `id` int(11) NOT NULL,
  `incident_id` int(11) NOT NULL,
  `list_facts` text DEFAULT NULL,
  `risk_management` text DEFAULT NULL,
  `physical_factors` text DEFAULT NULL,
  `human_factors` text DEFAULT NULL,
  `system_factors` text DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `risk_identified` varchar(20) DEFAULT NULL,
  `identified_control` varchar(20) DEFAULT NULL,
  `control_type` varchar(100) DEFAULT NULL,
  `control_description` text DEFAULT NULL,
  `control_adequate_desc` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_incident_recommendation`
--

CREATE TABLE `t_inshe_incident_recommendation` (
  `id` int(11) NOT NULL,
  `incident_id` int(11) NOT NULL,
  `recommendation` text DEFAULT NULL,
  `responsibility` varchar(255) DEFAULT NULL,
  `factor` varchar(255) DEFAULT NULL,
  `control_type` varchar(255) DEFAULT NULL,
  `target_date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `pending_on` varchar(20) DEFAULT NULL,
  `closure_remarks` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_incident_team`
--

CREATE TABLE `t_inshe_incident_team` (
  `id` int(11) NOT NULL,
  `header_id` int(11) NOT NULL,
  `team_type` varchar(50) DEFAULT NULL,
  `employee_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(255) NOT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_log_ptw`
--

CREATE TABLE `t_inshe_log_ptw` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `work_location` varchar(255) DEFAULT NULL,
  `datetime_from` timestamp NULL DEFAULT NULL,
  `datetime_to` timestamp NULL DEFAULT NULL,
  `nearest_firealarm` varchar(255) DEFAULT NULL,
  `job_description` text DEFAULT NULL,
  `moc_required` varchar(10) DEFAULT NULL,
  `moc_title` text DEFAULT NULL,
  `moc_no` varchar(255) DEFAULT NULL,
  `supervisor_name` varchar(255) DEFAULT NULL,
  `contractor` varchar(255) DEFAULT NULL,
  `esic_no` varchar(255) DEFAULT NULL,
  `associated_permit` varchar(255) DEFAULT NULL,
  `hazard_identification` text DEFAULT NULL,
  `other_hazards` text DEFAULT NULL,
  `risk_assessment` text DEFAULT NULL,
  `ppe_required` text DEFAULT NULL,
  `ei_panel_name` varchar(255) DEFAULT NULL,
  `ei_loto_no` varchar(255) DEFAULT NULL,
  `ei_checked_by` varchar(255) DEFAULT NULL,
  `ei_date_time` timestamp NULL DEFAULT NULL,
  `si_panel_name` varchar(255) DEFAULT NULL,
  `si_loto_no` varchar(255) DEFAULT NULL,
  `si_checked_by` varchar(255) DEFAULT NULL,
  `si_date_time` timestamp NULL DEFAULT NULL,
  `general_work_dtls` text DEFAULT NULL,
  `annexture_v` text DEFAULT NULL,
  `work_height_checklist` text DEFAULT NULL,
  `work_height_supervision` varchar(255) DEFAULT NULL,
  `confined_space_checklist` text DEFAULT NULL,
  `confined_space_supervision` varchar(255) DEFAULT NULL,
  `confined_space_atmospheric` text DEFAULT NULL,
  `confined_space_oxygen_level` varchar(255) DEFAULT NULL,
  `confined_space_lel` varchar(255) DEFAULT NULL,
  `confined_space_toxic` text DEFAULT NULL,
  `confined_space_detector` varchar(255) DEFAULT NULL,
  `lifting_work_checklist` text DEFAULT NULL,
  `esms_checklist` text DEFAULT NULL,
  `hot_work_checklist` text DEFAULT NULL,
  `pending_on` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `custodian_comments` text DEFAULT NULL,
  `why_moc_remarks` text DEFAULT NULL,
  `equipment` text DEFAULT NULL,
  `equipment_checklist` varchar(255) DEFAULT NULL,
  `issuer` varchar(255) DEFAULT NULL,
  `close_remarks` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_log_sio`
--

CREATE TABLE `t_inshe_log_sio` (
  `id` int(11) NOT NULL,
  `obs_datetime` datetime NOT NULL,
  `department` varchar(255) NOT NULL,
  `area` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `severity` varchar(50) NOT NULL,
  `obs_desc` text NOT NULL,
  `obs_sugg` text DEFAULT NULL,
  `obs_photos` text DEFAULT NULL,
  `closure_desc` text DEFAULT NULL,
  `closure_photos` text DEFAULT NULL,
  `pending_on` bigint(20) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `target_date` varchar(100) DEFAULT NULL,
  `action_plan` text DEFAULT NULL,
  `responsibilities` varchar(100) DEFAULT NULL,
  `closure_date` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_log_violations`
--

CREATE TABLE `t_inshe_log_violations` (
  `id` int(11) NOT NULL,
  `permit_no` varchar(50) NOT NULL,
  `violation_details` text NOT NULL,
  `status` varchar(20) NOT NULL,
  `pending_on` varchar(20) DEFAULT NULL,
  `close_remarks` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_menus`
--

CREATE TABLE `t_inshe_menus` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `app_id` int(11) NOT NULL,
  `mas_id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `t_inshe_menus`
--

INSERT INTO `t_inshe_menus` (`id`, `name`, `app_id`, `mas_id`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Users', 0, 0, 'Active', '2024-12-29 23:06:43', NULL, '2024-12-29 23:08:54', NULL),
(2, 'Context Definations', 0, 0, 'Active', '2024-12-29 23:06:43', NULL, '2024-12-29 23:09:00', NULL),
(3, 'Org. Structure', 0, 0, 'Active', '2024-12-29 23:08:44', NULL, '2024-12-29 23:23:56', NULL),
(4, 'Dashboard', 1, 0, 'Active', '2024-12-29 23:08:44', NULL, '2024-12-29 23:10:21', NULL),
(5, 'Log SIO', 1, 0, 'Active', '2024-12-29 23:09:58', NULL, '2024-12-29 23:13:07', NULL),
(6, 'View SIO', 1, 0, 'Active', '2024-12-29 23:09:58', NULL, '2024-12-29 23:09:58', NULL),
(7, 'Assign PDC', 1, 0, 'Active', '2024-12-29 23:11:15', NULL, '2024-12-29 23:11:15', NULL),
(8, 'Action Taken', 1, 0, 'Active', '2024-12-29 23:11:15', NULL, '2024-12-29 23:11:15', NULL),
(9, 'Dashboard', 2, 0, 'Active', '2024-12-29 23:12:44', NULL, '2024-12-29 23:12:44', NULL),
(10, 'Log Permit', 2, 0, 'Active', '2024-12-29 23:12:44', NULL, '2024-12-29 23:12:44', NULL),
(11, 'View PTW', 2, 0, 'Active', '2024-12-29 23:13:54', NULL, '2024-12-29 23:13:54', NULL),
(12, 'Approve PTW', 2, 0, 'Active', '2024-12-29 23:13:54', NULL, '2024-12-29 23:13:54', NULL),
(13, 'Close PTW', 2, 0, 'Active', '2024-12-29 23:14:14', NULL, '2024-12-29 23:14:14', NULL),
(14, 'Log Violations', 2, 0, 'Active', '2024-12-29 23:15:01', NULL, '2024-12-29 23:15:01', NULL),
(15, 'View Violations', 2, 0, 'Active', '2024-12-29 23:15:01', NULL, '2024-12-29 23:15:01', NULL),
(16, 'Close Violations', 2, 0, 'Active', '2024-12-29 23:15:39', NULL, '2024-12-29 23:15:39', NULL),
(17, 'Dashboard', 3, 0, 'Active', '2024-12-29 23:15:39', NULL, '2024-12-29 23:15:39', NULL),
(18, 'Log Incident', 3, 0, 'Active', '2024-12-29 23:16:15', NULL, '2024-12-29 23:16:15', NULL),
(19, 'View Incident', 3, 0, 'Active', '2024-12-29 23:16:15', NULL, '2024-12-29 23:16:15', NULL),
(20, 'Team Formation', 3, 0, 'Active', '2024-12-29 23:16:56', NULL, '2024-12-29 23:16:56', NULL),
(21, 'Incident Categorization', 3, 0, 'Active', '2024-12-29 23:16:56', NULL, '2024-12-29 23:16:56', NULL),
(22, 'Investigation', 3, 0, 'Active', '2024-12-29 23:17:31', NULL, '2024-12-29 23:17:31', NULL),
(23, 'Close Incident', 3, 0, 'Active', '2024-12-29 23:17:31', NULL, '2024-12-29 23:17:31', NULL),
(24, 'Recomm. Closure', 3, 0, 'Active', '2024-12-29 23:18:20', NULL, '2024-12-29 23:18:20', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_org_structures`
--

CREATE TABLE `t_inshe_org_structures` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `head_user_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `t_inshe_org_structures`
--

INSERT INTO `t_inshe_org_structures` (`id`, `name`, `parent_id`, `category`, `head_user_id`, `is_active`, `is_deleted`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Atomberg', 0, 'COMP', NULL, 1, 0, '2024-12-29 23:20:53', NULL, '2024-12-29 23:22:53', NULL),
(2, 'Production', 1, 'DEPT', NULL, 1, 0, '2024-12-29 23:21:12', NULL, '2024-12-29 23:21:12', NULL),
(3, 'HR & Admin', 1, 'DEPT', NULL, 1, 0, '2024-12-29 23:21:12', NULL, '2024-12-29 23:21:12', NULL),
(4, 'Painthsop', 1, 'DEPT', NULL, 1, 0, '2024-12-29 23:21:12', NULL, '2024-12-29 23:21:12', NULL),
(5, 'Quality', 1, 'DEPT', NULL, 1, 0, '2024-12-29 23:21:12', NULL, '2024-12-29 23:21:12', NULL),
(6, 'Maintenance', 1, 'DEPT', NULL, 1, 0, '2024-12-29 23:21:12', NULL, '2024-12-29 23:21:12', NULL),
(7, 'Dispatch', 1, 'DEPT', NULL, 1, 0, '2024-12-29 23:21:12', NULL, '2024-12-29 23:21:12', NULL),
(8, 'Stores', 1, 'DEPT', NULL, 1, 0, '2024-12-29 23:21:13', NULL, '2024-12-29 23:21:13', NULL),
(9, 'Services', 1, 'DEPT', NULL, 1, 0, '2024-12-29 23:21:13', NULL, '2024-12-29 23:21:13', NULL),
(10, 'IT', 1, 'DEPT', NULL, 1, 0, '2024-12-29 23:21:13', NULL, '2024-12-29 23:21:13', NULL),
(11, 'EHS', 1, 'DEPT', NULL, 1, 0, '2024-12-29 23:21:13', NULL, '2024-12-29 23:21:13', NULL),
(12, 'Production Line 1', 2, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(13, 'Production Line 2', 2, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(14, 'Production Line 3', 2, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(15, 'Production Line 4', 2, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(16, 'Production Line 5', 2, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(17, 'Production Line 6', 2, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(18, 'Stator/Rotor Assembly Area', 2, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(19, 'Storage Racks - Front of Maint.Room', 2, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(20, 'Rework Area', 2, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(21, 'PSR Area', 2, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(22, 'Outer Premises', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(23, 'Fabrication Yard', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(24, 'Scrap Yard', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(25, 'Security Gate 1', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(26, 'Security Gate 2', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(27, 'Security Gate 3', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(28, 'Garden Area', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(29, 'Office Area - First Floor', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(30, 'Cafeteria', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(31, 'OHC', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(32, 'Creche', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(33, 'Reception', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(34, 'Production Office', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(35, 'Inward Yard Parking Area', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(36, 'Four Wheeler Parking Area', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(37, 'Two Wheeler Parking Area', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(38, 'Canteen Area', 3, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(39, 'Chemical Storage Area', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(40, 'Powder Storage Area', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(41, 'Powder coating loading area', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(42, 'Liquid Coating loading area', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(43, 'Base coat Booth', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(44, 'Top Coat Booth', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(45, 'Paint Kitchen', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(46, 'Primer Booth', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(47, 'Air Cleaning/Tagrag Zone', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(48, 'PT Line', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(49, 'PC WDO Oven', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(50, 'PC PBO Oven', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(51, 'LP WDO Oven', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(52, 'LP PBO Oven', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(53, 'LP Paint Kitchen', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(54, 'LP Packing Area', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(55, 'LPG Yard', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(56, 'Sludge Pit', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(57, 'PC Packing Area', 4, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(58, 'IQA', 5, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(59, '', 5, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(60, '', 5, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(61, 'OQA', 5, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(62, 'LQA', 5, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(63, 'Transformer Yard', 6, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(64, 'Compressor Room', 6, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(65, 'Fire Pump Room', 6, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(66, 'Electrical Room', 6, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(67, 'LT Panel Room', 6, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(68, 'Dispatch Office', 7, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(69, 'Dispatch Dock', 7, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(70, 'Dispatch yard', 7, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(71, 'Dispatch Rack storage', 7, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(72, 'Inward Dock Area', 8, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(73, 'Inward Yard Area', 8, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(74, 'RM Racks', 8, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(75, 'PM Racks', 8, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(76, 'Store office', 8, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(77, 'RT Charging Area', 8, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(78, 'Mezzanine Floor Rack - Storage', 8, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(79, 'Inward Storage Racks', 8, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(80, 'Repair factory', 9, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(81, 'Server Room', 10, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(82, 'ETP', 11, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(83, 'STP', 11, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(84, 'RO Plant', 11, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL),
(85, 'Hazardous Waste Storage Area', 11, 'AREA', NULL, 1, 0, '2024-12-29 23:21:36', NULL, '2024-12-29 23:21:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_ptw_configs`
--

CREATE TABLE `t_inshe_ptw_configs` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `checklist` text DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` varchar(100) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `t_inshe_ptw_configs`
--

INSERT INTO `t_inshe_ptw_configs` (`id`, `type`, `checklist`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Hazard Identification', 'Electrical Hazard', 'Active', NULL, '0', NULL, '0'),
(2, 'Hazard Identification', 'Confined Space', 'Active', NULL, '0', NULL, '0'),
(3, 'Hazard Identification', 'Work at Height', 'Active', NULL, '0', NULL, '0'),
(4, 'Hazard Identification', 'Hot Work', 'Active', NULL, '0', NULL, '0'),
(5, 'Hazard Identification', 'Cold Work', 'Active', NULL, '0', NULL, '0'),
(6, 'Hazard Identification', 'Compressed Air', 'Active', NULL, '0', NULL, '0'),
(7, 'Hazard Identification', 'Chemical Hazard', 'Active', NULL, '0', NULL, '0'),
(8, 'Hazard Identification', 'Dust/Fumes', 'Active', NULL, '0', NULL, '0'),
(9, 'Hazard Identification', 'Pressurised system', 'Active', NULL, '0', NULL, '0'),
(10, 'Hazard Identification', 'Lone Work', 'Active', NULL, '0', NULL, '0'),
(11, 'Hazard Identification', 'Unsafe access', 'Active', NULL, '0', NULL, '0'),
(12, 'Hazard Identification', 'Buried cables', 'Active', NULL, '0', NULL, '0'),
(13, 'Hazard Identification', 'Buries pipelines', 'Active', NULL, '0', NULL, '0'),
(14, 'Hazard Identification', 'Lifting Work', 'Active', NULL, '0', NULL, '0'),
(15, 'Risk Assessment', 'Is JSA Approved ?', 'Active', NULL, '0', NULL, '0'),
(16, 'Risk Assessment', 'Method Statement Approved?', 'Active', NULL, '0', NULL, '0'),
(17, 'Risk Assessment', 'Is induction training done for all?', 'Active', NULL, '0', NULL, '0'),
(18, 'PPE Required', 'Safety Googles', 'Active', NULL, '0', NULL, '0'),
(19, 'PPE Required', 'Helmet', 'Active', NULL, '0', NULL, '0'),
(20, 'PPE Required', 'Face Shield', 'Active', NULL, '0', NULL, '0'),
(21, 'PPE Required', 'Ear Plugs', 'Active', NULL, '0', NULL, '0'),
(22, 'PPE Required', 'Work specific Gloves ', 'Active', NULL, '0', NULL, '0'),
(23, 'PPE Required', 'Dust Mask', 'Active', NULL, '0', NULL, '0'),
(24, 'PPE Required', 'Breathing Apparatus', 'Active', NULL, '0', NULL, '0'),
(25, 'PPE Required', 'Electrical Gloves', 'Active', NULL, '0', NULL, '0'),
(26, 'PPE Required', 'Wielding Shield', 'Active', NULL, '0', NULL, '0'),
(27, 'PPE Required', 'Safety Shoes', 'Active', NULL, '0', NULL, '0'),
(28, 'PPE Required', 'Gum Boots', 'Active', NULL, '0', NULL, '0'),
(29, 'PPE Required', 'Safety Harness', 'Active', NULL, '0', NULL, '0'),
(30, 'PPE Required', 'Gas Mask', 'Active', NULL, '0', NULL, '0'),
(31, 'PPE Required', 'Temp Lifeline', 'Active', NULL, '0', NULL, '0'),
(32, 'General Work', 'Equipment/Work area inspected', 'Active', NULL, '0', NULL, '0'),
(33, 'General Work', 'Surrounding area checked, cleaned and covered', 'Active', NULL, '0', NULL, '0'),
(34, 'General Work', 'Equipment blinded/disconnected/closed/isolated', 'Active', NULL, '0', NULL, '0'),
(35, 'General Work', 'Equipment properly drained, and depressurized', 'Active', NULL, '0', NULL, '0'),
(36, 'General Work', 'Equipment electrically isolated and tagged', 'Active', NULL, '0', NULL, '0'),
(37, 'General Work', 'All  tools checked & covered in list of portable tools ?', 'Active', NULL, '0', NULL, '0'),
(38, 'General Work', 'Is lone worker hazard available?', 'Active', NULL, '0', NULL, '0'),
(39, 'Hot Work', 'Combustible material removed ', 'Active', NULL, '0', NULL, '0'),
(40, 'Hot Work', 'Checked for flammable or combustible gases', 'Active', NULL, '0', NULL, '0'),
(41, 'Hot Work', 'Adequate ventilation for fumes', 'Active', NULL, '0', NULL, '0'),
(42, 'Hot Work', 'Welding set equipped with VRD', 'Active', NULL, '0', NULL, '0'),
(43, 'Hot Work', 'Flame arrester available at both cylinder and torch.', 'Active', NULL, '0', NULL, '0'),
(44, 'Hot Work', 'Free access for approach of fire tenders has been maintained.', 'Active', NULL, '0', NULL, '0'),
(45, 'Hot Work', 'Welding Set earthed', 'Active', NULL, '0', NULL, '0'),
(46, 'Hot Work', 'Fire Extinguisher Available', 'Active', NULL, '0', NULL, '0'),
(47, 'Hot Work', 'Fire fighter alerted', 'Active', NULL, '0', NULL, '0'),
(48, 'Hot Work', 'Fire watch available', 'Active', NULL, '0', NULL, '0'),
(49, 'Hot Work', 'Place of work is dry', 'Active', NULL, '0', NULL, '0'),
(50, 'Hot Work', 'Supervision provided by (Atomberg\'s Emp):', 'Active', NULL, '0', NULL, '0'),
(51, 'Work at Height', 'Person working undergone vertigo test & work at height training?', 'Active', NULL, '0', NULL, '0'),
(52, 'Work at Height', 'Full body harness with double lanyard used & checked before use', 'Active', NULL, '0', NULL, '0'),
(53, 'Work at Height', 'Point of anchoring identified', 'Active', NULL, '0', NULL, '0'),
(54, 'Work at Height', 'Working Platform of good construction', 'Active', NULL, '0', NULL, '0'),
(55, 'Work at Height', 'Is tool harness available ?', 'Active', NULL, '0', NULL, '0'),
(56, 'Work at Height', 'Person working near work at height to wear helmet ?', 'Active', NULL, '0', NULL, '0'),
(57, 'Work at Height', 'Point of anchoring identified', 'Active', NULL, '0', NULL, '0'),
(58, 'Work at Height', 'Scaffolds been certified & tagged', 'Active', NULL, '0', NULL, '0'),
(59, 'Work at Height', 'IS scaffold checklist filled?', 'Active', NULL, '0', NULL, '0'),
(60, 'Work at Height', 'Is ladder checklist filled?', 'Active', NULL, '0', NULL, '0'),
(61, 'Work at Height', 'Is MEWP checklist filled?', 'Active', NULL, '0', NULL, '0'),
(62, 'Confined Space', 'Process/Service/Electrical isolated done', 'Active', NULL, '0', NULL, '0'),
(63, 'Confined Space', 'Space drained', 'Active', NULL, '0', NULL, '0'),
(64, 'Confined Space', 'Temp inside confined space comfortable to work', 'Active', NULL, '0', NULL, '0'),
(65, 'Confined Space', 'Air ventilation available', 'Active', NULL, '0', NULL, '0'),
(66, 'Confined Space', 'All equipment intrinsically safe/flameproof type', 'Active', NULL, '0', NULL, '0'),
(67, 'Confined Space', 'Only 24V supply used inside', 'Active', NULL, '0', NULL, '0'),
(68, 'Confined Space', 'Safe access available', 'Active', NULL, '0', NULL, '0'),
(69, 'Confined Space', 'Full body harness with double lanyard used', 'Active', NULL, '0', NULL, '0'),
(70, 'Confined Space', 'Evacuation possible', 'Active', NULL, '0', NULL, '0'),
(71, 'Confined Space', 'Is person trained for confined space training?', 'Active', NULL, '0', NULL, '0'),
(72, 'Confined Space', 'SCABA/Emergency Kit available', 'Active', NULL, '0', NULL, '0'),
(73, 'Lifiting Work', 'Requirements', 'Active', NULL, '0', NULL, '0'),
(74, 'Lifiting Work', 'Area around the work barricated?', 'Active', NULL, '0', NULL, '0'),
(75, 'Lifiting Work', 'All lifting tools and tackle certified and tested?', 'Active', NULL, '0', NULL, '0'),
(76, 'Lifiting Work', 'All machinery (crane, farhana etc) have valid lifting certificate?', 'Active', NULL, '0', NULL, '0'),
(77, 'Lifiting Work', 'Check and ensure no work under suspended load', 'Active', NULL, '0', NULL, '0'),
(78, 'Lifiting Work', 'Is lifting tool/equipment checklist filled', 'Active', NULL, '0', NULL, '0'),
(79, 'Lifiting Work', 'Is operator certified for work?				\r\n', 'Active', NULL, '0', NULL, '0'),
(80, 'Lifiting Work', 'People are trained about the work?', 'Active', NULL, '0', NULL, '0'),
(81, 'ESMS Work Permit', 'Risk analysis performed and attached to permit', 'Active', NULL, '0', NULL, '0'),
(82, 'ESMS Work Permit', 'All tools null required for the job are identified, available and inspected OK', 'Active', NULL, '0', NULL, '0'),
(83, 'ESMS Work Permit', 'Equipment to be worked upon has been de-energized as per LOTO standard', 'Active', NULL, '0', NULL, '0'),
(84, 'ESMS Work Permit', 'Equipment to be worked upon has been grounded', 'Active', NULL, '0', NULL, '0'),
(85, 'ESMS Work Permit', 'Authorized standby person available; Provided with PPE`s, equipments as per type of electrical work', 'Active', NULL, '0', NULL, '0'),
(86, 'ESMS Work Permit', 'Authorized person carrying out the job, trained and qualified in use of required procedure, tools / equipments, PPE`s, etc.', 'Active', NULL, '0', NULL, '0'),
(87, 'ESMS Work Permit', 'PPE`s requirements have been clearly identified, available at location and inspected OK', 'Active', NULL, '0', NULL, '0'),
(88, 'ESMS Work Permit', 'Equipment to be worked upon checked for absence of voltage', 'Active', NULL, '0', NULL, '0'),
(89, 'ESMS Work Permit', 'Area is cordon off and cautionary signage displayed', 'Active', NULL, '0', NULL, '0'),
(90, 'Tools and Equipment', 'Welding machine', 'Active', NULL, '0', NULL, '0'),
(91, 'Tools and Equipment', 'Gas cutting set and cylinders', 'Active', NULL, '0', NULL, '0'),
(92, 'Tools and Equipment', 'Portable electric tools	 Hydraulic / pneumatic tools', 'Active', NULL, '0', NULL, '0'),
(93, 'Tools and Equipment', 'Lifting tools and tackles', 'Active', NULL, '0', NULL, '0'),
(94, 'Tools and Equipment', 'Fixed crane', 'Active', NULL, '0', NULL, '0'),
(95, 'Tools and Equipment', 'Mobile Crane', 'Active', NULL, '0', NULL, '0'),
(96, 'Tools and Equipment', 'Fork lift', 'Active', NULL, '0', NULL, '0'),
(97, 'Tools and Equipment', 'Excavator', 'Active', NULL, '0', NULL, '0'),
(98, 'Tools and Equipment', 'Heavy vehicles', 'Active', NULL, '0', NULL, '0'),
(99, 'Tools and Equipment', 'Portable ladders', 'Active', NULL, '0', NULL, '0'),
(100, 'Tools and Equipment', 'Scaffold', 'Active', NULL, '0', NULL, '0'),
(101, 'Tools and Equipment', 'Non sparking tools', 'Active', NULL, '0', NULL, '0'),
(102, 'Tools and Equipment', 'Temporary electrical supply', 'Active', NULL, '0', NULL, '0');

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_roles`
--

CREATE TABLE `t_inshe_roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `t_inshe_roles`
--

INSERT INTO `t_inshe_roles` (`id`, `name`, `status`, `created_at`, `created_by`) VALUES
(1, 'SU', 1, '2024-12-29 23:01:56', NULL),
(2, 'Administrator', 1, '2024-12-29 23:01:56', NULL),
(3, 'Observer', 1, '2024-12-29 23:02:18', NULL),
(4, 'Department Head', 1, '2024-12-29 23:02:52', NULL),
(5, 'Area Incharge', 1, '2024-12-29 23:02:52', NULL),
(6, 'Initiator', 1, '2024-12-29 23:03:20', NULL),
(7, 'Custodian', 1, '2024-12-29 23:03:20', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_role_menus`
--

CREATE TABLE `t_inshe_role_menus` (
  `id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `t_inshe_role_menus`
--

INSERT INTO `t_inshe_role_menus` (`id`, `menu_id`, `role_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(7, 7, 1),
(8, 8, 1),
(9, 9, 1),
(10, 10, 1),
(11, 11, 1),
(12, 12, 1),
(13, 13, 1),
(14, 14, 1),
(15, 15, 1),
(16, 16, 1),
(17, 17, 1),
(18, 18, 1),
(19, 19, 1),
(20, 20, 1),
(21, 21, 1),
(22, 22, 1),
(23, 23, 1),
(24, 24, 1);

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_users`
--

CREATE TABLE `t_inshe_users` (
  `id` int(11) NOT NULL,
  `emp_no` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `password` text NOT NULL,
  `dob` date DEFAULT NULL,
  `emp_type` enum('Permanent','Contractor','Intern','Trainee') DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `gender` enum('Male','Female','other') DEFAULT NULL,
  `job` date DEFAULT NULL,
  `rm` varchar(20) DEFAULT NULL,
  `location` varchar(50) NOT NULL,
  `area` varchar(100) DEFAULT NULL,
  `profile_pic_url` varchar(100) NOT NULL,
  `logged_in` tinyint(1) DEFAULT 0,
  `status` enum('Active','InActive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `t_inshe_users`
--

INSERT INTO `t_inshe_users` (`id`, `emp_no`, `name`, `email`, `mobile`, `password`, `dob`, `emp_type`, `department`, `designation`, `gender`, `job`, `rm`, `location`, `area`, `profile_pic_url`, `logged_in`, `status`, `created_at`, `created_by`) VALUES
(1, '1', 'R2W', 'sysadmin@root2wings.com', '9471567071', '$2a$10$po5sZ304XDepmXd7tzUHquVBQ0wSZBM5RjE2J2dgzhmVkpmKkqa.q', NULL, 'Contractor', 'IT', 'Super Admin', 'Male', NULL, NULL, 'JH', NULL, '', 1, 'Active', '2024-12-29 17:29:31', 0);

-- --------------------------------------------------------

--
-- Table structure for table `t_inshe_user_role`
--

CREATE TABLE `t_inshe_user_role` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `t_inshe_user_role`
--

INSERT INTO `t_inshe_user_role` (`id`, `user_id`, `role_id`) VALUES
(1, 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `t_inshe_apps`
--
ALTER TABLE `t_inshe_apps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_context_definitions`
--
ALTER TABLE `t_inshe_context_definitions`
  ADD PRIMARY KEY (`context_id`);

--
-- Indexes for table `t_inshe_contractors`
--
ALTER TABLE `t_inshe_contractors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_incident_documents`
--
ALTER TABLE `t_inshe_incident_documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_incident_header`
--
ALTER TABLE `t_inshe_incident_header`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_incident_injury_dtls`
--
ALTER TABLE `t_inshe_incident_injury_dtls`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_incident_investigation`
--
ALTER TABLE `t_inshe_incident_investigation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_incident_recommendation`
--
ALTER TABLE `t_inshe_incident_recommendation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_incident_team`
--
ALTER TABLE `t_inshe_incident_team`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_log_ptw`
--
ALTER TABLE `t_inshe_log_ptw`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_log_sio`
--
ALTER TABLE `t_inshe_log_sio`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_log_violations`
--
ALTER TABLE `t_inshe_log_violations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_menus`
--
ALTER TABLE `t_inshe_menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_org_structures`
--
ALTER TABLE `t_inshe_org_structures`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_ptw_configs`
--
ALTER TABLE `t_inshe_ptw_configs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_roles`
--
ALTER TABLE `t_inshe_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_role_menus`
--
ALTER TABLE `t_inshe_role_menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_inshe_users`
--
ALTER TABLE `t_inshe_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `t_inshe_user_role`
--
ALTER TABLE `t_inshe_user_role`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `t_inshe_apps`
--
ALTER TABLE `t_inshe_apps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `t_inshe_context_definitions`
--
ALTER TABLE `t_inshe_context_definitions`
  MODIFY `context_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `t_inshe_contractors`
--
ALTER TABLE `t_inshe_contractors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `t_inshe_incident_documents`
--
ALTER TABLE `t_inshe_incident_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `t_inshe_incident_header`
--
ALTER TABLE `t_inshe_incident_header`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `t_inshe_incident_injury_dtls`
--
ALTER TABLE `t_inshe_incident_injury_dtls`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `t_inshe_incident_investigation`
--
ALTER TABLE `t_inshe_incident_investigation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `t_inshe_incident_recommendation`
--
ALTER TABLE `t_inshe_incident_recommendation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `t_inshe_incident_team`
--
ALTER TABLE `t_inshe_incident_team`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `t_inshe_log_ptw`
--
ALTER TABLE `t_inshe_log_ptw`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `t_inshe_log_sio`
--
ALTER TABLE `t_inshe_log_sio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `t_inshe_log_violations`
--
ALTER TABLE `t_inshe_log_violations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `t_inshe_menus`
--
ALTER TABLE `t_inshe_menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `t_inshe_org_structures`
--
ALTER TABLE `t_inshe_org_structures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `t_inshe_ptw_configs`
--
ALTER TABLE `t_inshe_ptw_configs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `t_inshe_roles`
--
ALTER TABLE `t_inshe_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `t_inshe_role_menus`
--
ALTER TABLE `t_inshe_role_menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `t_inshe_users`
--
ALTER TABLE `t_inshe_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `t_inshe_user_role`
--
ALTER TABLE `t_inshe_user_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
