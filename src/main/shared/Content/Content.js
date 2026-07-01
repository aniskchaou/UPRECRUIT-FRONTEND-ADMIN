
import React from 'react';
import './Content.css';
import Configuration from '../../../modules/shared/Configuration/Configuration';

import Candidate from '../../../modules/candidate/Candidate/Candidate';
import Interview from '../../../modules/interview/Interview/Interview';
import Job from '../../../modules/job/Job/Job';
import Location from '../../../modules/location/Location/Location';
import Skill from '../../../modules/skill/Skill/Skill';
import Staff from '../../../modules/staff/Staff/Staff';
import Task from '../../../modules/task/Task/Task';
import DashBoard from '../../../modules/shared/DashBoard/DashBoard';
import { Route, Switch, useLocation, NavLink } from "react-router-dom"
import ApplyJob from '../../../modules/applyjob/ApplyJob/ApplyJob';
import Login from '../Login/Login';

import AddJob from '../../../modules/job/AddJob/AddJob';
import AddInterview from '../../../modules/interview/AddInterview/AddInterview';
import AddTask from '../../../modules/task/AddTask/AddTask';
import Profile from '../../../modules/shared/Profile/Profile';
import Company from '../../../components/Company/Company'
import FirstInterview from '../../../components/FirstInterview/FirstInterview';
import SecondInterview from '../../../components/SecondInterview/SecondInterview';
import InitialQualification from '../../../components/InitialQualification/InitialQualification';
import ContractProposal from '../../../components/ContractProposal/ContractProposal';
import ContractSigned from '../../../components/ContractSigned/ContractSigned';
import RefusalFeedBack from '../../../components/RefusalFeedBack/RefusalFeedBack'
import AcceptanceFeedBack from '../../../components/AcceptanceFeedBack/AcceptanceFeedBack'
import Roles from '../../../components/Roles/Roles'
import ToDo from '../../../components/ToDo/ToDo'

import HeaderPage from '../../../components/HeaderPage/HeaderPage'
import JobsPage from '../../../components/JobsPage/JobsPage'
import CompaniesPage from '../../../components/CompaniesPage/CompaniesPage'
import ServicePage from '../../../components/ServicePage/ServicePage'
import SummaryPage from '../../../components/SummaryPage/SummaryPage'
import FooterPage from '../../../components/FooterPage/FooterPage'
import TestimonialPage from '../../../components/TestimonialPage/TestimonialPage'
import NewsLetterPage from '../../../components/NewsLetterPage/NewsLetterPage'
import JobAnalytics from '../../../components/JobAnalytics/JobAnalytics'
import JobApplicationAnalytics from '../../../components/JobApplicationAnalytics/JobApplicationAnalytics';
import CandidateAnalytics from '../../../components/CandidateAnalytics/CandidateAnalytics'
import User from '../../../modules/user/User/User'
import EnterpriseInternalMobility from '../../../modules/enterprise/EnterpriseInternalMobility/EnterpriseInternalMobility';
import EnterpriseReferral from '../../../modules/enterprise/EnterpriseReferral/EnterpriseReferral';
import EnterpriseAssessment from '../../../modules/enterprise/EnterpriseAssessment/EnterpriseAssessment';
import EnterpriseOffers from '../../../modules/enterprise/EnterpriseOffers/EnterpriseOffers';
import EnterpriseAnalytics from '../../../modules/enterprise/EnterpriseAnalytics/EnterpriseAnalytics';
import EnterpriseIntegrations from '../../../modules/enterprise/EnterpriseIntegrations/EnterpriseIntegrations';
import AdminBilling from '../../../modules/admin/AdminBilling/AdminBilling';
import Organization from '../../../modules/organization/Organization/Organization';
import Communication from '../../../modules/communication/Communication/Communication';
import AuditLogs from '../../../modules/audit/AuditLogs/AuditLogs';
import TalentPool from '../../../modules/talent/TalentPool/TalentPool';
import ApprovalWorkflow from '../../../modules/approvalworkflow/ApprovalWorkflow/ApprovalWorkflow';
import Security from '../../../modules/security/Security/Security';

const DEFAULT_ROUTE_META = {
  title: 'Workspace',
  subtitle: 'Run your recruitment operations with clear actions and always-on visibility.',
  stats: [
    { value: 'Live', label: 'System status' },
    { value: '24/7', label: 'Admin coverage' },
  ],
  actions: [
    { to: '/dashboard', label: 'Open Dashboard' },
    { to: '/apply', label: 'View Applications' },
  ],
};

