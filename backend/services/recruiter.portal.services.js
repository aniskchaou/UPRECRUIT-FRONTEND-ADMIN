const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, '../db/recruiter/recruiter.store.json');

function readStore() {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    return JSON.parse(raw);
}

function writeStore(store) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function nextId(items) {
    return items.length ? Math.max(...items.map((item) => Number(item.id) || 0)) + 1 : 1;
}

function toList(value) {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }

    return String(value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

const ATS_STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

function normalizeStage(stage) {
    const value = String(stage || '').trim();
    return ATS_STAGES.includes(value) ? value : 'Applied';
}

function normalizeSort(sortBy) {
    const value = String(sortBy || '').trim().toLowerCase();
    if (value === 'date' || value === 'rating' || value === 'relevance') {
        return value;
    }

    return 'relevance';
}

function normalizeString(value) {
    return String(value || '').trim().toLowerCase();
}

function toNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function ensureAtsData(store) {
    if (!Array.isArray(store.jobApplicants)) {
        store.jobApplicants = [];
    }

    const companies = Array.isArray(store.companies) ? store.companies : [];
    if (store.jobApplicants.length || !companies.length) {
        return;
    }

    const company = companies[0];
    const seedDate = new Date();
    const sample = [
        {
            id: 1,
            companyId: company.id,
            jobId: 101,
            jobTitle: 'Frontend Engineer',
            candidateName: 'Lina Farhat',
            candidateEmail: 'lina.farhat@example.com',
            skills: ['React', 'TypeScript', 'Testing'],
            experienceYears: 4,
            screeningAnswers: {
                availability: '2 weeks',
                relocation: 'No',
                salaryExpectation: '3500 TND',
            },
            appliedAt: new Date(seedDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            rating: 4.5,
            resumeUrl: 'https://cdn.uprecruit.com/resumes/lina-farhat.pdf',
            stage: 'Applied',
            notes: [],
            tags: ['Strong'],
            rejectedReason: '',
        },
        {
            id: 2,
            companyId: company.id,
            jobId: 101,
            jobTitle: 'Frontend Engineer',
            candidateName: 'Youssef Karray',
            candidateEmail: 'youssef.karray@example.com',
            skills: ['React', 'Redux', 'Cypress'],
            experienceYears: 3,
            screeningAnswers: {
                availability: 'Immediate',
                relocation: 'Yes',
                salaryExpectation: '3200 TND',
            },
            appliedAt: new Date(seedDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            rating: 4.1,
            resumeUrl: 'https://cdn.uprecruit.com/resumes/youssef-karray.pdf',
            stage: 'Screening',
            notes: [],
            tags: ['Backup'],
            rejectedReason: '',
        },
        {
            id: 3,
            companyId: company.id,
            jobId: 102,
            jobTitle: 'Backend Engineer',
            candidateName: 'Meriem Ben Salem',
            candidateEmail: 'meriem.bensalem@example.com',
            skills: ['Node.js', 'PostgreSQL', 'AWS'],
            experienceYears: 6,
            screeningAnswers: {
                availability: '1 month',
                relocation: 'No',
                salaryExpectation: '4800 TND',
            },
            appliedAt: new Date(seedDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            rating: 4.8,
            resumeUrl: 'https://cdn.uprecruit.com/resumes/meriem-bensalem.pdf',
            stage: 'Interview',
            notes: [],
            tags: ['Strong'],
            rejectedReason: '',
        },
    ];

    store.jobApplicants = sample;
}

function listApplicantsByJob(companyId, filters = {}) {
    const store = readStore();
    ensureAtsData(store);

    const candidates = store.jobApplicants.filter((item) => Number(item.companyId) === Number(companyId));
    const skillQuery = normalizeString(filters.skills);
    const screeningQuery = normalizeString(filters.screening);
    const minExperience = toNumber(filters.minExperience, -1);
    const stageFilter = normalizeString(filters.stage);
    const sortBy = normalizeSort(filters.sortBy);

    const filtered = candidates.filter((item) => {
        const candidateSkills = Array.isArray(item.skills) ? item.skills.map((skill) => normalizeString(skill)) : [];
        const screeningText = Object.values(item.screeningAnswers || {}).join(' ').toLowerCase();
        const stageText = normalizeString(item.stage);

        const matchSkills = !skillQuery || candidateSkills.some((skill) => skill.includes(skillQuery));
        const matchExperience = minExperience < 0 || toNumber(item.experienceYears, 0) >= minExperience;
        const matchScreening = !screeningQuery || screeningText.includes(screeningQuery);
        const matchStage = !stageFilter || stageText === stageFilter;

        return matchSkills && matchExperience && matchScreening && matchStage;
    });

    const ranked = filtered.map((item) => {
        const candidateSkills = Array.isArray(item.skills) ? item.skills.map((skill) => normalizeString(skill)) : [];
        const hasSkillBoost = skillQuery && candidateSkills.some((skill) => skill === skillQuery) ? 1 : 0;
        const relevanceScore = Number(item.rating || 0) * 20 + toNumber(item.experienceYears, 0) + hasSkillBoost * 10;
        return {
            ...item,
            relevanceScore,
        };
    });

    ranked.sort((left, right) => {
        if (sortBy === 'date') {
            return new Date(right.appliedAt).getTime() - new Date(left.appliedAt).getTime();
        }

        if (sortBy === 'rating') {
            return Number(right.rating || 0) - Number(left.rating || 0);
        }

        return Number(right.relevanceScore || 0) - Number(left.relevanceScore || 0);
    });

    const jobsMap = {};
    ranked.forEach((item) => {
        const key = String(item.jobId);
        if (!jobsMap[key]) {
            jobsMap[key] = {
                jobId: item.jobId,
                jobTitle: item.jobTitle,
                applicants: [],
            };
        }

        jobsMap[key].applicants.push(item);
    });

    return {
        companyId: Number(companyId),
        sortBy,
        filters: {
            skills: filters.skills || '',
            minExperience: minExperience < 0 ? '' : minExperience,
            screening: filters.screening || '',
            stage: filters.stage || '',
        },
        jobs: Object.values(jobsMap),
        totalApplicants: ranked.length,
    };
}

function getApplicantProfile(companyId, applicationId) {
    const store = readStore();
    ensureAtsData(store);

    return store.jobApplicants.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(applicationId)
    )) || null;
}

function downloadApplicantResume(companyId, applicationId) {
    const profile = getApplicantProfile(companyId, applicationId);
    if (!profile) {
        return null;
    }

    return {
        applicationId: profile.id,
        candidateName: profile.candidateName,
        resumeUrl: profile.resumeUrl || '',
    };
}

function addApplicantNote(companyId, applicationId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    let updated = null;

    store.jobApplicants = store.jobApplicants.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(applicationId)) {
            return item;
        }

        const noteText = String(payload.note || '').trim();
        if (!noteText) {
            return item;
        }

        updated = {
            ...item,
            notes: [
                ...(Array.isArray(item.notes) ? item.notes : []),
                {
                    id: Date.now(),
                    text: noteText,
                    createdAt: new Date().toISOString(),
                },
            ],
        };

        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function tagApplicant(companyId, applicationId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    let updated = null;
    const nextTag = String(payload.tag || '').trim();
    const mode = String(payload.mode || 'add').toLowerCase();

    store.jobApplicants = store.jobApplicants.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(applicationId)) {
            return item;
        }

        const existingTags = Array.isArray(item.tags) ? item.tags : [];
        let tags = existingTags;

        if (nextTag) {
            if (mode === 'remove') {
                tags = existingTags.filter((tag) => normalizeString(tag) !== normalizeString(nextTag));
            } else if (!existingTags.some((tag) => normalizeString(tag) === normalizeString(nextTag))) {
                tags = [...existingTags, nextTag];
            }
        }

        updated = {
            ...item,
            tags,
        };

        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function moveApplicantStage(companyId, applicationId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    let updated = null;
    const stage = normalizeStage(payload.stage);

    store.jobApplicants = store.jobApplicants.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(applicationId)) {
            return item;
        }

        updated = {
            ...item,
            stage,
            rejectedReason: stage === 'Rejected' ? (item.rejectedReason || '') : '',
        };

        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function bulkMoveApplicants(companyId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    const ids = Array.isArray(payload.applicationIds) ? payload.applicationIds.map((id) => Number(id)) : [];
    const stage = normalizeStage(payload.stage);
    const moved = [];

    store.jobApplicants = store.jobApplicants.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || !ids.includes(Number(item.id))) {
            return item;
        }

        const updated = {
            ...item,
            stage,
            rejectedReason: stage === 'Rejected' ? (item.rejectedReason || '') : '',
        };

        moved.push(updated);
        return updated;
    });

    writeStore(store);
    return {
        movedCount: moved.length,
        stage,
        applicants: moved,
    };
}

function rejectApplicant(companyId, applicationId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    let updated = null;
    const reason = String(payload.reason || '').trim();

    store.jobApplicants = store.jobApplicants.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(applicationId)) {
            return item;
        }

        updated = {
            ...item,
            stage: 'Rejected',
            rejectedReason: reason,
        };

        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function reopenRejectedApplicant(companyId, applicationId, payload = {}) {
    const targetStage = normalizeStage(payload.stage || 'Screening');
    const store = readStore();
    ensureAtsData(store);
    let updated = null;

    store.jobApplicants = store.jobApplicants.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(applicationId)) {
            return item;
        }

        updated = {
            ...item,
            stage: targetStage,
            rejectedReason: '',
        };

        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function ensureRecruiterCommunicationData(store) {
    if (!Array.isArray(store.candidateDatabase)) {
        store.candidateDatabase = [];
    }

    if (!Array.isArray(store.candidateShortlists)) {
        store.candidateShortlists = [];
    }

    if (!Array.isArray(store.talentPools)) {
        store.talentPools = [];
    }

    if (!Array.isArray(store.recruiterMessages)) {
        store.recruiterMessages = [];
    }

    if (!Array.isArray(store.messageTemplates)) {
        store.messageTemplates = [];
    }

    if (!Array.isArray(store.emailSequences)) {
        store.emailSequences = [];
    }

    if (!Array.isArray(store.candidateOutreach)) {
        store.candidateOutreach = [];
    }

    if (!store.candidateDatabase.length && Array.isArray(store.companies) && store.companies.length) {
        const companyId = Number(store.companies[0].id);
        store.candidateDatabase = [
            {
                id: 201,
                companyId,
                fullName: 'Sarra Gharbi',
                email: 'sarra.gharbi@example.com',
                location: 'Tunis, Tunisia',
                skills: ['React', 'Next.js', 'TypeScript'],
                experienceYears: 5,
                summary: 'Frontend engineer focused on performance and design systems.',
                resumeUrl: 'https://cdn.uprecruit.com/resumes/sarra-gharbi.pdf',
                source: 'Talent DB',
            },
            {
                id: 202,
                companyId,
                fullName: 'Walid Chebbi',
                email: 'walid.chebbi@example.com',
                location: 'Sfax, Tunisia',
                skills: ['Node.js', 'PostgreSQL', 'Redis'],
                experienceYears: 7,
                summary: 'Backend engineer with API platform and scalability expertise.',
                resumeUrl: 'https://cdn.uprecruit.com/resumes/walid-chebbi.pdf',
                source: 'Referral',
            },
            {
                id: 203,
                companyId,
                fullName: 'Nour Trabelsi',
                email: 'nour.trabelsi@example.com',
                location: 'Remote',
                skills: ['QA', 'Cypress', 'Playwright'],
                experienceYears: 4,
                summary: 'Automation QA specialist and quality advocacy lead.',
                resumeUrl: 'https://cdn.uprecruit.com/resumes/nour-trabelsi.pdf',
                source: 'LinkedIn',
            },
        ];
    }

    if (!store.candidateShortlists.length && Array.isArray(store.companies) && store.companies.length) {
        store.candidateShortlists = [{
            id: 1,
            companyId: Number(store.companies[0].id),
            name: 'Priority Shortlist',
            candidateIds: [],
        }];
    }

    if (!store.talentPools.length && Array.isArray(store.companies) && store.companies.length) {
        store.talentPools = [{
            id: 1,
            companyId: Number(store.companies[0].id),
            name: 'General Talent Pool',
            candidateIds: [],
        }];
    }

    if (!store.messageTemplates.length && Array.isArray(store.companies) && store.companies.length) {
        const companyId = Number(store.companies[0].id);
        store.messageTemplates = [
            {
                id: 1,
                companyId,
                name: 'Initial Outreach',
                subject: 'Opportunity at {{companyName}}',
                body: 'Hi {{candidateName}}, your profile looks like a great match for our team. Are you open to a quick chat?',
            },
            {
                id: 2,
                companyId,
                name: 'Interview Invitation',
                subject: 'Interview Invitation - {{companyName}}',
                body: 'Hi {{candidateName}}, we would like to invite you for an interview on {{interviewDate}}.',
            },
        ];
    }

    if (!store.recruiterMessages.length && Array.isArray(store.companies) && store.companies.length && store.candidateDatabase.length) {
        const companyId = Number(store.companies[0].id);
        const candidate = store.candidateDatabase[0];
        store.recruiterMessages = [
            {
                id: 1,
                companyId,
                candidateId: candidate.id,
                direction: 'inbound',
                subject: 'Interested in frontend roles',
                body: 'Hello, I am open to frontend opportunities with remote flexibility.',
                attachments: [],
                createdAt: new Date().toISOString(),
                threadId: `thread-${candidate.id}`,
                type: 'message',
            },
        ];
    }
}

