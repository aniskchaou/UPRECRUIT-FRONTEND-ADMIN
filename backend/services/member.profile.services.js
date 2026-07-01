const MemberProfile = require("../models/member.profile.models");

const parseJsonArray = (value) => {
    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value;
    }

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
};

const normalizePayload = (payload) => ({
    emailVerified: payload.emailVerified,
    phoneVerified: payload.phoneVerified,
    onboardingCompleted: payload.onboardingCompleted,
    wizardStep: payload.wizardStep,
    preferredRoles: payload.preferredRoles,
    preferredLocation: payload.preferredLocation,
    preferredSalary: payload.preferredSalary,
    preferredJobTypes: payload.preferredJobTypes,
    workExperiences: payload.workExperiences,
    educations: payload.educations,
    profileSkills: payload.profileSkills,
    certifications: payload.certifications,
    profileLanguages: payload.profileLanguages,
    portfolioLinks: payload.portfolioLinks,
    profilePictureUrl: payload.profilePictureUrl,
    videoIntroUrl: payload.videoIntroUrl,
    profileVisibility: payload.profileVisibility,
    resumeVersions: payload.resumeVersions,
    resumeBuilderContent: payload.resumeBuilderContent,
});

const serializeRecord = (profile) => ({
    id: profile.id,
    userId: profile.userId,
    emailVerified: profile.emailVerified === 'true',
    phoneVerified: profile.phoneVerified === 'true',
    onboardingCompleted: profile.onboardingCompleted === 'true',
    wizardStep: Number(profile.wizardStep || 1),
    preferredRoles: parseJsonArray(profile.preferredRoles),
    preferredLocation: profile.preferredLocation || '',
    preferredSalary: profile.preferredSalary || '',
    preferredJobTypes: parseJsonArray(profile.preferredJobTypes),
    workExperiences: parseJsonArray(profile.workExperiences),
    educations: parseJsonArray(profile.educations),
    profileSkills: parseJsonArray(profile.profileSkills),
    certifications: parseJsonArray(profile.certifications),
    profileLanguages: parseJsonArray(profile.profileLanguages),
    portfolioLinks: parseJsonArray(profile.portfolioLinks),
    profilePictureUrl: profile.profilePictureUrl || '',
    videoIntroUrl: profile.videoIntroUrl || '',
    profileVisibility: profile.profileVisibility || 'public',
    resumeVersions: parseJsonArray(profile.resumeVersions),
    resumeBuilderContent: profile.resumeBuilderContent || '',
});

const ensureUserProfile = async (userId) => {
    let profile = await MemberProfile.findOne({ where: { userId: userId } });
    if (!profile) {
        profile = await MemberProfile.create({
            userId: userId,
            emailVerified: 'false',
            phoneVerified: 'false',
            onboardingCompleted: 'false',
            wizardStep: '1',
            preferredRoles: '[]',
            preferredLocation: '',
            preferredSalary: '',
            preferredJobTypes: '[]',
            workExperiences: '[]',
            educations: '[]',
            profileSkills: '[]',
            certifications: '[]',
            profileLanguages: '[]',
            portfolioLinks: '[]',
            profilePictureUrl: '',
            videoIntroUrl: '',
            profileVisibility: 'public',
            resumeVersions: '[]',
            resumeBuilderContent: '',
        });
    }

    return profile;
};

exports.findByUser = async (userId, res) => {
    try {
        const profile = await ensureUserProfile(userId);
        res.send(serializeRecord(profile));
    } catch (err) {
        res.status(500).send({ message: err.message || "Error retrieving member profile." });
    }
};

exports.upsertByUser = async (userId, payload, res) => {
    try {
        const profile = await ensureUserProfile(userId);
        await profile.update(normalizePayload(payload));
        res.send(serializeRecord(profile));
    } catch (err) {
        res.status(500).send({ message: err.message || "Error saving member profile." });
    }
};

exports.addResumeVersion = async (userId, payload, res) => {
    try {
        const profile = await ensureUserProfile(userId);
        const resumes = parseJsonArray(profile.resumeVersions);

        const nextResume = {
            id: `resume-${Date.now()}`,
            name: payload.name || `Resume ${resumes.length + 1}`,
            summary: payload.summary || '',
            updatedAt: new Date().toISOString().slice(0, 10),
        };

        const nextResumes = [nextResume, ...resumes];
        await profile.update({ resumeVersions: JSON.stringify(nextResumes) });

        res.send({ resume: nextResume, resumeVersions: nextResumes });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error adding resume version." });
    }
};

exports.updateResumeVersion = async (userId, resumeId, payload, res) => {
    try {
        const profile = await ensureUserProfile(userId);
        const resumes = parseJsonArray(profile.resumeVersions);
        const nextResumes = resumes.map((resume) => (
            String(resume.id) === String(resumeId)
                ? { ...resume, ...payload, id: resume.id, updatedAt: new Date().toISOString().slice(0, 10) }
                : resume
        ));

        await profile.update({ resumeVersions: JSON.stringify(nextResumes) });
        res.send({ resumeVersions: nextResumes });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error updating resume version." });
    }
};

exports.deleteResumeVersion = async (userId, resumeId, res) => {
    try {
        const profile = await ensureUserProfile(userId);
        const resumes = parseJsonArray(profile.resumeVersions);
        const nextResumes = resumes.filter((resume) => String(resume.id) !== String(resumeId));

        await profile.update({ resumeVersions: JSON.stringify(nextResumes) });
        res.send({ resumeVersions: nextResumes });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error deleting resume version." });
    }
};