const ROUTE_META = {
  '/': { ...DEFAULT_ROUTE_META, title: 'Dashboard' },
  '/dashboard': { ...DEFAULT_ROUTE_META, title: 'Dashboard' },
  '/apply': {
    title: 'Applications',
    subtitle: 'Track every candidate application from submission to final decision without losing momentum.',
    stats: [
      { value: '142', label: 'Active applications' },
      { value: '16', label: 'Pending review' },
    ],
    actions: [
      { to: '/interview', label: 'Move to Interviews' },
      { to: '/candidate', label: 'Open Candidate Profiles' },
    ],
  },
  '/candidate': {
    title: 'Candidate Management',
    subtitle: 'Keep candidate records complete and make faster shortlisting decisions with cleaner data.',
    stats: [
      { value: '84', label: 'Profiles updated' },
      { value: '12', label: 'Ready this week' },
    ],
    actions: [
      { to: '/candidate-analytics', label: 'Open Candidate Analytics' },
      { to: '/language', label: 'Manage Languages' },
    ],
  },
  '/interview': {
    title: 'Interview Pipeline',
    subtitle: 'Coordinate interview stages with fewer delays and stronger visibility for your hiring team.',
    stats: [
      { value: '28', label: 'Interviews scheduled' },
      { value: '9', label: 'Final round' },
    ],
    actions: [
      { to: '/first-interview', label: 'First Interview Stage' },
      { to: '/second-interview', label: 'Second Interview Stage' },
    ],
  },
  '/job': {
    title: 'Job Offers',
    subtitle: 'Publish quality offers, align requirements, and keep role lifecycle under control.',
    stats: [
      { value: '24', label: 'Open roles' },
      { value: '7', label: 'Closing soon' },
    ],
    actions: [
      { to: '/job-analytics', label: 'View Job Analytics' },
      { to: '/skill', label: 'Update Skills' },
    ],
  },
  '/company': {
    title: 'Companies',
    subtitle: 'Manage partner companies, contacts, and collaboration quality from one place.',
    stats: [
      { value: '31', label: 'Partner companies' },
      { value: '6', label: 'Priority accounts' },
    ],
    actions: [
      { to: '/companies', label: 'Edit Company Content' },
      { to: '/service', label: 'Service Sections' },
    ],
  },
  '/users': {
    title: 'User Management',
    subtitle: 'Control job seeker and recruiter lifecycle, trust actions, support workflows, and compliance operations.',
    stats: [
      { value: '2', label: 'User categories' },
      { value: 'GDPR', label: 'Export ready' },
    ],
    actions: [
      { to: '/roles', label: 'Review Roles' },
      { to: '/configuration', label: 'Open Settings' },
    ],
  },
  '/configuration': {
    title: 'System Configuration',
    subtitle: 'Control platform settings, security posture, compliance workflows, templates, and public content from one admin workspace.',
    stats: [
      { value: '6', label: 'Control domains' },
      { value: '2', label: 'New admin suites' },
    ],
    actions: [
      { to: '/profile', label: 'Account Settings' },
      { to: '/dashboard', label: 'Return to Dashboard' },
    ],
  },
  '/profile': {
    title: 'User Profile',
    subtitle: 'Keep your profile, preferences, and personal access details up to date.',
    stats: [
      { value: '98%', label: 'Profile completion' },
      { value: '2FA', label: 'Security state' },
    ],
    actions: [
      { to: '/users', label: 'Team Directory' },
      { to: '/configuration', label: 'Platform Settings' },
    ],
  },
  '/job-analytics': {
    title: 'Job Analytics',
    subtitle: 'Measure demand, conversion, and time-to-fill trends to optimize role performance.',
    stats: [
      { value: '67%', label: 'Healthy pipelines' },
      { value: '19d', label: 'Avg. fill time' },
    ],
    actions: [
      { to: '/job', label: 'Back to Job Offers' },
      { to: '/job-application-analytics', label: 'Application Analytics' },
    ],
  },
  '/job-application-analytics': {
    title: 'Application Analytics',
    subtitle: 'Understand source quality and conversion drop-offs across the recruitment funnel.',
    stats: [
      { value: '1.8k', label: 'Monthly applicants' },
      { value: '21%', label: 'Interview conversion' },
    ],
    actions: [
      { to: '/apply', label: 'Open Applications' },
      { to: '/candidate-analytics', label: 'Candidate Insights' },
    ],
  },
  '/candidate-analytics': {
    title: 'Candidate Analytics',
    subtitle: 'Track candidate quality, progression speed, and decision consistency by stage.',
    stats: [
      { value: '73%', label: 'Qualified rate' },
      { value: '11d', label: 'Avg. progression' },
    ],
    actions: [
      { to: '/candidate', label: 'Open Candidates' },
      { to: '/interview', label: 'Interview Pipeline' },
    ],
  },
  '/roles': {
    title: 'Roles & Permissions',
    subtitle: 'Control role definitions and permission boundaries to keep operations secure and scalable.',
    stats: [
      { value: '6', label: 'Role templates' },
      { value: '0', label: 'Access conflicts' },
    ],
    actions: [
      { to: '/users', label: 'Manage Team Users' },
      { to: '/configuration', label: 'Security Settings' },
    ],
  },
  '/todo': {
    title: 'Task Board',
    subtitle: 'Track operational tasks and ensure execution quality across your recruitment workflow.',
    stats: [
      { value: '14', label: 'Open tasks' },
      { value: '93%', label: 'On-time completion' },
    ],
    actions: [
      { to: '/task', label: 'Task Module' },
      { to: '/dashboard', label: 'Executive Overview' },
    ],
  },
  '/refusal': {
    title: 'Refusal Feedback',
    subtitle: 'Capture refusal reasons and improve candidate communication at each rejection step.',
    stats: [
      { value: '12', label: 'Templates active' },
      { value: '98%', label: 'Message coverage' },
    ],
    actions: [
      { to: '/acceptance', label: 'Acceptance Feedback' },
      { to: '/candidate', label: 'Candidate List' },
    ],
  },
  '/acceptance': {
    title: 'Acceptance Feedback',
    subtitle: 'Standardize acceptance follow-up and improve onboarding readiness for successful hires.',
    stats: [
      { value: '9', label: 'Acceptance scripts' },
      { value: '96%', label: 'Response quality' },
    ],
    actions: [
      { to: '/refusal', label: 'Refusal Feedback' },
      { to: '/interview', label: 'Interview Pipeline' },
    ],
  },
  '/header': {
    title: 'Header CMS',
    subtitle: 'Design trust-first first impressions with a polished homepage header configuration.',
    stats: [
      { value: '3', label: 'Hero variants' },
      { value: 'A/B', label: 'Testing enabled' },
    ],
    actions: [
      { to: '/summary', label: 'Summary Section' },
      { to: '/service', label: 'Service Section' },
    ],
  },
  '/footer': {
    title: 'Footer CMS',
    subtitle: 'Keep footer links, contact content, and legal information complete and aligned.',
    stats: [
      { value: '24', label: 'Active footer links' },
      { value: '100%', label: 'Compliance check' },
    ],
    actions: [
      { to: '/newsletter', label: 'Newsletter Section' },
      { to: '/header', label: 'Header Section' },
    ],
  },
  '/summary': {
    title: 'Summary CMS',
    subtitle: 'Shape your value proposition with concise summary blocks and proof-oriented messaging.',
    stats: [
      { value: '8', label: 'Summary items' },
      { value: '92%', label: 'Content score' },
    ],
    actions: [
      { to: '/testimonials', label: 'Testimonials' },
      { to: '/companies', label: 'Companies Section' },
    ],
  },
  '/newsletter': {
    title: 'Newsletter CMS',
    subtitle: 'Configure newsletter blocks to grow your audience and maintain candidate engagement.',
    stats: [
      { value: '4.2%', label: 'Avg. sign-up rate' },
      { value: '2', label: 'Active forms' },
    ],
    actions: [
      { to: '/newsletters', label: 'Newsletter Entries' },
      { to: '/footer', label: 'Footer Section' },
    ],
  },
  '/service': {
    title: 'Service CMS',
    subtitle: 'Present services with stronger hierarchy and clearer conversion-oriented messaging.',
    stats: [
      { value: '11', label: 'Service cards' },
      { value: '3', label: 'Highlighted plans' },
    ],
    actions: [
      { to: '/jobs', label: 'Jobs Section' },
      { to: '/companies', label: 'Companies Section' },
    ],
  },
  '/companies': {
    title: 'Companies Page CMS',
    subtitle: 'Curate company page sections to strengthen social proof and employer credibility.',
    stats: [
      { value: '31', label: 'Company entries' },
      { value: 'Top 8', label: 'Featured partners' },
    ],
    actions: [
      { to: '/company', label: 'Company Records' },
      { to: '/testimonials', label: 'Testimonials' },
    ],
  },
  '/jobs': {
    title: 'Jobs Page CMS',
    subtitle: 'Control job-page blocks and improve how opportunities are presented to applicants.',
    stats: [
      { value: '27', label: 'Published openings' },
      { value: '3.8%', label: 'Page conversion' },
    ],
    actions: [
      { to: '/job', label: 'Job Offers' },
      { to: '/job-analytics', label: 'Job Analytics' },
    ],
  },
  '/testimonials': {
    title: 'Testimonials CMS',
    subtitle: 'Manage testimonial credibility with curated quotes, roles, and success highlights.',
    stats: [
      { value: '18', label: 'Published testimonials' },
      { value: '4.7/5', label: 'Avg. sentiment' },
    ],
    actions: [
      { to: '/summary', label: 'Summary Section' },
      { to: '/service', label: 'Service Section' },
    ],
  },
  '/newsletters': {
    title: 'Newsletter Audience',
    subtitle: 'Monitor subscriber entries and keep mailing list quality high over time.',
    stats: [
      { value: '2.1k', label: 'Subscribers' },
      { value: '97%', label: 'Valid emails' },
    ],
    actions: [
      { to: '/newsletter', label: 'Newsletter CMS' },
      { to: '/footer', label: 'Footer Section' },
    ],
  },
  '/first-interview': {
    title: 'First Interview Stage',
    subtitle: 'Control first-round evaluation quality with clear criteria and consistent notes.',
    stats: [
      { value: '42', label: 'Candidates in stage' },
      { value: '87%', label: 'Review completion' },
    ],
    actions: [
      { to: '/second-interview', label: 'Second Interview' },
      { to: '/interview', label: 'Interview Pipeline' },
    ],
  },
  '/second-interview': {
    title: 'Second Interview Stage',
    subtitle: 'Finalize evaluations for top candidates with deeper assessment and role-fit checks.',
    stats: [
      { value: '19', label: 'Candidates in stage' },
      { value: '63%', label: 'Pass-through ratio' },
    ],
    actions: [
      { to: '/contract-proposal', label: 'Contract Proposal' },
      { to: '/interview', label: 'Interview Pipeline' },
    ],
  },
  '/initial-qualification': {
    title: 'Initial Qualification',
    subtitle: 'Apply qualification gates early so only high-fit candidates enter interview flow.',
    stats: [
      { value: '58%', label: 'Qualification rate' },
      { value: '1.7d', label: 'Avg. first response' },
    ],
    actions: [
      { to: '/first-interview', label: 'Move to First Interview' },
      { to: '/candidate', label: 'Candidate Profiles' },
    ],
  },
  '/contract-proposal': {
    title: 'Contract Proposal',
    subtitle: 'Draft and track proposal quality to improve conversion at the offer stage.',
    stats: [
      { value: '15', label: 'Pending proposals' },
      { value: '72%', label: 'Acceptance tendency' },
    ],
    actions: [
      { to: '/contract-signed', label: 'Signed Contracts' },
      { to: '/job', label: 'Job Offers' },
    ],
  },
  '/contract-signed': {
    title: 'Signed Contracts',
    subtitle: 'Keep signed contract records centralized and ensure onboarding handoff is clean.',
    stats: [
      { value: '41', label: 'Signed this quarter' },
      { value: '100%', label: 'Archived safely' },
    ],
    actions: [
      { to: '/contract-renewal', label: 'Renewals' },
      { to: '/dashboard', label: 'Executive Dashboard' },
    ],
  },
  '/category': {
    title: 'Categories',
    subtitle: 'Organize roles and services with cleaner category structures for faster filtering.',
    stats: [
      { value: '22', label: 'Categories active' },
      { value: '5', label: 'Updated this month' },
    ],
    actions: [
      { to: '/job', label: 'Job Offers' },
      { to: '/skill', label: 'Skill Library' },
    ],
  },
  '/location': {
    title: 'Locations',
    subtitle: 'Manage recruitment locations to align offers, candidates, and hiring capacity.',
    stats: [
      { value: '14', label: 'Cities configured' },
      { value: '3', label: 'Remote hubs' },
    ],
    actions: [
      { to: '/job', label: 'Job Offers' },
      { to: '/company', label: 'Companies' },
    ],
  },
  '/skill': {
    title: 'Skills',
    subtitle: 'Maintain a reliable skills catalog to improve candidate-role matching quality.',
    stats: [
      { value: '96', label: 'Skills available' },
      { value: '8', label: 'New this quarter' },
    ],
    actions: [
      { to: '/job', label: 'Job Offers' },
      { to: '/candidate', label: 'Candidate Profiles' },
    ],
  },
  '/staff': {
    title: 'Staff',
    subtitle: 'Coordinate hiring staff records and ensure interview ownership stays clear.',
    stats: [
      { value: '18', label: 'Recruitment staff' },
      { value: '4', label: 'Team leads' },
    ],
    actions: [
      { to: '/users', label: 'User Accounts' },
      { to: '/interview', label: 'Interview Pipeline' },
    ],
  },
  '/task': {
    title: 'Task Management',
    subtitle: 'Track operational tasks and improve execution consistency for the recruiting team.',
    stats: [
      { value: '37', label: 'Tasks in board' },
      { value: '91%', label: 'Completion rate' },
    ],
    actions: [
      { to: '/todo', label: 'Quick Task Board' },
      { to: '/dashboard', label: 'Operations Dashboard' },
    ],
  },
  '/language': {
    title: 'Language Library',
    subtitle: 'Maintain language capabilities to align candidate communication and role needs.',
    stats: [
      { value: '11', label: 'Languages configured' },
      { value: '5', label: 'Primary market langs' },
    ],
    actions: [
      { to: '/candidate', label: 'Candidate Profiles' },
      { to: '/degree', label: 'Degree Library' },
    ],
  },
  '/degree': {
    title: 'Degree Library',
    subtitle: 'Standardize degree records for stronger qualification checks in hiring flow.',
    stats: [
      { value: '27', label: 'Degree entries' },
      { value: '6', label: 'Top-tier mappings' },
    ],
    actions: [
      { to: '/education', label: 'Education Records' },
      { to: '/candidate', label: 'Candidate Profiles' },
    ],
  },
  '/experience': {
    title: 'Experience Library',
    subtitle: 'Define experience levels and align evaluation criteria across your teams.',
    stats: [
      { value: '9', label: 'Experience levels' },
      { value: '3', label: 'Priority tiers' },
    ],
    actions: [
      { to: '/job', label: 'Job Offers' },
      { to: '/candidate', label: 'Candidate Profiles' },
    ],
  },
  '/education': {
    title: 'Education Records',
    subtitle: 'Curate education structures for clearer candidate qualification comparisons.',
    stats: [
      { value: '64', label: 'Education records' },
      { value: '95%', label: 'Validation quality' },
    ],
    actions: [
      { to: '/degree', label: 'Degree Library' },
      { to: '/candidate', label: 'Candidate Profiles' },
    ],
  },
  '/contract-renewal': {
    title: 'Contract Renewals',
    subtitle: 'Track and execute renewals proactively to avoid contract interruption risk.',
    stats: [
      { value: '17', label: 'Renewals pending' },
      { value: '6', label: 'Due this month' },
    ],
    actions: [
      { to: '/contract-signed', label: 'Signed Contracts' },
      { to: '/type-contract', label: 'Contract Types' },
    ],
  },
  '/type-contract': {
    title: 'Contract Types',
    subtitle: 'Define contract templates and ensure offer generation follows policy standards.',
    stats: [
      { value: '8', label: 'Contract templates' },
      { value: '100%', label: 'Policy compliance' },
    ],
    actions: [
      { to: '/contract-proposal', label: 'Contract Proposals' },
      { to: '/job', label: 'Job Offers' },
    ],
  },
  '/add-job': {
    title: 'Create Job',
    subtitle: 'Publish a new role with complete details to improve applicant quality from day one.',
    stats: [
      { value: 'Step 1', label: 'Role basics' },
      { value: 'Step 2', label: 'Requirements' },
    ],
    actions: [
      { to: '/job', label: 'Back to Jobs' },
      { to: '/job-analytics', label: 'Job Analytics' },
    ],
  },
  '/add-task': {
    title: 'Create Task',
    subtitle: 'Add operational tasks with clear ownership to keep team execution predictable.',
    stats: [
      { value: 'Owner', label: 'Assign responsibility' },
      { value: 'Due Date', label: 'Track deadline' },
    ],
    actions: [
      { to: '/task', label: 'Back to Tasks' },
      { to: '/todo', label: 'Quick Task Board' },
    ],
  },
  '/add-interview': {
    title: 'Schedule Interview',
    subtitle: 'Plan interview events with accurate slots, owners, and context for each candidate.',
    stats: [
      { value: 'Slot', label: 'Time and date' },
      { value: 'Panel', label: 'Interviewer assignment' },
    ],
    actions: [
      { to: '/interview', label: 'Interview List' },
      { to: '/candidate', label: 'Candidate Profiles' },
    ],
  },
  '/frontoffice': {
    title: 'Front Office Gateway',
    subtitle: 'Access the backend front-office templates directly from the React admin workspace.',
    stats: [
      { value: 'HBS', label: 'Template engine' },
      { value: 'Live', label: 'Preview mode' },
    ],
    actions: [
      { to: '/frontoffice/home', label: 'Open Home Template' },
      { to: '/frontoffice/jobs', label: 'Open Jobs Template' },
    ],
  },
  '/frontoffice/home': {
    title: 'Front Office Home',
    subtitle: 'Preview the home template rendered from the backend handlebars view.',
    stats: [
      { value: 'Index', label: 'Main page' },
      { value: 'SSR', label: 'Server rendered' },
    ],
    actions: [
      { to: '/frontoffice/jobs', label: 'Jobs Template' },
      { to: '/frontoffice/companies', label: 'Companies Template' },
    ],
  },
  '/frontoffice/job-board': {
    title: 'Front Office Job Board Portal',
    subtitle: 'Open a premium job-board portal template with board lanes and conversion-focused application flow.',
    stats: [
      { value: 'Portal', label: 'Template type' },
      { value: 'Live', label: 'Front-office route' },
    ],
    actions: [
      { to: '/frontoffice/jobs', label: 'Jobs Template' },
      { to: '/frontoffice/home', label: 'Home Template' },
    ],
  },
  '/frontoffice/jobs': {
    title: 'Front Office Jobs',
    subtitle: 'Open the jobs listing template through a React route.',
    stats: [
      { value: 'Jobs', label: 'Listing page' },
      { value: 'Live', label: 'Backend route' },
    ],
    actions: [
      { to: '/frontoffice/home', label: 'Home Template' },
      { to: '/frontoffice/register', label: 'Register Template' },
    ],
  },
  '/frontoffice/companies': {
    title: 'Front Office Companies',
    subtitle: 'Open the companies template and keep this preview inside the admin app.',
    stats: [
      { value: 'Companies', label: 'Directory page' },
      { value: 'Live', label: 'Backend route' },
    ],
    actions: [
      { to: '/frontoffice/home', label: 'Home Template' },
      { to: '/frontoffice/jobs', label: 'Jobs Template' },
    ],
  },
  '/frontoffice/login': {
    title: 'Front Office Login',
    subtitle: 'Open candidate or recruiter login access from one shared route.',
    stats: [
      { value: 'Auth', label: 'Template' },
      { value: 'Public', label: 'Candidate + Recruiter access' },
    ],
    actions: [
      { to: '/frontoffice/register', label: 'Register Template' },
      { to: '/frontoffice/home', label: 'Home Template' },
    ],
  },
  '/frontoffice/register': {
    title: 'Front Office Register',
    subtitle: 'Open the candidate registration template from the backend route.',
    stats: [
      { value: 'Signup', label: 'Template' },
      { value: 'Public', label: 'Candidate access' },
    ],
    actions: [
      { to: '/frontoffice/login', label: 'Login Template' },
      { to: '/frontoffice/home', label: 'Home Template' },
    ],
  },
  '/frontoffice/member': {
    title: 'Front Office Member Hub',
    subtitle: 'Open the logged-in candidate workspace with profile, applications, communication, and interview scheduling tools.',
    stats: [
      { value: 'Member', label: 'Private workspace' },
      { value: 'Live', label: 'Front-office route' },
    ],
    actions: [
      { to: '/frontoffice/jobs', label: 'Jobs Template' },
      { to: '/frontoffice/home', label: 'Home Template' },
    ],
  },
  '/frontoffice/recruiter': {
    title: 'Front Office Recruiter Hub',
    subtitle: 'Open the recruiter workspace with account management, team collaboration, and company profile operations.',
    stats: [
      { value: 'Recruiter', label: 'Private workspace' },
      { value: 'Live', label: 'Front-office route' },
    ],
    actions: [
      { to: '/frontoffice/login', label: 'Login' },
      { to: '/frontoffice/companies', label: 'Companies Template' },
    ],
  },
  '/enterprise/org': {
    title: 'Multi-Company Manager',
    subtitle: 'Manage holding groups, subsidiaries, brands, departments and cost centers at enterprise scale.',
    stats: [
      { value: 'Org', label: 'Hierarchy module' },
      { value: 'Live', label: 'Enterprise route' },
    ],
    actions: [
      { to: '/enterprise/ats', label: 'Advanced ATS' },
      { to: '/enterprise/crm', label: 'Talent CRM' },
    ],
  },
  '/enterprise/ats': {
    title: 'Enterprise ATS',
    subtitle: 'Manage thousands of candidates with a 10-stage pipeline, bulk actions, and conditional auto-rules.',
    stats: [
      { value: '10', label: 'Pipeline stages' },
      { value: 'Bulk', label: 'Mass actions' },
    ],
    actions: [
      { to: '/enterprise/org', label: 'Org Manager' },
      { to: '/enterprise/ai', label: 'AI Recruiting' },
    ],
  },
  '/enterprise/crm': {
    title: 'Talent CRM',
    subtitle: 'Nurture prospects before they apply — talent pools, relationship tracking, tagging and campaigns.',
    stats: [
      { value: 'CRM', label: 'Proactive sourcing' },
      { value: 'Live', label: 'Enterprise route' },
    ],
    actions: [
      { to: '/enterprise/ats', label: 'Pipeline ATS' },
      { to: '/enterprise/ai', label: 'AI Matching' },
    ],
  },
  '/enterprise/ai': {
    title: 'AI Recruiting',
    subtitle: 'AI resume parsing, candidate matching, automated ranking, JD generation and interview scorecards.',
    stats: [
      { value: 'AI', label: 'Powered module' },
      { value: 'Live', label: 'Enterprise route' },
    ],
    actions: [
      { to: '/enterprise/ats', label: 'ATS Pipeline' },
      { to: '/enterprise/crm', label: 'Talent CRM' },
    ],
  },
  '/enterprise/mobility': {
    title: 'Internal Mobility',
    subtitle: 'Post internal jobs, accept employee applications, and manage the two-step manager approval transfer workflow.',
    stats: [
      { value: 'Internal', label: 'Hiring first' },
      { value: 'Live', label: 'Enterprise route' },
    ],
    actions: [
      { to: '/enterprise/referral', label: 'Referral System' },
      { to: '/enterprise/ats', label: 'ATS Pipeline' },
    ],
  },
  '/enterprise/referral': {
    title: 'Employee Referral System',
    subtitle: 'Employee-driven referrals with automated bonus assignment, approval workflow and analytics dashboard.',
    stats: [
      { value: 'Referral', label: 'Hiring channel' },
      { value: 'Live', label: 'Enterprise route' },
    ],
    actions: [
      { to: '/enterprise/mobility', label: 'Internal Mobility' },
      { to: '/enterprise/assessment', label: 'Assessments' },
    ],
  },
  '/enterprise/assessment': {
    title: 'Assessment Platform',
    subtitle: 'Technical, aptitude, personality and language tests with timed sessions, question banks and AI proctoring.',
    stats: [
      { value: '11', label: 'Test types' },
      { value: 'AI', label: 'Proctored' },
    ],
    actions: [
      { to: '/enterprise/ai', label: 'AI Recruiting' },
      { to: '/enterprise/referral', label: 'Referral System' },
    ],
  },
  '/enterprise/interviews': {
    title: 'Interview Management',
    subtitle: 'Schedule phone, video, panel and executive interviews with time zone support, reminders and AI scorecards.',
    stats: [
      { value: '4', label: 'Interview types' },
      { value: 'Live', label: 'Enterprise route' },
    ],
    actions: [
      { to: '/enterprise/assessment', label: 'Assessment Platform' },
      { to: '/enterprise/offers', label: 'Offer Management' },
    ],
  },
  '/enterprise/offers': {
    title: 'Offer Management',
    subtitle: 'Multi-stage approval workflow: HR → Finance → Executive. Templates, salary benchmarking and e-signatures.',
    stats: [
      { value: '3-stage', label: 'Approval chain' },
      { value: 'Live', label: 'Enterprise route' },
    ],
    actions: [
      { to: '/enterprise/interviews', label: 'Interviews' },
      { to: '/enterprise/onboarding', label: 'Onboarding' },
    ],
  },
  '/enterprise/onboarding': {
    title: 'Onboarding',
    subtitle: 'Preboarding checklists, IT provisioning, training schedules and HRMS/Payroll/Identity integrations.',
    stats: [
      { value: 'Pre + On', label: 'Boarding stages' },
      { value: 'Live', label: 'Enterprise route' },
    ],
    actions: [
      { to: '/enterprise/offers', label: 'Offer Management' },
      { to: '/enterprise/workforce', label: 'Workforce Planning' },
    ],
  },
  '/enterprise/workforce': {
    title: 'Workforce Planning',
    subtitle: 'Quarterly hiring forecasts, headcount tracking by department and hiring budget management for HR Directors.',
    stats: [
      { value: 'Q1–Q4', label: 'Forecast horizon' },
      { value: 'Live', label: 'Enterprise route' },
    ],
    actions: [
      { to: '/enterprise/onboarding', label: 'Onboarding' },
      { to: '/enterprise/analytics', label: 'Analytics & BI' },
    ],
  },
  '/enterprise/analytics': {
    title: 'Analytics & BI',
    subtitle: 'Executive KPI dashboard, source-of-hire analysis, recruiter performance, funnel analytics and AI-powered predictive insights.',
    stats: [
      { value: '6', label: 'KPI metrics' },
      { value: 'AI', label: 'Predictive engine' },
    ],
    actions: [
      { to: '/enterprise/workforce', label: 'Workforce Planning' },
      { to: '/enterprise/integrations', label: 'Integrations' },
    ],
  },
  '/enterprise/integrations': {
    title: 'Integrations Marketplace',
    subtitle: 'Connect Workday, SAP, Teams, Slack, Google Calendar, Outlook, LinkedIn, DocuSign and 11 more platforms.',
    stats: [
      { value: '19', label: 'Integrations' },
      { value: '7', label: 'Categories' },
    ],
    actions: [
      { to: '/enterprise/analytics', label: 'Analytics & BI' },
      { to: '/enterprise/whitelabel', label: 'White-Label' },
    ],
  },
  '/enterprise/whitelabel': {
    title: 'White-Label SaaS',
    subtitle: 'Custom domain, branding, email templates and career portals for recruitment agencies and large enterprises.',
    stats: [
      { value: 'Custom', label: 'Domain & Brand' },
      { value: '∞', label: 'Tenants' },
    ],
    actions: [
      { to: '/enterprise/integrations', label: 'Integrations' },
      { to: '/enterprise/pricing', label: 'Pricing Plans' },
    ],
  },
  '/enterprise/pricing': {
    title: 'Pricing & Plans',
    subtitle: 'Professional, Business and Enterprise tiers with annual discounts, feature comparison and FAQ.',
    stats: [
      { value: '3', label: 'Tiers' },
      { value: '20%', label: 'Annual saving' },
    ],
    actions: [
      { to: '/enterprise/whitelabel', label: 'White-Label' },
      { to: '/enterprise/org', label: 'Org Manager' },
    ],
  },
  '/enterprise/agency': {
    title: 'Recruitment Agency',
    subtitle: 'Manage clients, candidate pipeline, submissions, recruiter assignments and invoicing.',
    stats: [
      { value: 'Full', label: 'Client Lifecycle' },
      { value: 'B2B', label: 'Agency Model' },
    ],
    actions: [
      { to: '/enterprise/agency', label: 'Open Agency Hub' },
      { to: '/enterprise/pricing', label: 'Pricing Plans' },
    ],
  },
  '/enterprise/platform-admin': {
    title: 'Platform Admin',
    subtitle: 'Fraud detection, spam moderation, subscription management and full audit logs.',
    stats: [
      { value: 'AI', label: 'Fraud Detection' },
      { value: 'Live', label: 'Monitoring' },
    ],
    actions: [
      { to: '/enterprise/platform-admin', label: 'Open Admin Panel' },
      { to: '/enterprise/super-admin', label: 'Super Admin' },
    ],
  },
  '/enterprise/super-admin': {
    title: 'Super Admin — SaaS',
    subtitle: 'Multi-tenant management, payments, AI provider config, SSO/OAuth and global settings.',
    stats: [
      { value: 'Multi', label: 'Tenant SaaS' },
      { value: 'SSO', label: 'Enterprise Auth' },
    ],
    actions: [
      { to: '/enterprise/super-admin', label: 'Open Super Admin' },
      { to: '/enterprise/platform-admin', label: 'Platform Admin' },
    ],
  },
  '/billing': {
    title: 'Billing & Subscription',
    subtitle: 'Manage your subscription plan, payment method, and billing history.',
    stats: [
      { value: '3', label: 'Available Plans' },
      { value: '20%', label: 'Annual Saving' },
    ],
    actions: [
      { to: '/billing', label: 'My Subscription' },
      { to: '/enterprise/pricing', label: 'Compare Plans' },
    ],
  },
  '/approval-workflow': {
    title: 'Approval Workflow',
    subtitle: 'Review and action pending job and offer approvals across the full approval chain.',
    stats: [
      { value: '5', label: 'Pending approvals' },
      { value: '2', label: 'Urgent' },
    ],
    actions: [
      { to: '/job', label: 'Job Management' },
      { to: '/enterprise/offers', label: 'Offer Management' },
    ],
  },
  '/security': {
    title: 'Security',
    subtitle: 'Configure MFA, password policy, SSO, IP restrictions, and manage active sessions.',
    stats: [
      { value: 'MFA', label: 'Enabled' },
      { value: '4', label: 'Active sessions' },
    ],
    actions: [
      { to: '/audit-logs', label: 'Audit Logs' },
      { to: '/configuration', label: 'Configuration' },
    ],
  },
  '/organization': {
    title: 'Organization Structure',
    subtitle: 'Manage departments, teams, branches, and reporting hierarchy for your company.',
    stats: [
      { value: '5', label: 'Departments' },
      { value: '3', label: 'Branches' },
    ],
    actions: [
      { to: '/users', label: 'Team Members' },
      { to: '/roles', label: 'Roles & Permissions' },
    ],
  },
  '/communication': {
    title: 'Communication Center',
    subtitle: 'Send bulk emails, announcements, and manage all message templates from one place.',
    stats: [
      { value: '5', label: 'Email Templates' },
      { value: '3', label: 'SMS Templates' },
    ],
    actions: [
      { to: '/configuration', label: 'Notification Settings' },
      { to: '/candidate', label: 'Candidate List' },
    ],
  },
  '/audit-logs': {
    title: 'Audit Logs',
    subtitle: 'Track all user actions, permission changes, and system events for security and compliance.',
    stats: [
      { value: '100%', label: 'Event coverage' },
      { value: 'GDPR', label: 'Export ready' },
    ],
    actions: [
      { to: '/configuration', label: 'Security Settings' },
      { to: '/users', label: 'Team Members' },
    ],
  },
  '/talent-pool': {
    title: 'Talent Pool',
    subtitle: 'Build and manage curated candidate pools for current and future hiring needs.',
    stats: [
      { value: '5', label: 'Active pools' },
      { value: '100', label: 'Pooled candidates' },
    ],
    actions: [
      { to: '/candidate', label: 'All Candidates' },
      { to: '/candidate-analytics', label: 'Candidate Analytics' },
    ],
  },
};

