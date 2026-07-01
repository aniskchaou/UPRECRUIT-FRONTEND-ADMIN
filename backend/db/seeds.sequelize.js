exports.userSeed = {
    username: 'admin',
    password: 'admin'
}

exports.memberUserSeed = {
    username: 'member@uprecruit.com',
    password: 'member123'
}

exports.userSeeds = [
    exports.userSeed,
    exports.memberUserSeed
]

exports.expenseSeed = {
    nameexpense: '',
    amount: 0,
    datee: new Date(1980, 6, 20),
    note: 'a'
}

exports.patientSeed = {
    namepatient: 'a',
    emailpatient: 'a',
    birth: new Date(1980, 6, 20),
    telephone: 'a',
    gender: 'a',
    address: 'a'
}
exports.contractSeeds = {
    subject: 'Joe doe Contract',
    contractValue: '33 000',
    contractType: 'Freelance',
    condidate: 'Joe Doe',
    startDate: '2010',
    endDate: '2022',
    description: '',
    notes: '',
    comments: '',
    templates: '',
    renew: '2034'
}

exports.jobOfferSeed = [{
    post: 'Web Developer',
    description: 'developing web apps',
    start: '2023-06-05',
    end: '2023-06-15',
    location: 'France',
    requirement: 'Java, PHP',
    salaryFrom: 30000,
    salaryTo: 350000,
    hideSalary: '',
    jobType: 'it',
    position: 'web developer',
    gender: 'male',
    feature: '',
    degree: 'license IT',
    experienceLevel: 'beginner',
    deadline: '',
    firm: 1,
    responsibilities: 'Rapid growth since incorporation has triggered a chain of products, acquisitions and partnerships beyond Google core search engine(Google Search).',
    minimumQualifications: 'Software testing in a Web Applications/Mobile environment.',
    preferredQualifications: 'Software testing in a Web Applications/Mobile environment.',
    benefits: 'Health insurance, Remote work, 401k, Paid time off'
}, {
    description: 'We are growing thanks to our amazing staff! Two Gals & A Broom is a 5 star rated company currently looking for Ambitious, Organized & Energic Cleaning Technician willing to make up to $986 per week! NO EXPERIENCE REQUIRED.',
    start: '2023-06-05',
    end: '2023-06-15',
    location: 'France',
    requirement: 'Java, PHP',
    salaryFrom: 900,
    salaryTo: 1000,
    hideSalary: '',
    jobType: 'it',
    position: 'House Cleaner',
    gender: 'male',
    feature: '',
    degree: '',
    experienceLevel: 'Expert',
    deadline: '',
    firm: 1,
    responsibilities: '-Your own reliable transportation - Valid Driver License and insurance',
    minimumQualifications: 'Bonus for referring employees',
    preferredQualifications: 'No Nights, no weekends',
    benefits: 'Flexible hours, Employee referral bonus'
}, {
    post: 'Sales Associate',
    description: 'The pay range for this position is expected to be $18.17 however,base pay offered may vary depending on multiple individualized factors.',
    start: '2023-06-05',
    end: '2023-06-15',
    location: 'USA',
    requirement: 'Java, PHP',
    salaryFrom: 3000,
    salaryTo: 34000,
    hideSalary: '',
    jobType: 'it',
    position: 'Sales Associate',
    gender: 'male',
    feature: '',
    degree: 'license',
    experienceLevel: 'beginner',
    deadline: '',
    firm: 1,
    responsibilities: 'See\'s is a leader in the confectionary industry with over 250 retail shops across the USA.',
    minimumQualifications: 'Physical ability to carry out the essential functions of the job',
    preferredQualifications: 'Previous retail experience a PLUS!',
    benefits: 'Staff discount, Performance bonus, Paid training'
}]
exports.careerLevelSeeds = [{
    name: 'Beginner'
}, {
    name: 'Intermediate'
}, {
    name: 'Expert'
}]

exports.universitySeeds = [{ univeristy: 'University of Vienna' }, { university: 'University of Antwerp' }]

exports.skillsSeeds = [{ name: 'Java' }, { name: 'PHP' }, { name: 'C++' }]

exports.languageSeeds = [{ language: 'French' }, { language: 'English' }]

exports.locationSeeds = [{ city: 'Paris', country: 'France' }]

exports.degreeSeeds = {
    name: 'Master',
    type: 'Computer Science',
    level: 'High',
    university: 'Université de Paris',
    location: 'Paris'
}

exports.expereienceSeeds = {
    title: 'Mobile Developer',
    company: 'AXA',
    location: 'Paris',
    startDate: '2014',
    endDate: '2016',
    status: 'Finshed',
    description: 'N/A'
}

exports.educationSeeds = {
    degree: 'Master',
    university: 'Unisverite de Paris',
    result: 'Good',
    startDate: '2010',
    endDate: '2012',
    status: 'Finished'
}

exports.staffSeeds = {
    full_name: 'Joe Doe',
    calling_code: '979879879',
    role: 'HR',
}