function resolveCandidateSearchText(candidate) {
    return [
        candidate.fullName,
        candidate.email,
        candidate.location,
        candidate.summary,
        ...(Array.isArray(candidate.skills) ? candidate.skills : []),
    ].join(' ').toLowerCase();
}

function evaluateBooleanQuery(searchText, expression) {
    const normalizedExpression = String(expression || '').trim();
    if (!normalizedExpression) {
        return true;
    }

    const orGroups = normalizedExpression.split(/\s+OR\s+/i);

    return orGroups.some((group) => {
        const andParts = group.split(/\s+AND\s+/i)
            .map((part) => part.trim())
            .filter(Boolean);

        const parts = andParts.length ? andParts : group.split(/\s+/).filter(Boolean);

        return parts.every((part) => {
            const notMatch = part.match(/^NOT\s+(.+)$/i);
            if (notMatch) {
                const token = notMatch[1].trim().toLowerCase();
                return token ? !searchText.includes(token) : true;
            }

            const token = part.trim().toLowerCase();
            return token ? searchText.includes(token) : true;
        });
    });
}

function listCandidateDatabase(companyId, filters = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    const skillsFilter = toList(filters.skills).map((skill) => normalizeString(skill));
    const locationFilter = normalizeString(filters.location);
    const minExperience = toNumber(filters.minExperience, -1);
    const keyword = normalizeString(filters.keyword || filters.search);
    const booleanQuery = String(filters.booleanQuery || filters.boolean || '').trim();

    const candidates = store.candidateDatabase
        .filter((item) => Number(item.companyId) === Number(companyId))
        .filter((candidate) => {
            const skills = Array.isArray(candidate.skills) ? candidate.skills.map((skill) => normalizeString(skill)) : [];
            const searchText = resolveCandidateSearchText(candidate);

            const matchSkills = !skillsFilter.length || skillsFilter.every((skill) => skills.some((candidateSkill) => candidateSkill.includes(skill)));
            const matchLocation = !locationFilter || normalizeString(candidate.location).includes(locationFilter);
            const matchExperience = minExperience < 0 || toNumber(candidate.experienceYears, 0) >= minExperience;
            const matchKeyword = !keyword || searchText.includes(keyword);
            const matchBoolean = evaluateBooleanQuery(searchText, booleanQuery);

            return matchSkills && matchLocation && matchExperience && matchKeyword && matchBoolean;
        });

    const shortlist = store.candidateShortlists.find((item) => Number(item.companyId) === Number(companyId)) || null;
    const shortlistIds = shortlist ? shortlist.candidateIds : [];
    const pools = store.talentPools.filter((item) => Number(item.companyId) === Number(companyId));

    const withFlags = candidates.map((candidate) => ({
        ...candidate,
        shortlisted: shortlistIds.includes(Number(candidate.id)),
        pools: pools.filter((pool) => pool.candidateIds.includes(Number(candidate.id))).map((pool) => pool.name),
    }));

    return {
        companyId: Number(companyId),
        filters: {
            skills: filters.skills || '',
            location: filters.location || '',
            minExperience: minExperience < 0 ? '' : minExperience,
            keyword: filters.keyword || filters.search || '',
            booleanQuery,
        },
        totalCandidates: withFlags.length,
        candidates: withFlags,
        shortlist: shortlist || { id: null, companyId: Number(companyId), name: 'Priority Shortlist', candidateIds: [] },
        talentPools: pools,
    };
}

function getCandidateProfile(companyId, candidateId) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    return store.candidateDatabase.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(candidateId)
    )) || null;
}

function saveCandidateToShortlist(companyId, candidateId) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);
    const candidate = getCandidateProfile(companyId, candidateId);
    if (!candidate) {
        return null;
    }

    let shortlist = store.candidateShortlists.find((item) => Number(item.companyId) === Number(companyId));
    if (!shortlist) {
        shortlist = {
            id: nextId(store.candidateShortlists),
            companyId: Number(companyId),
            name: 'Priority Shortlist',
            candidateIds: [],
        };
        store.candidateShortlists.push(shortlist);
    }

    if (!shortlist.candidateIds.includes(Number(candidateId))) {
        shortlist.candidateIds.push(Number(candidateId));
    }

    writeStore(store);
    return shortlist;
}

function addCandidateToTalentPool(companyId, candidateId, payload = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    const candidate = store.candidateDatabase.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(candidateId)
    ));
    if (!candidate) {
        return null;
    }

    const poolName = String(payload.poolName || '').trim() || 'General Talent Pool';
    let pool = store.talentPools.find((item) => (
        Number(item.companyId) === Number(companyId)
        && normalizeString(item.name) === normalizeString(poolName)
    ));

    if (!pool) {
        pool = {
            id: nextId(store.talentPools),
            companyId: Number(companyId),
            name: poolName,
            candidateIds: [],
        };
        store.talentPools.push(pool);
    }

    if (!pool.candidateIds.includes(Number(candidateId))) {
        pool.candidateIds.push(Number(candidateId));
    }

    writeStore(store);
    return pool;
}

function removeCandidateFromTalentPool(companyId, candidateId, payload = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    const poolName = String(payload.poolName || '').trim() || 'General Talent Pool';
    const pool = store.talentPools.find((item) => (
        Number(item.companyId) === Number(companyId)
        && normalizeString(item.name) === normalizeString(poolName)
    ));

    if (!pool) {
        return null;
    }

    pool.candidateIds = (pool.candidateIds || []).filter((id) => Number(id) !== Number(candidateId));
    writeStore(store);
    return pool;
}

function createTalentPool(companyId, payload = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    const name = String(payload.name || '').trim();
    if (!name) {
        return { error: 'Pool name is required.' };
    }

    let pool = store.talentPools.find((item) => (
        Number(item.companyId) === Number(companyId)
        && normalizeString(item.name) === normalizeString(name)
    ));

    if (pool) {
        return pool;
    }

    pool = {
        id: nextId(store.talentPools),
        companyId: Number(companyId),
        name,
        candidateIds: [],
        createdAt: new Date().toISOString(),
    };

    store.talentPools.push(pool);
    writeStore(store);
    return pool;
}

function tagCandidateInCRM(companyId, candidateId, payload = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    const candidate = store.candidateDatabase.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(candidateId)
    ));
    if (!candidate) {
        return null;
    }

    const tags = toList(payload.tags || payload.tag).map((item) => String(item).trim()).filter(Boolean);
    const mode = normalizeString(payload.mode) || 'set';
    candidate.tags = Array.isArray(candidate.tags) ? candidate.tags : [];

    if (mode === 'add') {
        const set = new Set(candidate.tags.concat(tags));
        candidate.tags = Array.from(set);
    } else if (mode === 'remove') {
        const toRemove = new Set(tags.map((item) => normalizeString(item)));
        candidate.tags = candidate.tags.filter((item) => !toRemove.has(normalizeString(item)));
    } else {
        candidate.tags = tags;
    }

    candidate.updatedAt = new Date().toISOString();
    writeStore(store);
    return candidate;
}

function getCandidateHistory(companyId, candidateId) {
    const store = readStore();
    ensureAtsData(store);
    ensureRecruiterCommunicationData(store);

    const candidate = store.candidateDatabase.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(candidateId)
    ));
    if (!candidate) {
        return null;
    }

    const relatedApplications = (store.jobApplicants || [])
        .filter((item) => Number(item.companyId) === Number(companyId))
        .filter((item) => (
            normalizeString(item.candidateEmail) === normalizeString(candidate.email)
            || normalizeString(item.candidateName) === normalizeString(candidate.fullName)
        ))
        .map((item) => ({
            applicationId: item.id,
            jobId: item.jobId,
            jobTitle: item.jobTitle,
            stage: item.stage,
            rating: item.rating,
            appliedAt: item.appliedAt,
            source: item.source || '',
        }));

    const messages = (store.recruiterMessages || [])
        .filter((item) => Number(item.companyId) === Number(companyId) && Number(item.candidateId) === Number(candidateId))
        .map((item) => ({
            messageId: item.id,
            type: item.type,
            direction: item.direction,
            subject: item.subject,
            createdAt: item.createdAt,
        }));

    const pools = (store.talentPools || [])
        .filter((item) => Number(item.companyId) === Number(companyId) && (item.candidateIds || []).includes(Number(candidateId)))
        .map((item) => item.name);

    return {
        companyId: Number(companyId),
        candidate: {
            id: candidate.id,
            fullName: candidate.fullName,
            email: candidate.email,
            tags: candidate.tags || [],
        },
        pastApplications: relatedApplications,
        messageHistory: messages,
        pools,
    };
}

function reengagePastCandidate(companyId, candidateId, payload = {}) {
    const message = createMessageRecord(companyId, candidateId, {
        subject: payload.subject || 'New opportunity at {{companyName}}',
        body: payload.body || 'Hi {{candidateName}}, we have a new role that matches your background. Interested in reconnecting?',
        attachments: payload.attachments,
    }, {
        direction: 'outbound',
        type: 're-engagement',
        persistOutreach: true,
    });

    return message;
}

function calculateCandidateFitScore(candidate, jobContext = {}) {
    const requiredSkills = toList(jobContext.requiredSkills).map((item) => normalizeString(item));
    const candidateSkills = toList(candidate.skills).map((item) => normalizeString(item));
    const overlapCount = requiredSkills.length
        ? requiredSkills.filter((item) => candidateSkills.some((skill) => skill.includes(item))).length
        : 0;
    const skillScore = requiredSkills.length ? Math.round((overlapCount / requiredSkills.length) * 60) : 35;

    const experienceTarget = toNumber(jobContext.minExperience, 0);
    const candidateExperience = toNumber(candidate.experienceYears, 0);
    const experienceScore = experienceTarget <= 0
        ? Math.min(20, candidateExperience * 2)
        : Math.max(0, Math.min(20, 20 - Math.max(0, experienceTarget - candidateExperience) * 4));

    const locationToken = normalizeString(jobContext.location);
    const locationScore = !locationToken
        ? 10
        : (normalizeString(candidate.location).includes(locationToken) || normalizeString(candidate.location) === 'remote' ? 10 : 4);

    const baseline = 10;
    return Math.max(0, Math.min(100, baseline + skillScore + experienceScore + locationScore));
}

function generateAIJobDescription(companyId, payload = {}) {
    const role = String(payload.jobTitle || payload.role || 'Job Role').trim();
    const seniority = String(payload.seniority || 'Mid-level').trim();
    const location = String(payload.location || 'Hybrid').trim();
    const requiredSkills = toList(payload.requiredSkills);
    const responsibilities = toList(payload.responsibilities);

    const description = [
        `${role} (${seniority})`,
        `Location: ${location}`,
        '',
        'About the role:',
        `We are looking for a ${seniority.toLowerCase()} ${role} to help deliver high-impact hiring outcomes and collaborate with cross-functional teams.`,
        '',
        'Key responsibilities:',
        ...(responsibilities.length ? responsibilities.map((item) => `- ${item}`) : [
            '- Build and improve core product workflows',
            '- Collaborate with recruiting and hiring stakeholders',
            '- Drive measurable delivery outcomes',
        ]),
        '',
        'Required skills:',
        ...(requiredSkills.length ? requiredSkills.map((item) => `- ${item}`) : [
            '- Strong communication and ownership',
            '- Relevant tooling and domain expertise',
        ]),
    ].join('\n');

    return {
        companyId: Number(companyId),
        role,
        generatedDescription: description,
    };
}

function recommendCandidatesForJob(companyId, payload = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    const jobContext = {
        requiredSkills: toList(payload.requiredSkills),
        minExperience: payload.minExperience,
        location: payload.location,
    };

    const recommendedCandidates = store.candidateDatabase
        .filter((item) => Number(item.companyId) === Number(companyId))
        .map((candidate) => ({
            ...candidate,
            matchScore: calculateCandidateFitScore(candidate, jobContext),
        }))
        .sort((left, right) => right.matchScore - left.matchScore)
        .slice(0, toNumber(payload.limit, 5));

    return {
        companyId: Number(companyId),
        total: recommendedCandidates.length,
        candidates: recommendedCandidates,
    };
}

