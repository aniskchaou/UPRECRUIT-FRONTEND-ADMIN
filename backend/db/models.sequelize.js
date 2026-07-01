const fs = require('fs');
const path = require('path');
const sequelize = require('../db/init.sequelize');

function loadModelFiles(directoryPath) {
    fs.readdirSync(directoryPath, { withFileTypes: true })
        .sort((left, right) => left.name.localeCompare(right.name))
        .forEach((entry) => {
            const entryPath = path.join(directoryPath, entry.name);
            if (entry.isDirectory()) {
                loadModelFiles(entryPath);
                return;
            }

            if (entry.isFile() && entry.name.endsWith('.js')) {
                require(entryPath);
            }
        });
}

loadModelFiles(path.join(__dirname, '../models'));

const seedDataByModel = {
    system_settings: [{
        appName: 'UPRECRUIT Admin',
        showLogo: 'true',
        email: 'hello@uprecruit.com',
        address: '14 Rue du Lac, Tunis, Tunisia',
        entrepriseName: 'UPRECRUIT',
        logo: 'uprecruit-logo.png'
    }],
    dashboard_settings: [{
        showSummary: 'true',
        showCalendar: 'true',
        showExpenseIncomeCharts: 'true'
    }],
    email_settings: [{
        smtp: 'smtp.office365.com',
        emailSentAddress: new Date('2026-04-01T09:00:00Z')
    }],
    eamil_template: [{
        title: 'Interview Invitation',
        content: 'Hello {{candidateName}}, your interview is confirmed for {{date}} at {{time}}.'
    }],
    footer_settings: [{
        enableFooter: 'true',
        enableCopyRightTest: 'true'
    }],
    header_settings: [{
        enbaleSearchBar: 'true',
        showLogo: 'true'
    }],
    localisation_settings: [{
        language: 'English',
        currency: 'Tunisian Dinar',
        currencySymbol: 'TND',
        dateFormat: 'DD/MM/YYYY'
    }],
    notification_settings: [{
        showNotification: 'true'
    }],
    role: [
        { name: 'Administrator' },
        { name: 'Recruiter' },
        { name: 'HR Manager' }
    ],
    user: [
        { username: 'admin@uprecruit.com', password: 'Admin@2026' },
        { username: 'sara.benali@uprecruit.com', password: 'Member@2026' },
        { username: 'yassine.khalil@uprecruit.com', password: 'Member@2026' },
        { username: 'jobseeker@uprecruit.com', password: 'Jobseeker@2026' }
    ],
    staff: [
        { full_name: 'Madalyn Edric', password: 'Recruiter@2026', calling_code: '+216 52 100 210', role: 'Recruiter' },
        { full_name: 'Karim Mansouri', password: 'HRLead@2026', calling_code: '+216 52 100 211', role: 'HR Manager' }
    ],
    career_level: [
        { name: 'Junior' },
        { name: 'Mid-Level' },
        { name: 'Senior' }
    ],
    degree_level: [
        { name: 'Bachelor' },
        { name: 'Master' },
        { name: 'Doctorate' }
    ],
    degree_type: [
        { name: 'Computer Science' },
        { name: 'Business Administration' },
        { name: 'Digital Marketing' }
    ],
    contract_type: [
        { name: 'Full Time' },
        { name: 'Freelance' },
        { name: 'Internship' }
    ],
    job_type: [
        { name: 'On Site' },
        { name: 'Hybrid' },
        { name: 'Remote' }
    ],
    language_level: [
        { name: 'Professional' },
        { name: 'Fluent' },
        { name: 'Native' }
    ],
    category: [
        { category: 'Engineering' },
        { category: 'Product' },
        { category: 'Marketing' },
        { category: 'Customer Success' }
    ],
    sub_category: [
        { category: 'Engineering', name: 'Frontend Development' },
        { category: 'Engineering', name: 'Backend Development' },
        { category: 'Marketing', name: 'Performance Marketing' },
        { category: 'Product', name: 'Product Design' }
    ],
    service: [
        { name: 'Executive Search', description: 'Targeted recruitment for leadership and strategic hires.' },
        { name: 'Contract Staffing', description: 'Fast placement of vetted freelance and contract talent.' },
        { name: 'Employer Branding', description: 'Content and outreach support to improve candidate conversion.' }
    ],
    salary: [
        { current: '4200 TND', expected: '5200 TND' },
        { current: '5800 TND', expected: '6800 TND' }
    ],
    company: [
        {
            name: 'Nexa Systems',
            email: 'talent@nexasystems.com',
            category: 'Software Engineering',
            telephone: '+216 71 400 510',
            address: 'Les Berges du Lac 2, Tunis, Tunisia',
            website: 'https://nexasystems.com',
            size: '220',
            logo: 'nexa-systems.png',
            about: 'Nexa Systems builds SaaS products for customer operations teams across Europe and MENA.'
        },
        {
            name: 'BlueOrbit Labs',
            email: 'careers@blueorbitlabs.io',
            category: 'Product Design',
            telephone: '+33 1 83 64 22 10',
            address: '21 Avenue de la Republique, Paris, France',
            website: 'https://blueorbitlabs.io',
            size: '85',
            logo: 'blueorbit-labs.png',
            about: 'BlueOrbit Labs designs and validates digital products for fintech and healthtech startups.'
        },
        {
            name: 'Delta Dev',
            email: 'jobs@deltadev.io',
            category: 'Consulting',
            telephone: '+49 30 2201 8840',
            address: 'Alexanderplatz 4, Berlin, Germany',
            website: 'https://deltadev.io',
            size: '140',
            logo: 'delta-dev.png',
            about: 'Delta Dev delivers engineering squads for cloud, data and platform modernization projects.'
        }
    ],
    location: [
        { city: 'Tunis', country: 'Tunisia' },
        { city: 'Paris', country: 'France' },
        { city: 'Berlin', country: 'Germany' }
    ],
    university: [
        { university: 'University of Tunis El Manar', location: 'Tunis, Tunisia' },
        { university: 'Sorbonne University', location: 'Paris, France' },
        { university: 'Technical University of Berlin', location: 'Berlin, Germany' }
    ],
    degree: [
        { name: 'Bachelor of Computer Science', type: 'Computer Science', level: 'Bachelor', university: 'University of Tunis El Manar', location: 'Tunis' },
        { name: 'Master in Product Design', type: 'Design', level: 'Master', university: 'Sorbonne University', location: 'Paris' }
    ],
    language: [
        { language: 'English', level: 'Fluent' },
        { language: 'French', level: 'Professional' },
        { language: 'Arabic', level: 'Native' }
    ],
    skill: [
        { name: 'React' },
        { name: 'Node.js' },
        { name: 'PostgreSQL' },
        { name: 'Figma' },
        { name: 'Docker' },
        { name: 'TypeScript' }
    ],
    candidate: [
        {
            firstName: 'Sara',
            lastName: 'Ben Ali',
            email: 'sara.benali@uprecruit.com',
            phone: '+216 55 300 200',
            details: 'Frontend engineer with strong product sense and accessibility experience.',
            dateOfBirth: '14/03/1997',
            gender: 'Female',
            skills: 'React,TypeScript,Node.js',
            note: 'Open to hybrid roles and product-focused teams.',
            nationality: 'Tunisian',
            city: 'Tunis',
            country: 'Tunisia',
            categoryJob: 'Engineering',
            address: '34 Avenue Hedi Nouira, Ennasr',
            careerLevel: 'Mid-Level',
            experience: 'BlueOrbit Labs',
            language: 'English, French, Arabic',
            salary: '4500 TND',
            remoteWork: 'yes',
            immediateAvailable: 'no',
            summary: 'Builds maintainable web interfaces and collaborates closely with design and product.',
            cv: 'sara-ben-ali-cv.pdf',
            coverLetter: 'sara-ben-ali-cover-letter.pdf',
            jobRole: 'Frontend Engineer',
            password: 'Candidate@2026'
        },
        {
            firstName: 'Yassine',
            lastName: 'Khalil',
            email: 'yassine.khalil@uprecruit.com',
            phone: '+216 55 300 201',
            details: 'Backend engineer experienced in API design, scaling and recruitment platforms.',
            dateOfBirth: '22/09/1994',
            gender: 'Male',
            skills: 'Node.js,PostgreSQL,Docker',
            note: 'Looking for remote or hybrid backend leadership opportunities.',
            nationality: 'Tunisian',
            city: 'Sousse',
            country: 'Tunisia',
            categoryJob: 'Engineering',
            address: '11 Rue de la Corniche, Sousse',
            careerLevel: 'Senior',
            experience: 'Delta Dev',
            language: 'English, Arabic, French',
            salary: '6200 TND',
            remoteWork: 'yes',
            immediateAvailable: 'yes',
            summary: 'Designs resilient backend systems and mentors junior developers.',
            cv: 'yassine-khalil-cv.pdf',
            coverLetter: 'yassine-khalil-cover-letter.pdf',
            jobRole: 'Backend Engineer',
            password: 'Candidate@2026'
        }
    ],
    cv: [
        { name: 'Sara Ben Ali CV', date: '2026-04-01', file: 'sara-ben-ali-cv.pdf' },
        { name: 'Yassine Khalil CV', date: '2026-04-03', file: 'yassine-khalil-cv.pdf' }
    ],
    education: [
        { degree: 'Bachelor of Computer Science', university: 'University of Tunis El Manar', result: 'Very Good', startDate: '2015', endDate: '2018', status: 'Completed' },
        { degree: 'Master in Software Engineering', university: 'Technical University of Berlin', result: 'Excellent', startDate: '2018', endDate: '2020', status: 'Completed' }
    ],
    exprience: [
        { title: 'Frontend Engineer', company: 'BlueOrbit Labs', location: 'Paris', startDate: '2021', endDate: '2024', status: 'Completed', description: 'Led UI delivery for a fintech analytics dashboard.' },
        { title: 'Backend Engineer', company: 'Delta Dev', location: 'Berlin', startDate: '2022', endDate: '2026', status: 'Current', description: 'Built candidate pipelines and scheduling APIs.' }
    ],
    contract: [
        { subject: 'Senior Frontend Engineer Contract', contractValue: '54000 EUR', contractType: 'Full Time', condidate: 'Sara Ben Ali', startDate: '2026-05-01', endDate: '2027-04-30', description: 'Permanent placement for product engineering team.', notes: 'Candidate accepted initial offer.', comments: 'Signed digitally.', templates: 'standard-full-time-template', renew: '2027-04-15' },
        { subject: 'Backend Platform Consultant', contractValue: '680 EUR/day', contractType: 'Freelance', condidate: 'Yassine Khalil', startDate: '2026-06-01', endDate: '2026-12-31', description: 'Six-month consulting mission for platform migration.', notes: 'Remote-first engagement.', comments: 'Security review completed.', templates: 'freelance-consulting-template', renew: '2026-12-15' }
    ],
    renew_contract: [
        { contract: 'Senior Frontend Engineer Contract', startDate: '2027-05-01', endDate: '2028-04-30', contractValue: '59000 EUR', status: 'Prepared' },
        { contract: 'Backend Platform Consultant', startDate: '2027-01-01', endDate: '2027-06-30', contractValue: '700 EUR/day', status: 'Pending Approval' }
    ],
    job_offer: [
        {
            post: 'Senior Frontend Engineer',
            description: 'Own modern React interfaces for a B2B operations platform used across Europe.',
            start: '2026-05-10',
            end: '2026-06-10',
            location: 'Tunis',
            requirement: 'React, TypeScript, Design Systems',
            active: 'true',
            salaryFrom: '4500',
            salaryTo: '6500',
            hideSalary: 'false',
            jobType: 'Hybrid',
            position: 'Senior Frontend Engineer',
            gender: 'Any',
            feature: 'Featured',
            degree: 'Bachelor',
            experienceLevel: 'Senior',
            deadline: '2026-06-10',
            firm: 1,
            responsibilities: 'Build reusable UI foundations, partner with product managers and review pull requests.',
            minimumQualifications: '3+ years of React and TypeScript experience.',
            preferredQualifications: 'Experience with analytics dashboards and accessibility standards.'
        },
        {
            post: 'Product Designer',
            description: 'Shape hiring workflows and candidate journeys for a growing SaaS product.',
            start: '2026-05-12',
            end: '2026-06-18',
            location: 'Paris',
            requirement: 'Figma, Research, Prototyping',
            active: 'true',
            salaryFrom: '3800',
            salaryTo: '5200',
            hideSalary: 'false',
            jobType: 'On Site',
            position: 'Product Designer',
            gender: 'Any',
            feature: 'Standard',
            degree: 'Master',
            experienceLevel: 'Mid-Level',
            deadline: '2026-06-18',
            firm: 2,
            responsibilities: 'Run discovery interviews, prototype new recruiter workflows and maintain UI quality.',
            minimumQualifications: '2+ years in product design for web applications.',
            preferredQualifications: 'Experience designing for HR tech or SaaS products.'
        },
        {
            post: 'Backend Platform Engineer',
            description: 'Improve APIs, automation and infrastructure for multi-tenant recruitment products.',
            start: '2026-05-15',
            end: '2026-06-22',
            location: 'Berlin',
            requirement: 'Node.js, PostgreSQL, Docker',
            active: 'true',
            salaryFrom: '5200',
            salaryTo: '7600',
            hideSalary: 'false',
            jobType: 'Remote',
            position: 'Backend Platform Engineer',
            gender: 'Any',
            feature: 'Featured',
            degree: 'Bachelor',
            experienceLevel: 'Senior',
            deadline: '2026-06-22',
            firm: 3,
            responsibilities: 'Design resilient services, optimize queries and support release automation.',
            minimumQualifications: '4+ years in backend engineering with relational databases.',
            preferredQualifications: 'Hands-on cloud deployment and observability experience.'
        }
    ],
    apply_job: [
        { condidate: '1', jobOffer: '1', dateApplication: '2026-04-12', status: 'Pending Review', appreciation: 'Strong portfolio and communication.' },
        { condidate: '2', jobOffer: '3', dateApplication: '2026-04-15', status: 'Shortlisted', appreciation: 'Relevant backend and platform experience.' }
    ],
    interview: [
        { candidates: 'Sara Ben Ali', employees: 'Madalyn Edric', scheduleDate: '2026-04-29', scheduleTime: '10:00', comment: 'Portfolio review and technical discussion.', status: 'Scheduled', zoomLink: 'https://meet.uprecruit.com/interview/sara-ben-ali', reminder: '24 hours before', notes: 'Candidate requested French-speaking panel.', location: 'Remote' },
        { candidates: 'Yassine Khalil', employees: 'Karim Mansouri', scheduleDate: '2026-05-02', scheduleTime: '14:30', comment: 'System design interview.', status: 'Scheduled', zoomLink: 'https://meet.uprecruit.com/interview/yassine-khalil', reminder: '24 hours before', notes: 'Focus on API scaling and mentoring.', location: 'Berlin Office' }
    ],
    acceptance_feedback: [
        { name: 'Offer Accepted', description: 'Candidate accepted the offer and onboarding is ready to start.' }
    ],
    refusal_feedback: [
        { name: 'Offer Declined', description: 'Candidate declined due to compensation expectations and notice period constraints.' }
    ],
    member_saved_search: [
        { userId: 2, label: 'Hybrid Frontend Roles', keyword: 'react', location: 'tunis', category: 'Engineering', experienceLevel: 'Mid-Level', jobType: 'Hybrid', minSalary: '3500', maxSalary: '6500' },
        { userId: 3, label: 'Remote Backend Missions', keyword: 'node', location: 'remote', category: 'Engineering', experienceLevel: 'Senior', jobType: 'Remote', minSalary: '5000', maxSalary: '8000' },
        { userId: 4, label: 'Jobseeker Product Roles', keyword: 'product', location: 'remote', category: 'Product', experienceLevel: 'Mid-Level', jobType: 'Hybrid', minSalary: '4000', maxSalary: '7000' }
    ],
    member_message: [
        { userId: 2, recruiter: 'Nexa Systems Talent Team', preview: 'Your profile is a strong fit for our Senior Frontend Engineer role.', unread: 'true' },
        { userId: 3, recruiter: 'Delta Dev Hiring Desk', preview: 'We would like to discuss a backend platform consulting mission with you.', unread: 'false' },
        { userId: 4, recruiter: 'UPRECRUIT Member Success', preview: 'Your member portal access is active. Start exploring matching roles.', unread: 'true' }
    ],
    member_notification: [
        { userId: 2, type: 'application', title: 'Application Submitted', message: 'Your application for Senior Frontend Engineer was sent successfully.', readStatus: 'false', channel: 'in-app' },
        { userId: 3, type: 'interview', title: 'Interview Confirmed', message: 'Your backend platform interview has been confirmed for 02/05/2026.', readStatus: 'false', channel: 'email' },
        { userId: 4, type: 'system', title: 'Member Portal Enabled', message: 'Welcome jobseeker, your member portal is ready to use.', readStatus: 'false', channel: 'in-app' }
    ],
    member_preference: [
        { userId: 2, hideProfile: 'false', anonymizeProfile: 'false', emailAlerts: 'true', pushAlerts: 'true', recruiterMessages: 'true', twoFactorEnabled: 'false', bookmarkedJobs: '1,2' },
        { userId: 3, hideProfile: 'false', anonymizeProfile: 'true', emailAlerts: 'true', pushAlerts: 'false', recruiterMessages: 'true', twoFactorEnabled: 'true', bookmarkedJobs: '3' },
        { userId: 4, hideProfile: 'false', anonymizeProfile: 'false', emailAlerts: 'true', pushAlerts: 'true', recruiterMessages: 'true', twoFactorEnabled: 'false', bookmarkedJobs: '1,3' }
    ],
    task: [
        { task: 'Review shortlisted frontend profiles', status: 'in progress' },
        { task: 'Prepare backend platform interview panel', status: 'to do' }
    ],
    todo: [
        { task: 'Publish weekly hiring report', status: 'done' },
        { task: 'Follow up on signed contracts', status: 'to do' }
    ],
    newsletter: [
        { email: 'talent-community@uprecruit.com' },
        { email: 'product-designers@uprecruit.com' }
    ],
    testimonial: [
        { name: 'Leila Trabelsi', quote: 'UPRECRUIT helped us hire a product designer in less than three weeks with excellent communication throughout.' },
        { name: 'Thomas Meyer', quote: 'The recruiter dashboard made it easy to track each candidate stage and keep our team aligned.' }
    ],
    header_page: [{ title: 'Hire better, faster and with full pipeline visibility.' }],
    footer_page: [{ title1: 'Recruiters', title2: 'Candidates', title3: 'Companies', title4: 'Support', address: '1201, Murakeu Market, QUCH07, United Kingdom', email: 'support@uprecruit.com', phone: '044 123 458 65879', skype: 'uprecruit@skype', fax: '123 456 85' }],
    summary_page: [{ jobsPosted: '128', allCompanies: '36', totalMembers: '2140', happyMembers: '1875' }],
    newsletter_page: [{ title: 'Stay close to the market', subTitle: 'Get curated opportunities, hiring trends and recruiter insights every week.' }],
    insight_content: [
        {
            category: 'Salary Guide',
            title: 'Frontend, Design, and Marketing Salary Snapshot',
            excerpt: 'Explore live pay expectations collected across the platform to benchmark your next move with more confidence.',
            highlight: 'Updated from platform records'
        },
        {
            category: 'Hiring Trend',
            title: 'Flexible And Skills-First Hiring Is Leading Current Openings',
            excerpt: 'Current employer activity increasingly highlights clearer requirements, transparent salary bands, and flexible work formats.',
            highlight: 'Based on active company and job data'
        },
        {
            category: 'Resume Tip',
            title: 'Clear Summaries And Focused Skills Help Recruiters Scan Faster',
            excerpt: 'Profiles with concise summaries, relevant skills, and role-aligned positioning are easier for hiring teams to review quickly.',
            highlight: 'Candidate profile best practice'
        }
    ],
    job_page: [{ title: 'Discover curated hiring opportunities', subTitle: 'Browse active openings from trusted employers and specialist recruiters.' }]
};