exports.candidateSeed = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@gmail.com',
    phone: '7687695446',
    details: '',
    dateOfBirth: '10/08/1980',
    gender: 'Male',
    skills: 'PHP',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus commodo purus at auctor.  ',
    nationality: 'English',
    city: 'London',
    country: 'UK',
    categoryJob: 'Information & Technology',
    address: '17 rue de Groussay Rachefort',
    careerLevel: 'Beginner',
    experience: 'AXA',
    language: 'English',
    salary: '97987878',
    remoteWork: 'yes',
    immediateAvailable: 'yes',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus commodo purus at auctor. ',
    cv: 'blank.pdf',
    coverLetter: '',
    skills: 'PHP,Java',
    jobRole: 'Developer',
    password: ''
}

exports.applyJob = {
    condidate: 1,
    jobOffer: 1,
    dateApplication: '10/01/2023',
    status: 'Pending',
    appreciation: 'Good'
}

exports.staffSeeds = {
    full_name: 'Mike dean',
    password: '',
    calling_code: '98779876',
    role: 'HR',
}

exports.interviewSeed = {
    candidates: 'Jhon Doe',
    employees: 'Madalyn Edric',
    scheduleDate: '10/10/2010',
    scheduleTime: '11/11/2011',
    comment: 'N/A',
    status: 'Pending',
    zoomLink: '',
    reminder: '',
    notes: 'N/A',
    location: 'Berlin'
}

exports.taskSeed = {
    task: 'preparing the interview',
    status: 'to do'
}

exports.memberSavedSearchSeeds = [
    {
        userId: 1,
        label: 'Remote React Roles',
        keyword: 'react',
        location: 'remote',
        category: 'IT',
        experienceLevel: 'Senior',
        jobType: 'Remote',
        minSalary: '2500',
        maxSalary: '6000'
    },
    {
        userId: 1,
        label: 'Tunis Product Design',
        keyword: 'designer',
        location: 'tunis',
        category: 'Design',
        experienceLevel: 'Mid',
        jobType: 'Hybrid',
        minSalary: '1800',
        maxSalary: '4000'
    },
    {
        userId: 2,
        label: 'Member Remote Frontend',
        keyword: 'frontend',
        location: 'remote',
        category: 'IT',
        experienceLevel: 'Mid',
        jobType: 'Remote',
        minSalary: '2000',
        maxSalary: '5000'
    }
]

exports.memberMessageSeeds = [
    {
        userId: 1,
        recruiter: 'Nexa Systems Talent Team',
        preview: 'Your profile matches our Senior React opening. Can we schedule a call?',
        unread: 'true'
    },
    {
        userId: 1,
        recruiter: 'BlueOrbit Recruiting',
        preview: 'Thanks for your application. We will share feedback soon.',
        unread: 'false'
    },
    {
        userId: 2,
        recruiter: 'UPRECRUIT Recruiter Desk',
        preview: 'Welcome to your member workspace. New opportunities are ready for you.',
        unread: 'true'
    }
]

exports.memberNotificationSeeds = [
    {
        userId: 1,
        type: 'application',
        title: 'Application Received',
        message: 'Your application for Senior React Engineer has been received.',
        readStatus: 'false',
        channel: 'in-app'
    },
    {
        userId: 1,
        type: 'interview',
        title: 'Interview Invitation',
        message: 'Nexa Systems invited you to choose an interview slot.',
        readStatus: 'false',
        channel: 'in-app'
    },
    {
        userId: 2,
        type: 'system',
        title: 'Member Access Ready',
        message: 'Your dedicated member account is active. Complete your profile to improve recommendations.',
        readStatus: 'false',
        channel: 'in-app'
    }
]

exports.memberPreferenceSeed = {
    userId: 1,
    hideProfile: 'false',
    anonymizeProfile: 'false',
    emailAlerts: 'true',
    pushAlerts: 'true',
    recruiterMessages: 'true',
    twoFactorEnabled: 'false',
    bookmarkedJobs: '101,102'
}

exports.memberPreferenceSeeds = [
    exports.memberPreferenceSeed,
    {
        userId: 2,
        hideProfile: 'false',
        anonymizeProfile: 'false',
        emailAlerts: 'true',
        pushAlerts: 'true',
        recruiterMessages: 'true',
        twoFactorEnabled: 'false',
        bookmarkedJobs: '101'
    }
]



exports.jobCategorySeeds = [{ name: 'Account & Finance' }, { name: 'Information & Technology' }, { name: 'Marketing' }, { name: 'Food & Restaurent' }]

exports.companySeed = {
    name: 'AXA',
    email: 'contact@axa.com',
    category: 'insurrance',
    telephone: '08066557',
    address: '',
    website: 'www.axa.com',
    size: '1600',
    logo: 'axa.png',
    about: 'N/A'
}

const fs = require('fs');

exports.getSytemSettings = () => {
    var rawdata = fs.readFileSync('db/settings/system.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getEmailSettings = () => {
    var rawdata = fs.readFileSync('db/settings/system.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getEmailTemplateSettings = () => {
    var rawdata = fs.readFileSync('db/settings/email_template.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}


exports.getEmailSettings = () => {
    var rawdata = fs.readFileSync('db/settings/email.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getFooterSettings = () => {
    var rawdata = fs.readFileSync('db/settings/footer.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getHeaderSettings = () => {
    var rawdata = fs.readFileSync('db/settings/header.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getLocalisationSettings = () => {
    var rawdata = fs.readFileSync('db/settings/localisation.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getNotificationSettings = () => {
    var rawdata = fs.readFileSync('db/settings/notification.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getDashboardSettings = () => {
    var rawdata = fs.readFileSync('db/settings/dashboard.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}