function getCandidateMatchScore(companyId, payload = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    const candidate = store.candidateDatabase.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(payload.candidateId)
    ));
    if (!candidate) {
        return null;
    }

    const fitScore = calculateCandidateFitScore(candidate, {
        requiredSkills: payload.requiredSkills,
        minExperience: payload.minExperience,
        location: payload.location,
    });

    return {
        companyId: Number(companyId),
        candidateId: Number(candidate.id),
        fitScore,
        candidate,
    };
}

function autoRankApplicants(companyId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);

    const targetJobId = payload.jobId ? Number(payload.jobId) : null;
    const applicants = (store.jobApplicants || [])
        .filter((item) => Number(item.companyId) === Number(companyId))
        .filter((item) => (targetJobId ? Number(item.jobId) === targetJobId : true))
        .map((item) => {
            const base = toNumber(item.rating, 0) * 10;
            const experiencePart = Math.min(30, toNumber(item.experienceYears, 0) * 4);
            const stageBonusMap = {
                applied: 6,
                screening: 10,
                interview: 14,
                offer: 18,
                hired: 22,
            };
            const stageBonus = stageBonusMap[normalizeString(item.stage)] || 4;
            const autoRankScore = Math.max(0, Math.min(100, Math.round(base + experiencePart + stageBonus + 20)));
            return {
                ...item,
                autoRankScore,
            };
        })
        .sort((left, right) => right.autoRankScore - left.autoRankScore)
        .map((item, index) => ({ ...item, rank: index + 1 }));

    return {
        companyId: Number(companyId),
        jobId: targetJobId,
        rankedApplicants: applicants,
    };
}

function generateInterviewQuestionsAI(companyId, payload = {}) {
    const role = String(payload.jobTitle || payload.role || 'the role').trim();
    const skills = toList(payload.skills || payload.requiredSkills);

    const questions = [
        `What motivated you to apply for ${role}?`,
        `Describe a project where you had to balance speed and quality while delivering ${role}-related outcomes.`,
        `How do you measure success in your work when collaborating with hiring stakeholders?`,
    ];

    skills.slice(0, 4).forEach((skill) => {
        questions.push(`Can you walk through a practical example where you used ${skill} to solve a difficult problem?`);
    });

    return {
        companyId: Number(companyId),
        role,
        questions,
    };
}

function generateOutreachMessageAI(companyId, payload = {}) {
    const candidateName = String(payload.candidateName || 'Candidate').trim();
    const role = String(payload.jobTitle || payload.role || 'this opportunity').trim();
    const companyName = String(payload.companyName || 'our company').trim();

    const subject = `Opportunity for ${candidateName}: ${role}`;
    const body = `Hi ${candidateName},\n\nI came across your background and thought you could be a strong fit for ${role} at ${companyName}. If you are open to a brief conversation, I would be happy to share details about the role and team.\n\nBest regards,\nRecruiting Team`;

    return {
        companyId: Number(companyId),
        subject,
        body,
    };
}

function predictCandidateSuccess(companyId, payload = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    const candidate = store.candidateDatabase.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(payload.candidateId)
    ));
    if (!candidate) {
        return null;
    }

    const fitScore = calculateCandidateFitScore(candidate, {
        requiredSkills: payload.requiredSkills,
        minExperience: payload.minExperience,
        location: payload.location,
    });

    let predictedOutcome = 'Medium';
    if (fitScore >= 80) {
        predictedOutcome = 'High';
    } else if (fitScore < 55) {
        predictedOutcome = 'Low';
    }

    return {
        companyId: Number(companyId),
        candidateId: Number(candidate.id),
        fitScore,
        predictedOutcome,
        confidence: Math.min(95, Math.max(60, fitScore)),
    };
}

function applyTemplateContent(template, context) {
    if (!template) {
        return {
            subject: context.subject || '',
            body: context.body || '',
        };
    }

    const replaceTokens = (value) => String(value || '')
        .replace(/\{\{candidateName\}\}/g, context.candidateName || '')
        .replace(/\{\{companyName\}\}/g, context.companyName || '')
        .replace(/\{\{interviewDate\}\}/g, context.interviewDate || 'TBD');

    return {
        subject: replaceTokens(context.subject || template.subject),
        body: replaceTokens(context.body || template.body),
    };
}

function createMessageRecord(companyId, candidateId, payload = {}, options = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    const candidate = store.candidateDatabase.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(candidateId)
    ));
    if (!candidate) {
        return null;
    }

    const company = store.companies.find((item) => Number(item.id) === Number(companyId));
    const template = payload.templateId
        ? store.messageTemplates.find((item) => Number(item.companyId) === Number(companyId) && Number(item.id) === Number(payload.templateId))
        : null;

    const content = applyTemplateContent(template, {
        candidateName: candidate.fullName,
        companyName: company ? company.name : 'Your Company',
        interviewDate: payload.interviewDate,
        subject: payload.subject,
        body: payload.body,
    });

    const record = {
        id: nextId(store.recruiterMessages),
        companyId: Number(companyId),
        candidateId: Number(candidateId),
        direction: options.direction || 'outbound',
        subject: content.subject,
        body: content.body,
        attachments: toList(payload.attachments),
        createdAt: new Date().toISOString(),
        threadId: payload.threadId || `thread-${candidateId}`,
        type: options.type || 'message',
        meta: options.meta || {},
    };

    store.recruiterMessages.push(record);
    if (options.persistOutreach) {
        store.candidateOutreach.push({
            id: nextId(store.candidateOutreach),
            companyId: Number(companyId),
            candidateId: Number(candidateId),
            messageId: record.id,
            sentAt: record.createdAt,
            channel: 'email',
        });
    }

    writeStore(store);
    return record;
}

function contactPassiveCandidate(companyId, candidateId, payload = {}) {
    return createMessageRecord(companyId, candidateId, payload, {
        direction: 'outbound',
        type: 'outreach',
        persistOutreach: true,
    });
}

function listCandidateMessages(companyId, filters = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);
    const candidateId = filters.candidateId ? Number(filters.candidateId) : null;

    const messages = store.recruiterMessages
        .filter((item) => Number(item.companyId) === Number(companyId))
        .filter((item) => (candidateId ? Number(item.candidateId) === candidateId : true))
        .sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime());

    return {
        companyId: Number(companyId),
        totalMessages: messages.length,
        messages,
    };
}

function sendCandidateMessage(companyId, payload = {}) {
    return createMessageRecord(companyId, payload.candidateId, payload, {
        direction: 'outbound',
        type: 'message',
    });
}

function replyToCandidateMessage(companyId, messageId, payload = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);
    const original = store.recruiterMessages.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(messageId)
    ));

    if (!original) {
        return null;
    }

    return createMessageRecord(companyId, original.candidateId, {
        subject: payload.subject || `Re: ${original.subject || 'Candidate Message'}`,
        body: payload.body,
        attachments: payload.attachments,
        threadId: original.threadId,
    }, {
        direction: 'outbound',
        type: 'reply',
    });
}

function listMessageTemplates(companyId) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    return store.messageTemplates.filter((item) => Number(item.companyId) === Number(companyId));
}

function saveMessageTemplate(companyId, payload = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    const name = String(payload.name || '').trim();
    if (!name) {
        return { error: 'Template name is required.' };
    }

    let template = store.messageTemplates.find((item) => (
        Number(item.companyId) === Number(companyId)
        && (Number(item.id) === Number(payload.id) || normalizeString(item.name) === normalizeString(name))
    ));

    if (template) {
        template.name = name;
        template.subject = String(payload.subject || template.subject || '').trim();
        template.body = String(payload.body || template.body || '').trim();
    } else {
        template = {
            id: nextId(store.messageTemplates),
            companyId: Number(companyId),
            name,
            subject: String(payload.subject || '').trim(),
            body: String(payload.body || '').trim(),
        };
        store.messageTemplates.push(template);
    }

    writeStore(store);
    return template;
}

function sendBulkMessages(companyId, payload = {}) {
    const candidateIds = Array.isArray(payload.candidateIds) ? payload.candidateIds.map((id) => Number(id)) : [];
    const sent = candidateIds
        .map((candidateId) => sendCandidateMessage(companyId, { ...payload, candidateId }))
        .filter(Boolean);

    return {
        sentCount: sent.length,
        messages: sent,
    };
}

function sendInterviewInvitation(companyId, payload = {}) {
    return createMessageRecord(companyId, payload.candidateId, {
        templateId: payload.templateId,
        subject: payload.subject || 'Interview Invitation - {{companyName}}',
        body: payload.body || 'Hi {{candidateName}}, we would like to invite you for an interview on {{interviewDate}}.',
        attachments: payload.attachments,
        interviewDate: payload.interviewDate,
    }, {
        direction: 'outbound',
        type: 'interview-invitation',
        meta: {
            interviewDate: payload.interviewDate || '',
            interviewMode: payload.interviewMode || 'Online',
        },
    });
}

function sendRejectionEmail(companyId, payload = {}) {
    return createMessageRecord(companyId, payload.candidateId, {
        subject: payload.subject || 'Update on Your Application',
        body: payload.body || `Hi {{candidateName}}, thank you for your interest. ${payload.reason ? `Reason: ${payload.reason}.` : ''}`,
        attachments: payload.attachments,
    }, {
        direction: 'outbound',
        type: 'rejection-email',
        meta: {
            reason: payload.reason || '',
        },
    });
}

function sendFollowUpEmail(companyId, payload = {}) {
    return createMessageRecord(companyId, payload.candidateId, {
        subject: payload.subject || 'Following Up on Your Application',
        body: payload.body || 'Hi {{candidateName}}, just checking in regarding your application status.',
        attachments: payload.attachments,
    }, {
        direction: 'outbound',
        type: 'follow-up',
    });
}

function createAutomatedSequence(companyId, payload = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    const name = String(payload.name || '').trim();
    if (!name) {
        return { error: 'Sequence name is required.' };
    }

    const inputSteps = Array.isArray(payload.steps) ? payload.steps : [];
    const steps = inputSteps.map((step, index) => ({
        step: index + 1,
        delayDays: toNumber(step.delayDays, 0),
        subject: String(step.subject || '').trim(),
        body: String(step.body || '').trim(),
        templateId: step.templateId ? Number(step.templateId) : null,
    }));

    const sequence = {
        id: nextId(store.emailSequences),
        companyId: Number(companyId),
        name,
        steps,
        createdAt: new Date().toISOString(),
        assignments: [],
    };

    store.emailSequences.push(sequence);
    writeStore(store);
    return sequence;
}

function listAutomatedSequences(companyId) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    return store.emailSequences.filter((item) => Number(item.companyId) === Number(companyId));
}

function assignSequenceToCandidate(companyId, sequenceId, payload = {}) {
    const store = readStore();
    ensureRecruiterCommunicationData(store);

    const sequence = store.emailSequences.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(sequenceId)
    ));
    const candidate = store.candidateDatabase.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(payload.candidateId)
    ));

    if (!sequence || !candidate) {
        return null;
    }

    const assignment = {
        candidateId: Number(candidate.id),
        assignedAt: new Date().toISOString(),
        status: 'Active',
    };

    sequence.assignments = Array.isArray(sequence.assignments) ? sequence.assignments : [];
    const alreadyAssigned = sequence.assignments.some((item) => Number(item.candidateId) === Number(candidate.id));
    if (!alreadyAssigned) {
        sequence.assignments.push(assignment);
        writeStore(store);
    }

    return sequence;
}

function ensureInterviewEvaluationData(store) {
    if (!Array.isArray(store.interviewSchedules)) {
        store.interviewSchedules = [];
    }

    if (!Array.isArray(store.interviewFeedback)) {
        store.interviewFeedback = [];
    }

    if (!Array.isArray(store.candidateAssessments)) {
        store.candidateAssessments = [];
    }

    if (!Array.isArray(store.candidateStructuredFeedback)) {
        store.candidateStructuredFeedback = [];
    }
}

function findApplicant(store, companyId, applicationId) {
    return (store.jobApplicants || []).find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(applicationId)
    )) || null;
}

function normalizeInterviewType(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'phone') {
        return 'Phone';
    }

    if (normalized === 'on-site' || normalized === 'onsite') {
        return 'On-site';
    }

    return 'Video';
}

function normalizeCalendarProvider(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'google') {
        return 'Google';
    }

    if (normalized === 'outlook') {
        return 'Outlook';
    }

    return 'None';
}

function toSlotList(value) {
    const slots = toList(value);
    return slots.length ? slots : [];
}