function titleize(value) {
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, function (letter) {
            return letter.toUpperCase();
        });
}

function buildFallbackValue(modelName, attributeName, attribute, index) {
    const lowerAttribute = attributeName.toLowerCase();
    const indexValue = index + 1;

    if (lowerAttribute === 'userid') {
        return 1;
    }

    if (attribute.type && attribute.type.key === 'INTEGER') {
        return indexValue;
    }

    if (attribute.type && attribute.type.key === 'DATE') {
        return new Date('2026-04-01T09:00:00Z');
    }

    if (lowerAttribute.includes('email')) {
        return modelName.replace(/_/g, '-') + indexValue + '@uprecruit.com';
    }

    if (lowerAttribute.includes('phone') || lowerAttribute.includes('telephone') || lowerAttribute.includes('calling_code')) {
        return '+216 50 000 00' + indexValue;
    }

    if (lowerAttribute.includes('date')) {
        return '2026-04-' + String(indexValue + 9).padStart(2, '0');
    }

    if (lowerAttribute.includes('time')) {
        return '09:00';
    }

    if (lowerAttribute.includes('salary') || lowerAttribute.includes('value')) {
        return String(2000 * indexValue);
    }

    if (lowerAttribute.includes('status')) {
        return 'active';
    }

    if (lowerAttribute.includes('title') || lowerAttribute.includes('name') || lowerAttribute.includes('label')) {
        return titleize(modelName) + ' ' + indexValue;
    }

    if (lowerAttribute.includes('description') || lowerAttribute.includes('summary') || lowerAttribute.includes('content') || lowerAttribute.includes('about') || lowerAttribute.includes('comment') || lowerAttribute.includes('notes') || lowerAttribute.includes('preview') || lowerAttribute.includes('message') || lowerAttribute.includes('quote')) {
        return titleize(modelName) + ' sample content ' + indexValue;
    }

    if (lowerAttribute.includes('logo') || lowerAttribute.includes('file')) {
        return modelName + '-' + indexValue + '.png';
    }

    return titleize(attributeName) + ' ' + indexValue;
}

