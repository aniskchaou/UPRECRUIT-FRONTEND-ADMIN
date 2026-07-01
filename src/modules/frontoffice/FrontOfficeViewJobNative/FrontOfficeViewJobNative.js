import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import jobHTTPService from '../../../main/services/jobHTTPService';
import FrontOfficeLayout from '../shared/FrontOfficeLayout';
import useSeo from '../shared/useSeo';
import {
  FALLBACK_JOBS,
  daysAgoLabel,
  getSalaryLabel,
  hasDisclosedSalary,
  getSimilarJobs,
  mapApiJob,
} from '../shared/frontOfficeData';

const FrontOfficeViewJobNative = () => {
  const { id } = useParams();
  const [jobs, setJobs] = useState(FALLBACK_JOBS);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  useEffect(() => {
    let mounted = true;
    jobHTTPService
      .getAllJob()
      .then((response) => {
        if (!mounted || !Array.isArray(response.data) || !response.data.length) {
          return;
        }
        setJobs(response.data.map((job, index) => mapApiJob(job, index)));
      })
      .catch(() => {
        // Fallback data remains available.
      });

    return () => {
      mounted = false;
    };
  }, []);

  const selectedJob = useMemo(
    () => jobs.find((job) => String(job.id) === String(id)),
    [jobs, id]
  );

  const similarJobs = useMemo(() => getSimilarJobs(jobs, selectedJob, 3), [jobs, selectedJob]);

  const jobJsonLd = useMemo(() => {
    if (!selectedJob) {
      return null;
    }

    const payload = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: selectedJob.title,
      description: selectedJob.description,
      datePosted: selectedJob.postedAt,
      employmentType: selectedJob.jobType,
      hiringOrganization: {
        '@type': 'Organization',
        name: selectedJob.companyName,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: selectedJob.location,
        },
      },
    };

    if (hasDisclosedSalary(selectedJob)) {
      payload.baseSalary = {
        '@type': 'MonetaryAmount',
        currency: 'TND',
        value: {
          '@type': 'QuantitativeValue',
          minValue: selectedJob.salaryMin,
          maxValue: selectedJob.salaryMax,
          unitText: 'MONTH',
        },
      };
    }

    return payload;
  }, [selectedJob]);

  useSeo(
    selectedJob ? `${selectedJob.title} - UPRECRUIT Job Details` : 'Job Details - UPRECRUIT',
    selectedJob
      ? `Read the full ${selectedJob.title} description, required skills, salary details, and similar jobs.`
      : 'View complete public job details and related opportunities.',
    {
      pathname: selectedJob ? `/frontoffice/viewjob/${selectedJob.id}` : '/frontoffice/viewjob',
      type: 'article',
      jsonLd: jobJsonLd,
    }
  );

  if (!selectedJob) {
    return (
      <FrontOfficeLayout>
        <div className="fo-vj-wrap">
          <div className="fo-vj-hero">
            <div className="fo-vj-hero__banner" />
            <div className="fo-vj-hero__body">
              <div className="fo-vj-hero__content">
                <h1 className="fo-vj-hero__title">Job Not Found</h1>
                <p className="fo-muted">This listing may have been removed or is no longer public.</p>
                <div className="fo-cta-row" style={{ marginTop: '14px' }}>
                  <Link to="/frontoffice/jobs" className="fo-btn">Browse All Jobs</Link>
                  <Link to="/frontoffice/home" className="fo-btn-outline">Back to Home</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FrontOfficeLayout>
    );
  }

  const companyInitial = selectedJob.companyName ? selectedJob.companyName.charAt(0).toUpperCase() : '?';

  const splitBullets = (text) => {
    if (!text) return [];
    if (Array.isArray(text)) return text;
    return text.split(/[.\n]+/).map((s) => s.trim()).filter(Boolean);
  };

  return (
    <FrontOfficeLayout>
      <div className="fo-vj-wrap">

        {/* Breadcrumb */}
        <nav className="fo-vj-breadcrumb" aria-label="Breadcrumb">
          <Link to="/frontoffice/home">Home</Link>
          <span className="fo-vj-breadcrumb__sep">›</span>
          <Link to="/frontoffice/jobs">Jobs</Link>
          <span className="fo-vj-breadcrumb__sep">›</span>
          <span className="fo-vj-breadcrumb__current">{selectedJob.title}</span>
        </nav>

        {/* Hero */}
        <div className="fo-vj-hero">
          <div className="fo-vj-hero__banner" />
          <div className="fo-vj-hero__body">
            <div className="fo-vj-hero__avatar">{companyInitial}</div>
            <div className="fo-vj-hero__content">
              <div className="fo-vj-hero__kicker">
                <i className="fa fa-briefcase" aria-hidden="true" />
                {selectedJob.companyName}
              </div>
              <h1 className="fo-vj-hero__title">{selectedJob.title}</h1>
            </div>
            <div className="fo-vj-hero__meta-col">
              <div className="fo-vj-hero__meta">
                {selectedJob.location ? (
                  <>
                    <span className="fo-vj-meta-item">
                      <i className="fa fa-map-marker" aria-hidden="true" />
                      {selectedJob.location}
                    </span>
                    <span className="fo-vj-meta-sep">·</span>
                  </>
                ) : null}
                {selectedJob.jobType ? (
                  <>
                    <span className="fo-vj-meta-item">
                      <i className="fa fa-clock-o" aria-hidden="true" />
                      {selectedJob.jobType}
                    </span>
                    <span className="fo-vj-meta-sep">·</span>
                  </>
                ) : null}
                {selectedJob.experienceLevel ? (
                  <>
                    <span className="fo-vj-meta-item">
                      <i className="fa fa-bar-chart" aria-hidden="true" />
                      {selectedJob.experienceLevel}
                    </span>
                    <span className="fo-vj-meta-sep">·</span>
                  </>
                ) : null}
                {hasDisclosedSalary(selectedJob) ? (
                  <>
                    <span className="fo-vj-meta-item">
                      <i className="fa fa-money" aria-hidden="true" />
                      {getSalaryLabel(selectedJob)}
                    </span>
                    <span className="fo-vj-meta-sep">·</span>
                  </>
                ) : null}
                <span className="fo-vj-meta-item">
                  <i className="fa fa-calendar-o" aria-hidden="true" />
                  {daysAgoLabel(selectedJob.postedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="fo-vj-body">

          {/* Main content */}
          <div className="fo-vj-main">

            {/* Description */}
            <div className="fo-vj-section">
              <div className="fo-vj-section__head">
                <span className="fo-vj-section__icon"><i className="fa fa-align-left" aria-hidden="true" /></span>
                <h3>Job Description</h3>
              </div>
              <div className="fo-vj-section__body">
                <p>{selectedJob.description}</p>
              </div>
            </div>

            {/* Responsibilities */}
            {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 ? (
              <div className="fo-vj-section">
                <div className="fo-vj-section__head">
                  <span className="fo-vj-section__icon"><i className="fa fa-check-square-o" aria-hidden="true" /></span>
                  <h3>Responsibilities</h3>
                </div>
                <div className="fo-vj-section__body">
                  <ul>
                    {splitBullets(selectedJob.responsibilities).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            {/* Minimum Qualifications */}
            {selectedJob.minimumQualifications ? (
              <div className="fo-vj-section">
                <div className="fo-vj-section__head">
                  <span className="fo-vj-section__icon"><i className="fa fa-graduation-cap" aria-hidden="true" /></span>
                  <h3>Minimum Qualifications</h3>
                </div>
                <div className="fo-vj-section__body">
                  <ul>
                    {splitBullets(selectedJob.minimumQualifications).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            {/* Preferred Qualifications */}
            {selectedJob.preferredQualifications ? (
              <div className="fo-vj-section">
                <div className="fo-vj-section__head">
                  <span className="fo-vj-section__icon"><i className="fa fa-star-o" aria-hidden="true" /></span>
                  <h3>Preferred Qualifications</h3>
                </div>
                <div className="fo-vj-section__body">
                  <ul>
                    {splitBullets(selectedJob.preferredQualifications).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            {/* Benefits */}
            {selectedJob.benefits ? (
              <div className="fo-vj-section">
                <div className="fo-vj-section__head">
                  <span className="fo-vj-section__icon"><i className="fa fa-gift" aria-hidden="true" /></span>
                  <h3>Benefits &amp; Perks</h3>
                </div>
                <div className="fo-vj-section__body">
                  <ul>
                    {String(selectedJob.benefits).split(/[,;\n]+/).map((b) => b.trim()).filter(Boolean).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            {/* Skills */}
            {selectedJob.skills && selectedJob.skills.length > 0 ? (
              <div className="fo-vj-section">
                <div className="fo-vj-section__head">
                  <span className="fo-vj-section__icon"><i className="fa fa-tags" aria-hidden="true" /></span>
                  <h3>Skills Required</h3>
                </div>
                <div className="fo-vj-skills">
                  {selectedJob.skills.map((skill) => (
                    <span key={skill} className="fo-vj-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ) : null}

          </div>

          {/* Sidebar */}
          <aside className="fo-vj-sidebar">

            {/* Apply card */}
            <div className="fo-vj-apply-card">
              <div className="fo-vj-apply-card__inner">
                {hasDisclosedSalary(selectedJob) ? (
                  <>
                    <div className="fo-vj-apply-card__label">Monthly Salary</div>
                    <p className="fo-vj-apply-card__salary">{getSalaryLabel(selectedJob)}</p>
                  </>
                ) : (
                  <div className="fo-vj-apply-card__label">Ready to apply?</div>
                )}
                <div className="fo-vj-apply-card__actions">
                  <Link
                    to={`/frontoffice/login?redirect=/frontoffice/newcandidature/${selectedJob.id}`}
                    className="fo-vj-btn-apply"
                  >
                    <i className="fa fa-paper-plane" aria-hidden="true" />
                    Apply Now
                  </Link>
                  <Link to="/frontoffice/register" className="fo-vj-btn-register">
                    <i className="fa fa-user-plus" aria-hidden="true" />
                    Create Account
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick facts */}
            <div className="fo-vj-facts-card">
              <div className="fo-vj-facts-card__head">Job Overview</div>
              <ul className="fo-vj-facts-list">
                {selectedJob.companyName ? (
                  <li>
                    <span className="fo-vj-facts-list__icon"><i className="fa fa-building" aria-hidden="true" /></span>
                    <div>
                      <div className="fo-vj-facts-list__label">Company</div>
                      <div className="fo-vj-facts-list__value">{selectedJob.companyName}</div>
                    </div>
                  </li>
                ) : null}
                {selectedJob.companyIndustry ? (
                  <li>
                    <span className="fo-vj-facts-list__icon"><i className="fa fa-industry" aria-hidden="true" /></span>
                    <div>
                      <div className="fo-vj-facts-list__label">Industry</div>
                      <div className="fo-vj-facts-list__value">{selectedJob.companyIndustry}</div>
                    </div>
                  </li>
                ) : null}
                {selectedJob.location ? (
                  <li>
                    <span className="fo-vj-facts-list__icon"><i className="fa fa-map-marker" aria-hidden="true" /></span>
                    <div>
                      <div className="fo-vj-facts-list__label">Location</div>
                      <div className="fo-vj-facts-list__value">{selectedJob.location}</div>
                    </div>
                  </li>
                ) : null}
                {selectedJob.jobType ? (
                  <li>
                    <span className="fo-vj-facts-list__icon"><i className="fa fa-clock-o" aria-hidden="true" /></span>
                    <div>
                      <div className="fo-vj-facts-list__label">Job Type</div>
                      <div className="fo-vj-facts-list__value">{selectedJob.jobType}</div>
                    </div>
                  </li>
                ) : null}
                {selectedJob.experienceLevel ? (
                  <li>
                    <span className="fo-vj-facts-list__icon"><i className="fa fa-bar-chart" aria-hidden="true" /></span>
                    <div>
                      <div className="fo-vj-facts-list__label">Experience</div>
                      <div className="fo-vj-facts-list__value">{selectedJob.experienceLevel}</div>
                    </div>
                  </li>
                ) : null}
                {selectedJob.companySize ? (
                  <li>
                    <span className="fo-vj-facts-list__icon"><i className="fa fa-users" aria-hidden="true" /></span>
                    <div>
                      <div className="fo-vj-facts-list__label">Company Size</div>
                      <div className="fo-vj-facts-list__value">{selectedJob.companySize}</div>
                    </div>
                  </li>
                ) : null}
                {selectedJob.deadline ? (
                  <li>
                    <span className="fo-vj-facts-list__icon"><i className="fa fa-hourglass-end" aria-hidden="true" /></span>
                    <div>
                      <div className="fo-vj-facts-list__label">Deadline</div>
                      <div className="fo-vj-facts-list__value">{selectedJob.deadline}</div>
                    </div>
                  </li>
                ) : null}
              </ul>
            </div>

            {/* Back link */}
            <Link to="/frontoffice/jobs" className="fo-btn-outline" style={{ justifyContent: 'center' }}>
              <i className="fa fa-arrow-left" aria-hidden="true" style={{ marginRight: '6px' }} />
              Back to All Jobs
            </Link>

          </aside>
        </div>

        {/* Similar Jobs */}
        {similarJobs.length > 0 ? (
          <div className="fo-vj-similar">
            <div className="fo-vj-similar__head">
              <span className="fo-vj-section__icon"><i className="fa fa-th-list" aria-hidden="true" /></span>
              <h2>Similar Jobs</h2>
            </div>
            <div className="fo-vj-similar__grid">
              {similarJobs.map((job) => (
                <article key={job.id} className="fo-vj-similar-card">
                  <div className="fo-cta-row" style={{ gap: '6px' }}>
                    <span className="fo-chip" style={{ fontSize: '0.68rem' }}>{job.jobType}</span>
                    {job.featured ? <span className="fo-chip" style={{ fontSize: '0.68rem', background: '#15803d' }}>Featured</span> : null}
                  </div>
                  <h3>{job.title}</h3>
                  <p>{job.companyName}{job.location ? ` · ${job.location}` : ''}</p>
                  {hasDisclosedSalary(job) ? (
                    <p style={{ color: 'var(--fo-primary)', fontWeight: 600, fontSize: '0.86rem' }}>{getSalaryLabel(job)}</p>
                  ) : null}
                  <div className="fo-cta-row" style={{ marginTop: '4px' }}>
                    <Link to={`/frontoffice/viewjob/${job.id}`} className="fo-btn-outline" style={{ fontSize: '0.8rem', padding: '8px 12px' }}>
                      View Role
                    </Link>
                    <Link to={`/frontoffice/login?redirect=/frontoffice/newcandidature/${job.id}`} className="fo-btn" style={{ fontSize: '0.8rem', padding: '8px 12px' }}>
                      Apply
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

      </div>
    </FrontOfficeLayout>
  );
};

export default FrontOfficeViewJobNative;