function inviteCandidateToInterview(companyId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    ensureInterviewEvaluationData(store);

    const applicant = findApplicant(store, companyId, payload.applicationId);
    if (!applicant) {
        return null;
    }

    const interview = {
        id: nextId(store.interviewSchedules),
        companyId: Number(companyId),
        applicationId: Number(applicant.id),
        candidateName: applicant.candidateName,
        candidateEmail: applicant.candidateEmail,
        jobId: applicant.jobId,
        jobTitle: applicant.jobTitle,
        interviewType: normalizeInterviewType(payload.interviewType),
        proposedSlots: toSlotList(payload.proposedSlots),
        selectedSlot: String(payload.selectedSlot || '').trim(),
        calendarProvider: normalizeCalendarProvider(payload.calendarProvider),
        calendarSynced: normalizeCalendarProvider(payload.calendarProvider) !== 'None',
        status: 'Proposed',
        notes: String(payload.notes || '').trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cancellationReason: '',
    };

    store.interviewSchedules.push(interview);
    writeStore(store);
    return interview;
}

function listInterviews(companyId, filters = {}) {
    const store = readStore();
    ensureInterviewEvaluationData(store);

    const interviewType = normalizeString(filters.interviewType);
    const status = normalizeString(filters.status);

    const interviews = store.interviewSchedules
        .filter((item) => Number(item.companyId) === Number(companyId))
        .filter((item) => (!interviewType || normalizeString(item.interviewType) === interviewType))
        .filter((item) => (!status || normalizeString(item.status) === status))
        .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());

    return {
        companyId: Number(companyId),
        totalInterviews: interviews.length,
        interviews,
    };
}

function syncInterviewCalendar(companyId, interviewId, payload = {}) {
    const store = readStore();
    ensureInterviewEvaluationData(store);
    let updated = null;

    store.interviewSchedules = store.interviewSchedules.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(interviewId)) {
            return item;
        }

        const provider = normalizeCalendarProvider(payload.calendarProvider || item.calendarProvider);
        updated = {
            ...item,
            calendarProvider: provider,
            calendarSynced: provider !== 'None',
            updatedAt: new Date().toISOString(),
        };
        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function rescheduleInterview(companyId, interviewId, payload = {}) {
    const store = readStore();
    ensureInterviewEvaluationData(store);
    let updated = null;

    store.interviewSchedules = store.interviewSchedules.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(interviewId)) {
            return item;
        }

        const selectedSlot = String(payload.selectedSlot || '').trim();
        updated = {
            ...item,
            interviewType: payload.interviewType ? normalizeInterviewType(payload.interviewType) : item.interviewType,
            proposedSlots: payload.proposedSlots ? toSlotList(payload.proposedSlots) : item.proposedSlots,
            selectedSlot: selectedSlot || item.selectedSlot,
            status: 'Rescheduled',
            updatedAt: new Date().toISOString(),
        };
        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function cancelInterview(companyId, interviewId, payload = {}) {
    const store = readStore();
    ensureInterviewEvaluationData(store);
    let updated = null;

    store.interviewSchedules = store.interviewSchedules.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(interviewId)) {
            return item;
        }

        updated = {
            ...item,
            status: 'Canceled',
            cancellationReason: String(payload.reason || '').trim(),
            updatedAt: new Date().toISOString(),
        };
        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function addInterviewNotes(companyId, interviewId, payload = {}) {
    const store = readStore();
    ensureInterviewEvaluationData(store);
    let updated = null;

    store.interviewSchedules = store.interviewSchedules.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(interviewId)) {
            return item;
        }

        updated = {
            ...item,
            notes: String(payload.notes || '').trim(),
            updatedAt: new Date().toISOString(),
        };
        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function addInterviewFeedback(companyId, interviewId, payload = {}) {
    const store = readStore();
    ensureInterviewEvaluationData(store);

    const interview = store.interviewSchedules.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(interviewId)
    ));
    if (!interview) {
        return null;
    }

    const feedback = {
        id: nextId(store.interviewFeedback),
        companyId: Number(companyId),
        interviewId: Number(interviewId),
        applicationId: Number(interview.applicationId),
        feedback: String(payload.feedback || '').trim(),
        rating: Math.max(0, Math.min(5, toNumber(payload.rating, 0))),
        sharedWithTeam: !!payload.sharedWithTeam,
        sharedTeamMembers: toList(payload.sharedTeamMembers),
        createdAt: new Date().toISOString(),
    };

    store.interviewFeedback.push(feedback);
    writeStore(store);
    return feedback;
}

function shareInterviewFeedback(companyId, interviewId, payload = {}) {
    const store = readStore();
    ensureInterviewEvaluationData(store);
    let updated = null;

    store.interviewFeedback = store.interviewFeedback.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.interviewId) !== Number(interviewId)) {
            return item;
        }

        updated = {
            ...item,
            sharedWithTeam: true,
            sharedTeamMembers: toList(payload.sharedTeamMembers || payload.teamMembers),
        };
        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function reviewScreeningAnswers(companyId, applicationId) {
    const store = readStore();
    ensureAtsData(store);
    const applicant = findApplicant(store, companyId, applicationId);
    if (!applicant) {
        return null;
    }

    return {
        applicationId: Number(applicant.id),
        candidateName: applicant.candidateName,
        screeningAnswers: applicant.screeningAnswers || {},
    };
}

function rateCandidate(companyId, applicationId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    let updated = null;
    const rating = Math.max(0, Math.min(5, toNumber(payload.rating, 0)));

    store.jobApplicants = store.jobApplicants.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(applicationId)) {
            return item;
        }

        updated = {
            ...item,
            rating,
        };
        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function leaveStructuredFeedback(companyId, applicationId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    ensureInterviewEvaluationData(store);

    const applicant = findApplicant(store, companyId, applicationId);
    if (!applicant) {
        return null;
    }

    let feedback = store.candidateStructuredFeedback.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.applicationId) === Number(applicationId)
    ));

    if (feedback) {
        feedback.strengths = toList(payload.strengths || feedback.strengths);
        feedback.concerns = toList(payload.concerns || feedback.concerns);
        feedback.recommendation = String(payload.recommendation || feedback.recommendation || '').trim();
        feedback.overallScore = toNumber(payload.overallScore, feedback.overallScore || 0);
        feedback.updatedAt = new Date().toISOString();
    } else {
        feedback = {
            id: nextId(store.candidateStructuredFeedback),
            companyId: Number(companyId),
            applicationId: Number(applicationId),
            candidateName: applicant.candidateName,
            strengths: toList(payload.strengths),
            concerns: toList(payload.concerns),
            recommendation: String(payload.recommendation || '').trim(),
            overallScore: toNumber(payload.overallScore, 0),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        store.candidateStructuredFeedback.push(feedback);
    }

    writeStore(store);
    return feedback;
}

function compareCandidates(companyId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    ensureInterviewEvaluationData(store);
    const ids = Array.isArray(payload.applicationIds) ? payload.applicationIds.map((id) => Number(id)) : [];

    const candidates = store.jobApplicants
        .filter((item) => Number(item.companyId) === Number(companyId) && ids.includes(Number(item.id)))
        .map((item) => {
            const structured = store.candidateStructuredFeedback.find((feedback) => (
                Number(feedback.companyId) === Number(companyId)
                && Number(feedback.applicationId) === Number(item.id)
            ));

            const assessment = store.candidateAssessments
                .filter((test) => Number(test.companyId) === Number(companyId) && Number(test.applicationId) === Number(item.id));

            return {
                applicationId: item.id,
                candidateName: item.candidateName,
                stage: item.stage,
                experienceYears: item.experienceYears,
                rating: item.rating,
                skills: item.skills || [],
                structuredFeedback: structured || null,
                assessments: assessment,
            };
        });

    return {
        companyId: Number(companyId),
        comparedCount: candidates.length,
        candidates,
    };
}

function assignAssessment(companyId, applicationId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    ensureInterviewEvaluationData(store);

    const applicant = findApplicant(store, companyId, applicationId);
    if (!applicant) {
        return null;
    }

    const assessment = {
        id: nextId(store.candidateAssessments),
        companyId: Number(companyId),
        applicationId: Number(applicationId),
        candidateName: applicant.candidateName,
        testTitle: String(payload.testTitle || payload.title || 'General Assessment').trim(),
        testType: String(payload.testType || 'Technical').trim(),
        dueDate: String(payload.dueDate || '').trim(),
        maxScore: toNumber(payload.maxScore, 100),
        status: 'Assigned',
        score: null,
        resultNotes: '',
        assignedAt: new Date().toISOString(),
        reviewedAt: '',
    };

    store.candidateAssessments.push(assessment);
    writeStore(store);
    return assessment;
}

function reviewAssessmentResult(companyId, assessmentId, payload = {}) {
    const store = readStore();
    ensureInterviewEvaluationData(store);
    let updated = null;

    store.candidateAssessments = store.candidateAssessments.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(assessmentId)) {
            return item;
        }

        updated = {
            ...item,
            score: toNumber(payload.score, item.score === null ? 0 : item.score),
            status: String(payload.status || 'Reviewed').trim(),
            resultNotes: String(payload.resultNotes || payload.notes || '').trim(),
            reviewedAt: new Date().toISOString(),
        };
        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function listAssessmentResults(companyId, filters = {}) {
    const store = readStore();
    ensureInterviewEvaluationData(store);
    const applicationId = filters.applicationId ? Number(filters.applicationId) : null;

    const assessments = store.candidateAssessments
        .filter((item) => Number(item.companyId) === Number(companyId))
        .filter((item) => (applicationId ? Number(item.applicationId) === applicationId : true))
        .sort((left, right) => new Date(right.assignedAt).getTime() - new Date(left.assignedAt).getTime());

    return {
        companyId: Number(companyId),
        totalAssessments: assessments.length,
        assessments,
    };
}

function ensureOfferAnalyticsData(store) {
    if (!Array.isArray(store.jobOffers)) {
        store.jobOffers = [];
    }

    if (!Array.isArray(store.closedJobPostings)) {
        store.closedJobPostings = [];
    }

    if (!Array.isArray(store.recruiterActivityStats)) {
        store.recruiterActivityStats = [];
    }

    if (!Array.isArray(store.hiringManagerFeedback)) {
        store.hiringManagerFeedback = [];
    }
}

function normalizeOfferStatus(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'accepted') {
        return 'Accepted';
    }

    if (normalized === 'declined') {
        return 'Declined';
    }

    return 'Sent';
}

function trackRecruiterAction(store, companyId, actionName, payload = {}) {
    ensureOfferAnalyticsData(store);
    const recruiterId = toNumber(payload.recruiterId, 0);
    const recruiter = (store.recruiters || []).find((item) => Number(item.id) === recruiterId) || null;
    const recruiterName = recruiter ? recruiter.fullName : 'Recruiter';

    let bucket = store.recruiterActivityStats.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.recruiterId) === recruiterId
    ));

    if (!bucket) {
        bucket = {
            id: nextId(store.recruiterActivityStats),
            companyId: Number(companyId),
            recruiterId,
            recruiterName,
            actions: {
                candidatesSelected: 0,
                offersCreated: 0,
                hiresCompleted: 0,
                jobsClosed: 0,
            },
            lastActionAt: new Date().toISOString(),
        };
        store.recruiterActivityStats.push(bucket);
    }

    if (!bucket.actions || typeof bucket.actions !== 'object') {
        bucket.actions = {};
    }

    bucket.actions[actionName] = toNumber(bucket.actions[actionName], 0) + 1;
    bucket.lastActionAt = new Date().toISOString();
}

function markCandidateSelected(companyId, applicationId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    ensureOfferAnalyticsData(store);
    let updated = null;

    store.jobApplicants = store.jobApplicants.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(applicationId)) {
            return item;
        }

        updated = {
            ...item,
            stage: 'Offer',
            selectionStatus: 'Selected',
            selectedAt: new Date().toISOString(),
            selectedBy: String(payload.selectedBy || '').trim(),
        };
        return updated;
    });

    if (!updated) {
        return null;
    }

    trackRecruiterAction(store, companyId, 'candidatesSelected', payload);
    writeStore(store);
    return updated;
}

function createJobOffer(companyId, applicationId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    ensureOfferAnalyticsData(store);

    const applicant = findApplicant(store, companyId, applicationId);
    if (!applicant) {
        return null;
    }

    const offer = {
        id: nextId(store.jobOffers),
        companyId: Number(companyId),
        applicationId: Number(applicationId),
        candidateName: applicant.candidateName,
        candidateEmail: applicant.candidateEmail,
        jobId: applicant.jobId,
        jobTitle: applicant.jobTitle,
        compensation: String(payload.compensation || '').trim(),
        proposedStartDate: String(payload.proposedStartDate || '').trim(),
        notes: String(payload.notes || '').trim(),
        offerLetterUrl: String(payload.offerLetterUrl || '').trim(),
        status: normalizeOfferStatus(payload.status),
        sentAt: new Date().toISOString(),
        decidedAt: '',
        decisionReason: '',
    };

    store.jobOffers.push(offer);
    trackRecruiterAction(store, companyId, 'offersCreated', payload);
    writeStore(store);
    return offer;
}