function buildFallbackRecord(model, index) {
    return Object.entries(model.rawAttributes).reduce(function (record, entry) {
        const attributeName = entry[0];
        const attribute = entry[1];

        if (attributeName === 'id' || attributeName === 'createdAt' || attributeName === 'updatedAt') {
            return record;
        }

        record[attributeName] = buildFallbackValue(model.name, attributeName, attribute, index);
        return record;
    }, {});
}

function getSeedRecords(modelName) {
    const model = sequelize.models[modelName];
    if (!model) {
        return [];
    }

    if (seedDataByModel[modelName]) {
        return seedDataByModel[modelName];
    }

    return [buildFallbackRecord(model, 0)];
}

const seedOrder = [
    'system_settings',
    'dashboard_settings',
    'email_settings',
    'eamil_template',
    'footer_settings',
    'header_settings',
    'localisation_settings',
    'notification_settings',
    'role',
    'user',
    'staff',
    'career_level',
    'degree_level',
    'degree_type',
    'contract_type',
    'job_type',
    'language_level',
    'category',
    'sub_category',
    'service',
    'salary',
    'company',
    'location',
    'university',
    'degree',
    'language',
    'skill',
    'candidate',
    'cv',
    'education',
    'exprience',
    'contract',
    'renew_contract',
    'job_offer',
    'apply_job',
    'interview',
    'acceptance_feedback',
    'refusal_feedback',
    'member_saved_search',
    'member_message',
    'member_notification',
    'member_preference',
    'task',
    'todo',
    'newsletter',
    'testimonial',
    'header_page',
    'footer_page',
    'summary_page',
    'newsletter_page',
    'insight_content',
    'job_page'
];

async function initializeDatabase() {
    await sequelize.sync({ force: true });

    const seededModels = new Set();

    for (const modelName of seedOrder) {
        const model = sequelize.models[modelName];
        if (!model) {
            continue;
        }

        const records = getSeedRecords(modelName);
        if (records.length > 0) {
            await model.bulkCreate(records);
        }

        seededModels.add(modelName);
    }

    for (const modelName of Object.keys(sequelize.models).sort()) {
        if (seededModels.has(modelName)) {
            continue;
        }

        const records = getSeedRecords(modelName);
        if (records.length > 0) {
            await sequelize.models[modelName].bulkCreate(records);
        }
    }

    console.log('Database reset completed and startup seed data inserted into every table.');
}

const initializationPromise = initializeDatabase();

module.exports = {
    sequelize: sequelize,
    initializationPromise: initializationPromise,
    seedDataByModel: seedDataByModel
};