const DYNAMIC_ROUTE_META = [
  {
    startsWith: '/frontoffice/viewjob/',
    meta: {
      title: 'Front Office Job Detail',
      subtitle: 'Preview the front-office job detail template with a specific job id.',
      stats: [
        { value: 'Detail', label: 'Template page' },
        { value: 'Live', label: 'Backend route' },
      ],
      actions: [
        { to: '/frontoffice/jobs', label: 'Jobs Template' },
        { to: '/frontoffice/home', label: 'Home Template' },
      ],
    },
  },
  {
    startsWith: '/frontoffice/newcandidature/',
    meta: {
      title: 'Front Office New Candidature',
      subtitle: 'Preview candidature submission template for a selected job.',
      stats: [
        { value: 'Form', label: 'Candidature page' },
        { value: 'Live', label: 'Backend route' },
      ],
      actions: [
        { to: '/frontoffice/jobs', label: 'Jobs Template' },
        { to: '/frontoffice/register', label: 'Register Template' },
      ],
    },
  },
];

const getRouteMeta = (pathname) => ROUTE_META[pathname] || DEFAULT_ROUTE_META;

const ContentFallback = ({ title }) => (
  <section className="content-fallback card">
    <div className="card-body">
      <span className="content-fallback__badge">Module not found</span>
      <h3>{title} is not mapped yet</h3>
      <p>
        This route does not currently have a dedicated page. Use one of the core modules from the navigation,
        or return to the dashboard while this screen is being prepared.
      </p>
      <div className="content-fallback__actions">
        <NavLink className="btn btn-primary btn-sm" to="/dashboard">Back to Dashboard</NavLink>
        <NavLink className="btn btn-outline-primary btn-sm" to="/apply">Open Applications</NavLink>
      </div>
    </div>
  </section>
);