function attachOfferLetter(companyId, offerId, payload = {}) {
    const store = readStore();
    ensureOfferAnalyticsData(store);
    let updated = null;

    store.jobOffers = store.jobOffers.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(offerId)) {
            return item;
        }

        updated = {
            ...item,
            offerLetterUrl: String(payload.offerLetterUrl || payload.url || '').trim(),
        };
        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function updateOfferStatus(companyId, offerId, payload = {}) {
    const store = readStore();
    ensureOfferAnalyticsData(store);
    let updated = null;

    store.jobOffers = store.jobOffers.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(offerId)) {
            return item;
        }

        const status = normalizeOfferStatus(payload.status || item.status);
        updated = {
            ...item,
            status,
            decidedAt: status === 'Sent' ? '' : new Date().toISOString(),
            decisionReason: String(payload.decisionReason || item.decisionReason || '').trim(),
        };
        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function listJobOffers(companyId, filters = {}) {
    const store = readStore();
    ensureOfferAnalyticsData(store);
    const status = normalizeString(filters.status);

    const offers = store.jobOffers
        .filter((item) => Number(item.companyId) === Number(companyId))
        .filter((item) => (!status || normalizeString(item.status) === status))
        .sort((left, right) => new Date(right.sentAt).getTime() - new Date(left.sentAt).getTime());

    return {
        companyId: Number(companyId),
        totalOffers: offers.length,
        offers,
    };
}

function markCandidateHired(companyId, applicationId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    ensureOfferAnalyticsData(store);
    let updated = null;

    store.jobApplicants = store.jobApplicants.map((item) => {
        if (Number(item.companyId) !== Number(companyId) || Number(item.id) !== Number(applicationId)) {
            return item;
        }

        updated = {
            ...item,
            stage: 'Hired',
            hiredAt: new Date().toISOString(),
            source: String(payload.source || item.source || 'Direct Application').trim(),
        };
        return updated;
    });

    if (!updated) {
        return null;
    }

    store.jobOffers = store.jobOffers.map((item) => {
        if (Number(item.companyId) === Number(companyId) && Number(item.applicationId) === Number(applicationId)) {
            return {
                ...item,
                status: 'Accepted',
                decidedAt: item.decidedAt || new Date().toISOString(),
            };
        }

        return item;
    });

    trackRecruiterAction(store, companyId, 'hiresCompleted', payload);
    writeStore(store);
    return updated;
}

function closeJobPosting(companyId, jobId, payload = {}) {
    const store = readStore();
    ensureAtsData(store);
    ensureOfferAnalyticsData(store);

    const sample = store.jobApplicants.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.jobId) === Number(jobId)
    ));

    const existing = store.closedJobPostings.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.jobId) === Number(jobId)
    ));

    if (existing) {
        return existing;
    }

    const closed = {
        id: nextId(store.closedJobPostings),
        companyId: Number(companyId),
        jobId: Number(jobId),
        jobTitle: String(payload.jobTitle || (sample && sample.jobTitle) || `Job ${jobId}`).trim(),
        reason: String(payload.reason || '').trim(),
        closedAt: new Date().toISOString(),
    };

    store.closedJobPostings.push(closed);
    trackRecruiterAction(store, companyId, 'jobsClosed', payload);
    writeStore(store);
    return closed;
}

function getJobPerformanceReport(companyId, filters = {}) {
    const store = readStore();
    ensureAtsData(store);
    ensureOfferAnalyticsData(store);
    const jobId = filters.jobId ? Number(filters.jobId) : null;

    const scopedApplicants = store.jobApplicants.filter((item) => Number(item.companyId) === Number(companyId));
    const ids = Array.from(new Set(scopedApplicants.map((item) => Number(item.jobId)))).filter((id) => (jobId ? Number(id) === jobId : true));

    const jobs = ids.map((id) => {
        const applicants = scopedApplicants.filter((item) => Number(item.jobId) === Number(id));
        const hiredCount = applicants.filter((item) => normalizeString(item.stage) === 'hired').length;
        const views = Math.max(applicants.length * 15, 30);
        const conversionRate = applicants.length ? Number(((hiredCount / applicants.length) * 100).toFixed(2)) : 0;

        return {
            jobId: id,
            jobTitle: applicants[0] ? applicants[0].jobTitle : `Job ${id}`,
            jobViews: views,
            applications: applicants.length,
            conversionRate,
        };
    });

    return {
        companyId: Number(companyId),
        totalJobs: jobs.length,
        jobs,
    };
}

function getHiringMetricsReport(companyId) {
    const store = readStore();
    ensureAtsData(store);
    ensureOfferAnalyticsData(store);

    const hiredApplicants = store.jobApplicants.filter((item) => (
        Number(item.companyId) === Number(companyId)
        && normalizeString(item.stage) === 'hired'
        && item.hiredAt
    ));

    const timeToHireDaysList = hiredApplicants.map((item) => {
        const applied = new Date(item.appliedAt).getTime();
        const hired = new Date(item.hiredAt).getTime();
        if (!Number.isFinite(applied) || !Number.isFinite(hired) || hired < applied) {
            return 0;
        }

        return Math.round((hired - applied) / (1000 * 60 * 60 * 24));
    });

    const averageTimeToHire = timeToHireDaysList.length
        ? Number((timeToHireDaysList.reduce((sum, value) => sum + value, 0) / timeToHireDaysList.length).toFixed(2))
        : 0;

    const acceptedOffers = store.jobOffers.filter((item) => (
        Number(item.companyId) === Number(companyId)
        && normalizeString(item.status) === 'accepted'
    ));
    const costs = acceptedOffers.map((item) => toNumber(item.costPerHire, 0)).filter((value) => value > 0);
    const averageCostPerHire = costs.length
        ? Number((costs.reduce((sum, value) => sum + value, 0) / costs.length).toFixed(2))
        : 0;

    const sourceCount = {};
    store.jobApplicants
        .filter((item) => Number(item.companyId) === Number(companyId))
        .forEach((item) => {
            const source = String(item.source || 'Direct Application').trim();
            sourceCount[source] = toNumber(sourceCount[source], 0) + 1;
        });

    const sourceOfCandidates = Object.keys(sourceCount)
        .sort((left, right) => sourceCount[right] - sourceCount[left])
        .map((source) => ({ source, count: sourceCount[source] }));

    return {
        companyId: Number(companyId),
        averageTimeToHire,
        averageCostPerHire,
        sourceOfCandidates,
    };
}

function saveHiringManagerFeedback(companyId, payload = {}) {
    const store = readStore();
    ensureOfferAnalyticsData(store);

    const record = {
        id: nextId(store.hiringManagerFeedback),
        companyId: Number(companyId),
        hiringManagerName: String(payload.hiringManagerName || 'Hiring Manager').trim(),
        recruiterId: toNumber(payload.recruiterId, 0),
        recruiterName: String(payload.recruiterName || '').trim(),
        feedback: String(payload.feedback || '').trim(),
        score: Math.max(0, Math.min(5, toNumber(payload.score, 0))),
        createdAt: new Date().toISOString(),
    };

    store.hiringManagerFeedback.push(record);
    writeStore(store);
    return record;
}

function getTeamPerformanceReport(companyId) {
    const store = readStore();
    ensureOfferAnalyticsData(store);

    const recruiterActivityStats = store.recruiterActivityStats
        .filter((item) => Number(item.companyId) === Number(companyId))
        .sort((left, right) => new Date(right.lastActionAt).getTime() - new Date(left.lastActionAt).getTime());

    const hiringManagerFeedback = store.hiringManagerFeedback
        .filter((item) => Number(item.companyId) === Number(companyId))
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

    return {
        companyId: Number(companyId),
        recruiterActivityStats,
        hiringManagerFeedback,
    };
}

function ensureSubscriptionNotificationData(store) {
    if (!Array.isArray(store.companySubscriptions)) {
        store.companySubscriptions = [];
    }

    if (!Array.isArray(store.billingInvoices)) {
        store.billingInvoices = [];
    }

    if (!Array.isArray(store.companyPaymentMethods)) {
        store.companyPaymentMethods = [];
    }

    if (!Array.isArray(store.notificationSettings)) {
        store.notificationSettings = [];
    }

    if (!Array.isArray(store.recruiterNotifications)) {
        store.recruiterNotifications = [];
    }

    if (!Array.isArray(store.featuredListingPayments)) {
        store.featuredListingPayments = [];
    }
}

function planAmount(planName) {
    const normalized = normalizeString(planName);
    if (normalized === 'free') {
        return 0;
    }

    if (normalized === 'starter') {
        return 99;
    }

    if (normalized === 'growth') {
        return 249;
    }

    if (normalized === 'enterprise') {
        return 699;
    }

    return 149;
}

function normalizePlanName(planName) {
    const normalized = normalizeString(planName);
    if (normalized === 'free') {
        return 'Free';
    }

    if (normalized === 'starter') {
        return 'Starter';
    }

    if (normalized === 'growth') {
        return 'Growth';
    }

    if (normalized === 'enterprise') {
        return 'Enterprise';
    }

    return 'Standard';
}

function findOrCreateSubscription(store, companyId) {
    ensureSubscriptionNotificationData(store);
    let subscription = store.companySubscriptions.find((item) => Number(item.companyId) === Number(companyId));

    if (!subscription) {
        subscription = {
            id: nextId(store.companySubscriptions),
            companyId: Number(companyId),
            planName: 'Standard',
            billingCycle: 'Monthly',
            jobCredits: 0,
            featuredListingCredits: 0,
            status: 'Active',
            startedAt: new Date().toISOString(),
            renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
        };
        store.companySubscriptions.push(subscription);
    }

    return subscription;
}

function findOrCreateNotificationSettings(store, companyId) {
    ensureSubscriptionNotificationData(store);
    let settings = store.notificationSettings.find((item) => Number(item.companyId) === Number(companyId));

    if (!settings) {
        settings = {
            id: nextId(store.notificationSettings),
            companyId: Number(companyId),
            emailEnabled: true,
            pushEnabled: true,
            alerts: {
                newApplicants: true,
                messages: true,
                interviewConfirmations: true,
            },
            readNotificationIds: [],
            updatedAt: new Date().toISOString(),
        };
        store.notificationSettings.push(settings);
    }

    if (!settings.alerts || typeof settings.alerts !== 'object') {
        settings.alerts = {
            newApplicants: true,
            messages: true,
            interviewConfirmations: true,
        };
    }

    if (!Array.isArray(settings.readNotificationIds)) {
        settings.readNotificationIds = [];
    }

    return settings;
}

function createInvoice(store, companyId, payload = {}) {
    ensureSubscriptionNotificationData(store);
    const invoice = {
        id: nextId(store.billingInvoices),
        companyId: Number(companyId),
        type: String(payload.type || 'Billing').trim(),
        description: String(payload.description || '').trim(),
        amount: toNumber(payload.amount, 0),
        currency: String(payload.currency || 'USD').trim() || 'USD',
        status: String(payload.status || 'Paid').trim() || 'Paid',
        issuedAt: new Date().toISOString(),
    };

    store.billingInvoices.push(invoice);
    return invoice;
}

function getSubscriptionOverview(companyId) {
    const store = readStore();
    ensureSubscriptionNotificationData(store);

    const subscription = findOrCreateSubscription(store, companyId);
    writeStore(store);

    return {
        companyId: Number(companyId),
        subscription,
    };
}

function changeSubscriptionPlan(companyId, payload = {}) {
    const store = readStore();
    ensureSubscriptionNotificationData(store);

    const subscription = findOrCreateSubscription(store, companyId);
    subscription.planName = normalizePlanName(payload.planName || payload.plan);
    subscription.billingCycle = String(payload.billingCycle || subscription.billingCycle || 'Monthly').trim() || 'Monthly';
    subscription.updatedAt = new Date().toISOString();

    const invoice = createInvoice(store, companyId, {
        type: 'Plan Change',
        description: `Plan updated to ${subscription.planName}`,
        amount: planAmount(subscription.planName),
        currency: payload.currency || 'USD',
        status: 'Paid',
    });

    writeStore(store);
    return {
        companyId: Number(companyId),
        subscription,
        invoice,
    };
}