const Content = () => {
  const location = useLocation();
  const pageMeta = getRouteMeta(location.pathname);
  const pageTitle = pageMeta.title;
  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';
  const isFrontOfficeRoute = location.pathname.startsWith('/frontoffice');

  return (
    <div className='content'>
      <div className="animated fadeIn">
        {!isDashboard && (
          <section className="content-intro card">
            <div className="card-body content-intro__body">
              <div>
                <span className="content-intro__eyebrow">Operations Workspace</span>
                <h2 className="content-intro__title">{pageTitle}</h2>
                <p className="content-intro__subtitle">
                  {pageMeta.subtitle}
                </p>
                <div className="content-intro__actions">
                  {pageMeta.actions.map((action) => (
                    <NavLink key={action.to} className="btn btn-outline-primary btn-sm" to={action.to}>{action.label}</NavLink>
                  ))}
                </div>
              </div>
              <div className="content-intro__stats">
                {pageMeta.stats.map((item) => (
                  <div key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="row">
          <div className="col-md-12">
            <Switch>
              <Route exact path="/" component={DashBoard} />
              <Route exact path="/dashboard" component={DashBoard} />
              
              <Route exact path="/apply" component={ApplyJob} />
              <Route exact path="/candidate" component={Candidate} />
              <Route exact path="/interview" component={Interview} />
              <Route exact path="/job" component={Job} />
              <Route exact path="/location" component={Location} />
              <Route exact path="/skill" component={Skill} />
              <Route exact path="/staff" component={Staff} />
              <Route exact path="/task" component={Task} />
              <Route exact path="/configuration" component={Configuration} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/add-job" component={AddJob} />
              <Route exact path="/add-task" component={AddTask} />
              <Route exact path="/add-interview" component={AddInterview} />
              <Route exact path="/company" component={Company} />
              <Route exact path="/first-interview" component={FirstInterview} />
              <Route exact path="/second-interview" component={SecondInterview} />
              <Route exact path="/initial-qualification" component={InitialQualification} />
              <Route exact path="/contract-proposal" component={ContractProposal} />
              <Route exact path="/contract-signed" component={ContractSigned} />
              <Route exact path="/todo" component={ToDo} />
              
              
              
              
              
              
              <Route exact path="/users" component={User} />
              <Route exact path="/roles" component={Roles} />
              <Route exact path="/refusal" component={RefusalFeedBack} />
              <Route exact path="/acceptance" component={AcceptanceFeedBack} />
              <Route exact path="/header" component={HeaderPage} />
              <Route exact path="/jobs" component={JobsPage} />
              <Route exact path="/companies" component={CompaniesPage} />
              <Route exact path="/service" component={ServicePage} />
              <Route exact path="/summary" component={SummaryPage} />
              <Route exact path="/testimonials" component={TestimonialPage} />
              <Route exact path="/newsletter" component={NewsLetterPage} />
              
              <Route exact path="/footer" component={FooterPage} />
              <Route exact path="/job-analytics" component={JobAnalytics} />
              <Route exact path="/job-application-analytics" component={JobApplicationAnalytics} />
              <Route exact path="/candidate-analytics" component={CandidateAnalytics} />
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              <Route exact path="/enterprise/mobility" component={EnterpriseInternalMobility} />
              <Route exact path="/enterprise/referral" component={EnterpriseReferral} />
              <Route exact path="/enterprise/assessment" component={EnterpriseAssessment} />
              
              <Route exact path="/enterprise/offers" component={EnterpriseOffers} />
              
              
              <Route exact path="/enterprise/analytics" component={EnterpriseAnalytics} />
              <Route exact path="/enterprise/integrations" component={EnterpriseIntegrations} />
              
              
              
              
              
              <Route exact path="/billing" component={AdminBilling} />
              <Route exact path="/approval-workflow" component={ApprovalWorkflow} />
              <Route exact path="/security" component={Security} />
              <Route exact path="/organization" component={Organization} />
              <Route exact path="/communication" component={Communication} />
              <Route exact path="/audit-logs" component={AuditLogs} />
              <Route exact path="/talent-pool" component={TalentPool} />
              <Route render={() => <ContentFallback title={pageTitle} />} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

Content.propTypes = {};

Content.defaultProps = {};

export default Content;