function purchaseJobCredits(companyId, payload = {}) {
    const store = readStore();
    ensureSubscriptionNotificationData(store);

    const quantity = Math.max(1, toNumber(payload.credits || payload.quantity, 0));
    const unitPrice = Math.max(1, toNumber(payload.unitPrice, 15));
    const amount = toNumber(payload.amount, quantity * unitPrice);

    const subscription = findOrCreateSubscription(store, companyId);
    subscription.jobCredits = toNumber(subscription.jobCredits, 0) + quantity;
    subscription.updatedAt = new Date().toISOString();

    const invoice = createInvoice(store, companyId, {
        type: 'Job Credits',
        description: `Purchased ${quantity} job credits`,
        amount,
        currency: payload.currency || 'USD',
        status: 'Paid',
    });

    writeStore(store);
    return {
        companyId: Number(companyId),
        purchasedCredits: quantity,
        subscription,
        invoice,
    };
}

function payForFeaturedListing(companyId, payload = {}) {
    const store = readStore();
    ensureSubscriptionNotificationData(store);

    const quantity = Math.max(1, toNumber(payload.quantity, 1));
    const jobId = toNumber(payload.jobId, 0);
    const unitPrice = Math.max(1, toNumber(payload.unitPrice, 50));
    const subscription = findOrCreateSubscription(store, companyId);
    const availableCredits = toNumber(subscription.featuredListingCredits, 0);

    let chargedQuantity = quantity;
    let paidUsingCredits = false;
    if (availableCredits >= quantity) {
        subscription.featuredListingCredits = availableCredits - quantity;
        chargedQuantity = 0;
        paidUsingCredits = true;
    }

    const amount = toNumber(payload.amount, chargedQuantity * unitPrice);
    const payment = {
        id: nextId(store.featuredListingPayments),
        companyId: Number(companyId),
        jobId,
        quantity,
        paidUsingCredits,
        amount,
        currency: String(payload.currency || 'USD').trim() || 'USD',
        paidAt: new Date().toISOString(),
    };
    store.featuredListingPayments.push(payment);

    const invoice = createInvoice(store, companyId, {
        type: 'Featured Listing',
        description: `Featured listing payment for job ${jobId || 'N/A'} (${quantity})`,
        amount,
        currency: payment.currency,
        status: 'Paid',
    });

    subscription.updatedAt = new Date().toISOString();
    writeStore(store);
    return {
        companyId: Number(companyId),
        payment,
        invoice,
        subscription,
    };
}

function listBillingInvoices(companyId, filters = {}) {
    const store = readStore();
    ensureSubscriptionNotificationData(store);

    const typeFilter = normalizeString(filters.type);
    const invoices = store.billingInvoices
        .filter((item) => Number(item.companyId) === Number(companyId))
        .filter((item) => (!typeFilter || normalizeString(item.type) === typeFilter))
        .sort((left, right) => new Date(right.issuedAt).getTime() - new Date(left.issuedAt).getTime());

    return {
        companyId: Number(companyId),
        totalInvoices: invoices.length,
        invoices,
    };
}

function downloadInvoice(companyId, invoiceId) {
    const store = readStore();
    ensureSubscriptionNotificationData(store);

    const invoice = store.billingInvoices.find((item) => (
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(invoiceId)
    ));

    if (!invoice) {
        return null;
    }

    return {
        invoice,
        downloadUrl: `https://cdn.uprecruit.com/invoices/company-${companyId}/invoice-${invoiceId}.pdf`,
    };
}

function listPaymentMethods(companyId) {
    const store = readStore();
    ensureSubscriptionNotificationData(store);

    const paymentMethods = store.companyPaymentMethods
        .filter((item) => Number(item.companyId) === Number(companyId))
        .sort((left, right) => Number(right.isDefault) - Number(left.isDefault));

    return {
        companyId: Number(companyId),
        paymentMethods,
    };
}

function savePaymentMethod(companyId, payload = {}) {
    const store = readStore();
    ensureSubscriptionNotificationData(store);

    const isDefault = Boolean(payload.isDefault);
    if (isDefault) {
        store.companyPaymentMethods = store.companyPaymentMethods.map((item) => (
            Number(item.companyId) === Number(companyId)
                ? { ...item, isDefault: false }
                : item
        ));
    }

    const method = {
        id: nextId(store.companyPaymentMethods),
        companyId: Number(companyId),
        methodType: String(payload.methodType || 'Card').trim() || 'Card',
        provider: String(payload.provider || '').trim(),
        last4: String(payload.last4 || '').trim(),
        cardHolder: String(payload.cardHolder || '').trim(),
        expiryMonth: toNumber(payload.expiryMonth, 0),
        expiryYear: toNumber(payload.expiryYear, 0),
        billingEmail: String(payload.billingEmail || '').trim(),
        isDefault,
        createdAt: new Date().toISOString(),
    };

    store.companyPaymentMethods.push(method);
    writeStore(store);
    return method;
}

function removePaymentMethod(companyId, methodId) {
    const store = readStore();
    ensureSubscriptionNotificationData(store);
    const before = store.companyPaymentMethods.length;

    store.companyPaymentMethods = store.companyPaymentMethods.filter((item) => !(
        Number(item.companyId) === Number(companyId)
        && Number(item.id) === Number(methodId)
    ));

    if (store.companyPaymentMethods.length === before) {
        return false;
    }

    writeStore(store);
    return true;
}

function getNotificationCenter(companyId) {
    const store = readStore();
    ensureAtsData(store);
    ensureRecruiterCommunicationData(store);
    ensureInterviewEvaluationData(store);
    ensureSubscriptionNotificationData(store);

    const settings = findOrCreateNotificationSettings(store, companyId);
    const readSet = new Set((settings.readNotificationIds || []).map((item) => String(item)));

    const alerts = [];
    if (settings.alerts.newApplicants) {
        const applicantAlerts = store.jobApplicants
            .filter((item) => Number(item.companyId) === Number(companyId))
            .sort((left, right) => new Date(right.appliedAt).getTime() - new Date(left.appliedAt).getTime())
            .slice(0, 10)
            .map((item) => ({
                id: `applicant-${item.id}`,
                type: 'new-applicant',
                title: `New applicant for ${item.jobTitle}`,
                message: `${item.candidateName} applied`,
                createdAt: item.appliedAt,
            }));
        alerts.push(...applicantAlerts);
    }

    if (settings.alerts.messages) {
        const messageAlerts = store.recruiterMessages
            .filter((item) => Number(item.companyId) === Number(companyId) && normalizeString(item.direction) === 'inbound')
            .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
            .slice(0, 10)
            .map((item) => ({
                id: `message-${item.id}`,
                type: 'message',
                title: 'New candidate message',
                message: item.subject || item.body || 'New message',
                createdAt: item.createdAt,
            }));
        alerts.push(...messageAlerts);
    }

    if (settings.alerts.interviewConfirmations) {
        const interviewAlerts = store.interviewSchedules
            .filter((item) => Number(item.companyId) === Number(companyId) && normalizeString(item.status) === 'confirmed')
            .sort((left, right) => new Date(right.updatedAt || right.createdAt).getTime() - new Date(left.updatedAt || left.createdAt).getTime())
            .slice(0, 10)
            .map((item) => ({
                id: `interview-${item.id}`,
                type: 'interview-confirmation',
                title: 'Interview confirmed',
                message: `${item.candidateName} confirmed ${item.selectedSlot || 'a slot'}`,
                createdAt: item.updatedAt || item.createdAt,
            }));
        alerts.push(...interviewAlerts);
    }

    const customAlerts = store.recruiterNotifications
        .filter((item) => Number(item.companyId) === Number(companyId))
        .map((item) => ({
            id: `custom-${item.id}`,
            type: item.type || 'notification',
            title: item.title || 'Notification',
            message: item.message || '',
            createdAt: item.createdAt,
        }));
    alerts.push(...customAlerts);

    const notifications = alerts
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
        .map((item) => ({
            ...item,
            read: readSet.has(String(item.id)),
        }));

    writeStore(store);
    return {
        companyId: Number(companyId),
        settings,
        notifications,
    };
}

function updateNotificationSettings(companyId, payload = {}) {
    const store = readStore();
    ensureSubscriptionNotificationData(store);

    const settings = findOrCreateNotificationSettings(store, companyId);
    settings.alerts = {
        ...settings.alerts,
        ...(payload.alerts || {}),
    };
    settings.updatedAt = new Date().toISOString();

    writeStore(store);
    return settings;
}

function updateNotificationChannels(companyId, payload = {}) {
    const store = readStore();
    ensureSubscriptionNotificationData(store);

    const settings = findOrCreateNotificationSettings(store, companyId);
    if (typeof payload.emailEnabled === 'boolean') {
        settings.emailEnabled = payload.emailEnabled;
    }

    if (typeof payload.pushEnabled === 'boolean') {
        settings.pushEnabled = payload.pushEnabled;
    }

    settings.updatedAt = new Date().toISOString();
    writeStore(store);
    return settings;
}

function markNotificationAsRead(companyId, notificationId) {
    const store = readStore();
    ensureSubscriptionNotificationData(store);

    const settings = findOrCreateNotificationSettings(store, companyId);
    const id = String(notificationId || '').trim();
    if (!id) {
        return settings;
    }

    if (!settings.readNotificationIds.includes(id)) {
        settings.readNotificationIds.push(id);
    }

    settings.updatedAt = new Date().toISOString();
    writeStore(store);
    return settings;
}

function sanitizeRecruiter(recruiter) {
    if (!recruiter) {
        return null;
    }

    const { password, ...safe } = recruiter;
    return safe;
}

function findRecruiterByEmail(store, email) {
    const normalized = String(email || '').trim().toLowerCase();
    return store.recruiters.find((recruiter) => recruiter.email.toLowerCase() === normalized);
}

function getWorkspace(recruiterId) {
    const store = readStore();
    const recruiter = store.recruiters.find((item) => Number(item.id) === Number(recruiterId));
    if (!recruiter) {
        return null;
    }

    const companies = store.companies.filter((company) => recruiter.companyIds.includes(company.id));
    const activeCompany = companies.find((company) => Number(company.id) === Number(recruiter.activeCompanyId)) || companies[0] || null;
    const teamMembers = activeCompany ? store.teamMembers.filter((member) => Number(member.companyId) === Number(activeCompany.id)) : [];
    const invitations = activeCompany ? store.invitations.filter((invitation) => Number(invitation.companyId) === Number(activeCompany.id)) : [];

    return {
        recruiter: sanitizeRecruiter(recruiter),
        companies,
        activeCompany,
        teamMembers,
        invitations,
    };
}

function loginRecruiter(payload) {
    const store = readStore();
    const recruiter = findRecruiterByEmail(store, payload.email || payload.username);

    if (!recruiter || String(recruiter.password) !== String(payload.password || '')) {
        return null;
    }

    return sanitizeRecruiter(recruiter);
}

function registerRecruiter(payload) {
    const store = readStore();
    const existing = findRecruiterByEmail(store, payload.email);
    if (existing) {
        return { error: 'Email is already registered for a recruiter account.' };
    }

    const recruiterId = nextId(store.recruiters);
    const companyId = nextId(store.companies);

    const company = {
        id: companyId,
        name: payload.companyName || `Company ${companyId}`,
        description: payload.companyDescription || '',
        culture: '',
        benefits: '',
        visibility: 'Public',
        logoUrl: '',
        bannerUrl: '',
        media: [],
        locations: [],
        reviews: [],
    };

    const recruiter = {
        id: recruiterId,
        fullName: payload.fullName || 'Recruiter',
        email: String(payload.email || '').trim().toLowerCase(),
        password: payload.password || 'Recruiter@2026',
        role: payload.role || 'Recruiter',
        contactPhone: payload.contactPhone || '',
        companyIds: [companyId],
        activeCompanyId: companyId,
    };

    store.companies.push(company);
    store.recruiters.push(recruiter);
    writeStore(store);

    return {
        recruiter: sanitizeRecruiter(recruiter),
        company,
    };
}

function createCompanyAccount(recruiterId, payload) {
    const store = readStore();
    const recruiter = store.recruiters.find((item) => Number(item.id) === Number(recruiterId));
    if (!recruiter) {
        return null;
    }

    const companyId = nextId(store.companies);
    const company = {
        id: companyId,
        name: payload.name || `Company ${companyId}`,
        description: payload.description || '',
        culture: payload.culture || '',
        benefits: payload.benefits || '',
        visibility: payload.visibility || 'Public',
        logoUrl: payload.logoUrl || '',
        bannerUrl: payload.bannerUrl || '',
        media: [],
        locations: toList(payload.locations),
        reviews: [],
    };

    recruiter.companyIds = Array.from(new Set([...(recruiter.companyIds || []), companyId]));
    recruiter.activeCompanyId = companyId;
    store.companies.push(company);
    writeStore(store);

    return { recruiter: sanitizeRecruiter(recruiter), company };
}

function joinCompanyAccount(recruiterId, payload) {
    const store = readStore();
    const recruiter = store.recruiters.find((item) => Number(item.id) === Number(recruiterId));
    if (!recruiter) {
        return null;
    }

    const targetName = String(payload.companyName || '').trim().toLowerCase();
    const company = store.companies.find((item) => item.name.toLowerCase() === targetName || Number(item.id) === Number(payload.companyId));
    if (!company) {
        return { error: 'Company not found.' };
    }

    recruiter.companyIds = Array.from(new Set([...(recruiter.companyIds || []), company.id]));
    recruiter.activeCompanyId = company.id;
    writeStore(store);

    return { recruiter: sanitizeRecruiter(recruiter), company };
}

function inviteTeamMember(companyId, payload) {
    const store = readStore();
    const company = store.companies.find((item) => Number(item.id) === Number(companyId));
    if (!company) {
        return null;
    }

    const invitation = {
        id: nextId(store.invitations),
        companyId: company.id,
        name: payload.name || 'Team Member',
        email: String(payload.email || '').trim().toLowerCase(),
        role: payload.role || 'HR',
        permissions: toList(payload.permissions),
        status: 'Pending',
    };

    store.invitations.push(invitation);
    writeStore(store);
    return invitation;
}

function assignRolePermission(companyId, teamMemberId, payload) {
    const store = readStore();
    let updated = null;

    store.teamMembers = store.teamMembers.map((member) => {
        if (Number(member.id) !== Number(teamMemberId) || Number(member.companyId) !== Number(companyId)) {
            return member;
        }

        updated = {
            ...member,
            role: payload.role || member.role,
            permissions: payload.permissions ? toList(payload.permissions) : member.permissions,
        };

        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function switchCompany(recruiterId, companyId) {
    const store = readStore();
    const recruiter = store.recruiters.find((item) => Number(item.id) === Number(recruiterId));
    if (!recruiter) {
        return null;
    }

    if (!(recruiter.companyIds || []).includes(Number(companyId))) {
        return { error: 'Recruiter does not manage this company.' };
    }

    recruiter.activeCompanyId = Number(companyId);
    writeStore(store);
    return sanitizeRecruiter(recruiter);
}

function updateRecruiterProfile(recruiterId, payload) {
    const store = readStore();
    let updated = null;

    store.recruiters = store.recruiters.map((recruiter) => {
        if (Number(recruiter.id) !== Number(recruiterId)) {
            return recruiter;
        }

        updated = {
            ...recruiter,
            fullName: payload.fullName || recruiter.fullName,
            role: payload.role || recruiter.role,
            contactPhone: payload.contactPhone || recruiter.contactPhone,
        };

        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return sanitizeRecruiter(updated);
}

function updateCompanyProfile(companyId, payload) {
    const store = readStore();
    let updated = null;

    store.companies = store.companies.map((company) => {
        if (Number(company.id) !== Number(companyId)) {
            return company;
        }

        updated = {
            ...company,
            name: payload.name || company.name,
            description: payload.description !== undefined ? payload.description : company.description,
            culture: payload.culture !== undefined ? payload.culture : company.culture,
            benefits: payload.benefits !== undefined ? payload.benefits : company.benefits,
            logoUrl: payload.logoUrl !== undefined ? payload.logoUrl : company.logoUrl,
            bannerUrl: payload.bannerUrl !== undefined ? payload.bannerUrl : company.bannerUrl,
        };

        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function uploadCompanyMedia(companyId, payload) {
    const store = readStore();
    let updated = null;

    store.companies = store.companies.map((company) => {
        if (Number(company.id) !== Number(companyId)) {
            return company;
        }

        const mediaUrl = String(payload.url || '').trim();
        const nextMedia = mediaUrl ? [...(company.media || []), mediaUrl] : (company.media || []);

        updated = {
            ...company,
            logoUrl: payload.logoUrl !== undefined ? payload.logoUrl : company.logoUrl,
            bannerUrl: payload.bannerUrl !== undefined ? payload.bannerUrl : company.bannerUrl,
            media: nextMedia,
        };

        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function addOfficeLocation(companyId, payload) {
    const store = readStore();
    let updated = null;

    store.companies = store.companies.map((company) => {
        if (Number(company.id) !== Number(companyId)) {
            return company;
        }

        const location = String(payload.location || '').trim();
        const nextLocations = location ? Array.from(new Set([...(company.locations || []), location])) : (company.locations || []);

        updated = {
            ...company,
            locations: nextLocations,
        };

        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function setCompanyVisibility(companyId, payload) {
    const store = readStore();
    let updated = null;

    store.companies = store.companies.map((company) => {
        if (Number(company.id) !== Number(companyId)) {
            return company;
        }

        updated = {
            ...company,
            visibility: payload.visibility || company.visibility,
        };

        return updated;
    });

    if (!updated) {
        return null;
    }

    writeStore(store);
    return updated;
}

function respondToReview(companyId, reviewId, payload) {
    const store = readStore();
    let updatedCompany = null;

    store.companies = store.companies.map((company) => {
        if (Number(company.id) !== Number(companyId)) {
            return company;
        }

        const nextReviews = (company.reviews || []).map((review) => (
            Number(review.id) === Number(reviewId)
                ? { ...review, response: payload.response || review.response }
                : review
        ));

        updatedCompany = {
            ...company,
            reviews: nextReviews,
        };

        return updatedCompany;
    });

    if (!updatedCompany) {
        return null;
    }

    writeStore(store);
    return updatedCompany;
}

// ──────────────────────────────────────────────────────────────────────────────
// 15. Settings & Control Actions
// ──────────────────────────────────────────────────────────────────────────────

function ensurePipelineSettings(store, companyId) {
    if (!store.pipelineSettings) store.pipelineSettings = {};
    if (!store.pipelineSettings[companyId]) {
        store.pipelineSettings[companyId] = {
            stages: ['Applied', 'Screening', 'Interview', 'Assessment', 'Offer', 'Hired', 'Rejected'],
        };
    }
    return store.pipelineSettings[companyId];
}

function getPipelineSettings(companyId) {
    const store = readStore();
    return ensurePipelineSettings(store, companyId);
}

function configurePipelineStages(companyId, payload) {
    const store = readStore();
    const config = ensurePipelineSettings(store, companyId);
    config.stages = payload.stages || config.stages;
    config.updatedAt = new Date().toISOString();
    writeStore(store);
    return config;
}

function ensureApplicationFormConfig(store, companyId) {
    if (!store.applicationFormConfig) store.applicationFormConfig = {};
    if (!store.applicationFormConfig[companyId]) {
        store.applicationFormConfig[companyId] = {
            fields: [
                { name: 'fullName', label: 'Full Name', type: 'text', required: true },
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'resume', label: 'Resume/CV', type: 'file', required: true },
                { name: 'coverLetter', label: 'Cover Letter', type: 'textarea', required: false },
            ],
        };
    }
    return store.applicationFormConfig[companyId];
}

function getApplicationFormConfig(companyId) {
    const store = readStore();
    return ensureApplicationFormConfig(store, companyId);
}

function saveApplicationFormConfig(companyId, payload) {
    const store = readStore();
    const config = ensureApplicationFormConfig(store, companyId);
    if (payload.fields) config.fields = payload.fields;
    config.updatedAt = new Date().toISOString();
    writeStore(store);
    return config;
}

function getTeamPermissions(companyId) {
    const store = readStore();
    const company = (store.companies || []).find(c => String(c.id) === String(companyId));
    if (!company) return null;
    const members = company.teamMembers || [];
    return members.map(m => ({
        memberId: m.id,
        name: m.name || m.email,
        role: m.role || 'viewer',
        permissions: m.permissions || { canPostJobs: false, canViewApplications: true, canSendMessages: false, canManageTeam: false },
    }));
}

function updateTeamPermissions(companyId, memberId, payload) {
    const store = readStore();
    let updated = null;
    store.companies = (store.companies || []).map(c => {
        if (String(c.id) !== String(companyId)) return c;
        const members = (c.teamMembers || []).map(m => {
            if (String(m.id) !== String(memberId)) return m;
            updated = { ...m, permissions: { ...(m.permissions || {}), ...payload.permissions }, role: payload.role || m.role };
            return updated;
        });
        return { ...c, teamMembers: members };
    });
    if (!updated) return null;
    writeStore(store);
    return updated;
}

function ensureEmailTemplates(store, companyId) {
    if (!store.defaultEmailTemplates) store.defaultEmailTemplates = {};
    if (!store.defaultEmailTemplates[companyId]) {
        store.defaultEmailTemplates[companyId] = [
            { id: 'rejection', name: 'Rejection', subject: 'Application Update', body: 'Thank you for your interest. After careful review, we will not be moving forward.' },
            { id: 'offer', name: 'Offer', subject: 'Job Offer from {{company}}', body: 'Congratulations! We are pleased to extend an offer for the {{position}} role.' },
            { id: 'followup', name: 'Follow-up', subject: 'Following up on your application', body: 'We wanted to follow up regarding your application for {{position}}.' },
        ];
    }
    return store.defaultEmailTemplates[companyId];
}

function getDefaultEmailTemplates(companyId) {
    const store = readStore();
    return ensureEmailTemplates(store, companyId);
}

function saveDefaultEmailTemplate(companyId, payload) {
    const store = readStore();
    const templates = ensureEmailTemplates(store, companyId);
    const idx = templates.findIndex(t => t.id === payload.id);
    if (idx !== -1) {
        templates[idx] = { ...templates[idx], ...payload, updatedAt: new Date().toISOString() };
    } else {
        templates.push({ ...payload, id: payload.id || `tpl_${Date.now()}`, createdAt: new Date().toISOString() });
    }
    writeStore(store);
    return store.defaultEmailTemplates[companyId];
}

function ensureIntegrations(store, companyId) {
    if (!store.integrations) store.integrations = {};
    if (!store.integrations[companyId]) store.integrations[companyId] = [];
    return store.integrations[companyId];
}

function getIntegrations(companyId) {
    const store = readStore();
    return ensureIntegrations(store, companyId);
}

function saveIntegration(companyId, payload) {
    const store = readStore();
    const integrations = ensureIntegrations(store, companyId);
    const idx = integrations.findIndex(i => i.id === payload.id);
    if (idx !== -1) {
        integrations[idx] = { ...integrations[idx], ...payload, updatedAt: new Date().toISOString() };
    } else {
        integrations.push({ ...payload, id: payload.id || `int_${Date.now()}`, createdAt: new Date().toISOString(), active: true });
    }
    writeStore(store);
    return store.integrations[companyId];
}

function removeIntegration(companyId, integrationId) {
    const store = readStore();
    const integrations = ensureIntegrations(store, companyId);
    const before = integrations.length;
    store.integrations[companyId] = integrations.filter(i => String(i.id) !== String(integrationId));
    if (store.integrations[companyId].length === before) return null;
    writeStore(store);
    return { removed: integrationId };
}

// ──────────────────────────────────────────────────────────────────────────────
// 16. Automation Actions
// ──────────────────────────────────────────────────────────────────────────────

function ensureAutomationRules(store, companyId) {
    if (!store.automationRules) store.automationRules = {};
    if (!store.automationRules[companyId]) store.automationRules[companyId] = [];
    return store.automationRules[companyId];
}

function getAutomationRules(companyId) {
    const store = readStore();
    return ensureAutomationRules(store, companyId);
}

function createAutoMoveRule(companyId, payload) {
    const store = readStore();
    const rules = ensureAutomationRules(store, companyId);
    const rule = {
        id: `rule_${Date.now()}`,
        type: 'auto-move',
        criteria: payload.criteria || {},
        targetStage: payload.targetStage || 'Interview',
        enabled: true,
        createdAt: new Date().toISOString(),
    };
    rules.push(rule);
    writeStore(store);
    return rule;
}

function createAutoRejectRule(companyId, payload) {
    const store = readStore();
    const rules = ensureAutomationRules(store, companyId);
    const rule = {
        id: `rule_${Date.now()}`,
        type: 'auto-reject',
        screeningConditions: payload.screeningConditions || [],
        rejectMessage: payload.rejectMessage || 'Thank you for applying. You do not meet the minimum requirements.',
        enabled: true,
        createdAt: new Date().toISOString(),
    };
    rules.push(rule);
    writeStore(store);
    return rule;
}

function scheduleFollowUpEmail(companyId, payload) {
    const store = readStore();
    if (!store.scheduledEmails) store.scheduledEmails = {};
    if (!store.scheduledEmails[companyId]) store.scheduledEmails[companyId] = [];
    const email = {
        id: `email_${Date.now()}`,
        type: 'follow-up',
        targetCandidateId: payload.candidateId,
        jobId: payload.jobId,
        sendAt: payload.sendAt || new Date(Date.now() + 86400000).toISOString(),
        subject: payload.subject || 'Following up on your application',
        body: payload.body || '',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
    };
    store.scheduledEmails[companyId].push(email);
    writeStore(store);
    return email;
}

function triggerReminderForInactive(companyId, payload) {
    const store = readStore();
    if (!store.reminders) store.reminders = {};
    if (!store.reminders[companyId]) store.reminders[companyId] = [];
    const reminder = {
        id: `rem_${Date.now()}`,
        inactiveDaysThreshold: payload.inactiveDaysThreshold || 7,
        stage: payload.stage || null,
        message: payload.message || 'Reminder: candidates have been inactive for some time.',
        targetCandidateIds: payload.candidateIds || [],
        triggeredAt: new Date().toISOString(),
        status: 'triggered',
    };
    store.reminders[companyId].push(reminder);
    writeStore(store);
    return reminder;
}

function ensureHiringWorkflows(store, companyId) {
    if (!store.hiringWorkflows) store.hiringWorkflows = {};
    if (!store.hiringWorkflows[companyId]) store.hiringWorkflows[companyId] = [];
    return store.hiringWorkflows[companyId];
}

function getHiringWorkflows(companyId) {
    const store = readStore();
    return ensureHiringWorkflows(store, companyId);
}

function createHiringWorkflow(companyId, payload) {
    const store = readStore();
    const workflows = ensureHiringWorkflows(store, companyId);
    const workflow = {
        id: `wf_${Date.now()}`,
        name: payload.name || 'Unnamed Workflow',
        description: payload.description || '',
        steps: payload.steps || [],
        triggers: payload.triggers || [],
        enabled: true,
        createdAt: new Date().toISOString(),
    };
    workflows.push(workflow);
    writeStore(store);
    return workflow;
}

function deleteAutomationRule(companyId, ruleId) {
    const store = readStore();
    const rules = ensureAutomationRules(store, companyId);
    const before = rules.length;
    store.automationRules[companyId] = rules.filter(r => String(r.id) !== String(ruleId));
    if (store.automationRules[companyId].length === before) return null;
    writeStore(store);
    return { deleted: ruleId };
}

// ── NEW: Remove Team Member ───────────────────────────────────────────────────
function removeTeamMember(companyId, memberId) {
    const store = readStore();
    const before = (store.teamMembers || []).length;
    store.teamMembers = (store.teamMembers || []).filter(
        (m) => !(Number(m.companyId) === Number(companyId) && Number(m.id) === Number(memberId))
    );
    if (store.teamMembers.length === before) return null;
    writeStore(store);
    return { removed: memberId };
}

// ── NEW: Company Job Management ───────────────────────────────────────────────
function ensureCompanyJobs(store) {
    if (!Array.isArray(store.companyJobs)) store.companyJobs = [];
}

function listCompanyJobs(companyId) {
    const store = readStore();
    ensureCompanyJobs(store);
    return store.companyJobs.filter((j) => Number(j.companyId) === Number(companyId));
}

function createCompanyJob(companyId, payload) {
    const store = readStore();
    ensureCompanyJobs(store);
    const job = {
        id: nextId(store.companyJobs),
        companyId: Number(companyId),
        title: String(payload.title || '').trim(),
        description: String(payload.description || '').trim(),
        requirements: String(payload.requirements || '').trim(),
        salary: String(payload.salary || '').trim(),
        location: String(payload.location || '').trim(),
        employmentType: String(payload.employmentType || 'Full-time').trim(),
        skills: toList(payload.skills),
        benefits: String(payload.benefits || '').trim(),
        applicationDeadline: String(payload.applicationDeadline || '').trim(),
        status: 'Draft',
        createdAt: new Date().toISOString(),
    };
    store.companyJobs.push(job);
    writeStore(store);
    return job;
}

function updateCompanyJob(companyId, jobId, payload) {
    const store = readStore();
    ensureCompanyJobs(store);
    let updated = null;
    store.companyJobs = store.companyJobs.map((j) => {
        if (Number(j.id) !== Number(jobId) || Number(j.companyId) !== Number(companyId)) return j;
        updated = {
            ...j,
            title: payload.title !== undefined ? String(payload.title).trim() : j.title,
            description: payload.description !== undefined ? String(payload.description).trim() : j.description,
            requirements: payload.requirements !== undefined ? String(payload.requirements).trim() : j.requirements,
            salary: payload.salary !== undefined ? String(payload.salary).trim() : j.salary,
            location: payload.location !== undefined ? String(payload.location).trim() : j.location,
            employmentType: payload.employmentType !== undefined ? String(payload.employmentType).trim() : j.employmentType,
            skills: payload.skills !== undefined ? toList(payload.skills) : j.skills,
            benefits: payload.benefits !== undefined ? String(payload.benefits).trim() : j.benefits,
            applicationDeadline: payload.applicationDeadline !== undefined ? String(payload.applicationDeadline).trim() : j.applicationDeadline,
        };
        return updated;
    });
    if (!updated) return null;
    writeStore(store);
    return updated;
}

function publishCompanyJob(companyId, jobId) {
    return updateCompanyJob(companyId, jobId, { status: 'Published' }) ||
        (() => { const store = readStore(); ensureCompanyJobs(store); const j = store.companyJobs.find((x) => Number(x.id) === Number(jobId) && Number(x.companyId) === Number(companyId)); if (!j) return null; j.status = 'Published'; writeStore(store); return j; })();
}

function pauseCompanyJob(companyId, jobId) {
    const store = readStore();
    ensureCompanyJobs(store);
    const job = store.companyJobs.find((j) => Number(j.id) === Number(jobId) && Number(j.companyId) === Number(companyId));
    if (!job) return null;
    job.status = 'Paused';
    writeStore(store);
    return job;
}

function deleteCompanyJob(companyId, jobId) {
    const store = readStore();
    ensureCompanyJobs(store);
    const before = store.companyJobs.length;
    store.companyJobs = store.companyJobs.filter(
        (j) => !(Number(j.id) === Number(jobId) && Number(j.companyId) === Number(companyId))
    );
    if (store.companyJobs.length === before) return null;
    writeStore(store);
    return { deleted: jobId };
}

function duplicateCompanyJob(companyId, jobId) {
    const store = readStore();
    ensureCompanyJobs(store);
    const original = store.companyJobs.find((j) => Number(j.id) === Number(jobId) && Number(j.companyId) === Number(companyId));
    if (!original) return null;
    const copy = { ...original, id: nextId(store.companyJobs), title: `${original.title} (Copy)`, status: 'Draft', createdAt: new Date().toISOString() };
    store.companyJobs.push(copy);
    writeStore(store);
    return copy;
}

// ── NEW: Assign Recruiter to Applicant ───────────────────────────────────────
function assignRecruiterToApplicant(companyId, applicationId, assignedRecruiterId) {
    const store = readStore();
    if (!Array.isArray(store.jobApplicants)) return null;
    let updated = null;
    store.jobApplicants = store.jobApplicants.map((a) => {
        if (Number(a.id) !== Number(applicationId) || Number(a.companyId) !== Number(companyId)) return a;
        updated = { ...a, assignedRecruiterId: Number(assignedRecruiterId) };
        return updated;
    });
    if (!updated) return null;
    writeStore(store);
    return updated;
}

// ── NEW: Assessment Templates ─────────────────────────────────────────────────
function ensureAssessmentTemplates(store) {
    if (!Array.isArray(store.assessmentTemplates)) store.assessmentTemplates = [];
}

function listAssessmentTemplates(companyId) {
    const store = readStore();
    ensureAssessmentTemplates(store);
    return store.assessmentTemplates.filter((t) => Number(t.companyId) === Number(companyId));
}

function createAssessmentTemplate(companyId, payload) {
    const store = readStore();
    ensureAssessmentTemplates(store);
    const template = {
        id: nextId(store.assessmentTemplates),
        companyId: Number(companyId),
        title: String(payload.title || '').trim(),
        type: String(payload.type || 'Technical').trim(),
        description: String(payload.description || '').trim(),
        questions: Array.isArray(payload.questions) ? payload.questions : [],
        maxScore: toNumber(payload.maxScore, 100),
        durationMinutes: toNumber(payload.durationMinutes, 60),
        createdAt: new Date().toISOString(),
    };
    store.assessmentTemplates.push(template);
    writeStore(store);
    return template;
}

// ── NEW: Negotiate Offer ──────────────────────────────────────────────────────
function negotiateJobOffer(companyId, offerId, payload) {
    const store = readStore();
    if (!Array.isArray(store.companyOffers)) return null;
    let updated = null;
    store.companyOffers = store.companyOffers.map((o) => {
        if (Number(o.id) !== Number(offerId) || Number(o.companyId) !== Number(companyId)) return o;
        updated = {
            ...o,
            counterCompensation: String(payload.counterCompensation || '').trim(),
            counterNotes: String(payload.counterNotes || '').trim(),
            status: 'Negotiating',
            negotiatedAt: new Date().toISOString(),
        };
        return updated;
    });
    if (!updated) return null;
    writeStore(store);
    return updated;
}

module.exports = {
    getWorkspace,
    loginRecruiter,
    registerRecruiter,
    createCompanyAccount,
    joinCompanyAccount,
    inviteTeamMember,
    removeTeamMember,
    assignRolePermission,
    listCompanyJobs,
    createCompanyJob,
    updateCompanyJob,
    publishCompanyJob,
    pauseCompanyJob,
    deleteCompanyJob,
    duplicateCompanyJob,
    assignRecruiterToApplicant,
    listAssessmentTemplates,
    createAssessmentTemplate,
    negotiateJobOffer,
    switchCompany,
    updateRecruiterProfile,
    updateCompanyProfile,
    uploadCompanyMedia,
    addOfficeLocation,
    setCompanyVisibility,
    respondToReview,
    listApplicantsByJob,
    getApplicantProfile,
    downloadApplicantResume,
    addApplicantNote,
    tagApplicant,
    moveApplicantStage,
    bulkMoveApplicants,
    rejectApplicant,
    reopenRejectedApplicant,
    listCandidateDatabase,
    getCandidateProfile,
    saveCandidateToShortlist,
    addCandidateToTalentPool,
    removeCandidateFromTalentPool,
    createTalentPool,
    tagCandidateInCRM,
    getCandidateHistory,
    reengagePastCandidate,
    generateAIJobDescription,
    recommendCandidatesForJob,
    getCandidateMatchScore,
    autoRankApplicants,
    generateInterviewQuestionsAI,
    generateOutreachMessageAI,
    predictCandidateSuccess,
    contactPassiveCandidate,
    getPipelineSettings,
    configurePipelineStages,
    getApplicationFormConfig,
    saveApplicationFormConfig,
    getTeamPermissions,
    updateTeamPermissions,
    getDefaultEmailTemplates,
    saveDefaultEmailTemplate,
    getIntegrations,
    saveIntegration,
    removeIntegration,
    getAutomationRules,
    createAutoMoveRule,
    createAutoRejectRule,
    scheduleFollowUpEmail,
    triggerReminderForInactive,
    getHiringWorkflows,
    createHiringWorkflow,
    deleteAutomationRule,
    listCandidateMessages,
    sendCandidateMessage,
    replyToCandidateMessage,
    listMessageTemplates,
    saveMessageTemplate,
    sendBulkMessages,
    sendInterviewInvitation,
    sendRejectionEmail,
    sendFollowUpEmail,
    createAutomatedSequence,
    listAutomatedSequences,
    assignSequenceToCandidate,
    inviteCandidateToInterview,
    listInterviews,
    syncInterviewCalendar,
    rescheduleInterview,
    cancelInterview,
    addInterviewNotes,
    addInterviewFeedback,
    shareInterviewFeedback,
    reviewScreeningAnswers,
    rateCandidate,
    leaveStructuredFeedback,
    compareCandidates,
    assignAssessment,
    reviewAssessmentResult,
    listAssessmentResults,
    markCandidateSelected,
    createJobOffer,
    attachOfferLetter,
    updateOfferStatus,
    listJobOffers,
    markCandidateHired,
    closeJobPosting,
    getJobPerformanceReport,
    getHiringMetricsReport,
    saveHiringManagerFeedback,
    getTeamPerformanceReport,
    getSubscriptionOverview,
    changeSubscriptionPlan,
    purchaseJobCredits,
    payForFeaturedListing,
    listBillingInvoices,
    downloadInvoice,
    listPaymentMethods,
    savePaymentMethod,
    removePaymentMethod,
    getNotificationCenter,
    updateNotificationSettings,
    updateNotificationChannels,
    markNotificationAsRead,
};
