import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import CurrentUser from '../../../main/config/user';
import userHTTPService from '../../../main/services/userHTTPService';
import candidateHTTPService from '../../../main/services/candidateHTTPService';
import FrontOfficeLayout from '../shared/FrontOfficeLayout';
import useSeo from '../shared/useSeo';

const STEPS = ['Account', 'Personal Info', 'Professional Profile'];

const CAREER_LEVELS = ['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager', 'Director', 'Executive'];
const EXPERIENCE_OPTIONS = ['Less than 1 year', '1-2 years', '3-5 years', '6-10 years', '10+ years'];
const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Freelance', 'Internship', 'Remote'];

// -- Shared styles -------------------------------------------------------------
const inp = (err) => ({
  display: 'block', width: '100%', boxSizing: 'border-box',
  padding: '11px 14px', borderRadius: '10px', fontSize: '13px',
  border: `1.5px solid ${err ? '#ef4444' : '#e2e8f0'}`,
  outline: 'none', background: '#fff', color: '#0f172a', fontFamily: 'inherit',
  transition: 'border-color 0.2s',
});
const lbl = { display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' };
const fw = { display: 'flex', flexDirection: 'column', gap: '3px' };

const FrontOfficeRegisterNative = () => {
  const history = useHistory();
  const [accountType, setAccountType] = useState(null); // 'jobseeker' | 'company'
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phone: '', dateOfBirth: '', gender: '', nationality: '', city: '', country: '', address: '',
    jobRole: '', careerLevel: '', experience: '', skills: '', language: '',
    salary: '', remoteWork: 'No', immediateAvailable: 'No', summary: '',
    jobTypes: [],
    avatar: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [stepErrors, setStepErrors] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);
  useSeo('UPRECRUIT Register', 'Join UPRECRUIT as a job seeker or register your company.');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleJobType = (jt) => {
    setFormData(prev => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(jt) ? prev.jobTypes.filter(x => x !== jt) : [...prev.jobTypes, jt],
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData(prev => ({ ...prev, avatar: file.name }));
  };

  const validateStep = () => {
    if (step === 0) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) return 'First and last name are required.';
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) return 'Valid email is required.';
      if (!formData.password || formData.password.length < 8) return 'Password must be at least 8 characters.';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    }
    if (step === 1) {
      if (!formData.phone.trim()) return 'Phone number is required.';
      if (!formData.city.trim() || !formData.country.trim()) return 'City and country are required.';
    }
    return '';
  };

  const goNext = (e) => {
    e.preventDefault();
    const err = validateStep();
    if (err) { setStepErrors(err); return; }
    setStepErrors('');
    setStep((s) => s + 1);
  };

  const goBack = () => { setStepErrors(''); setStep((s) => s - 1); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const err = validateStep();
    if (err) { setStepErrors(err); return; }
    setStepErrors('');
    setIsSubmitting(true);

    const userPayload = { username: formData.email, password: formData.password };

    userHTTPService
      .createUser(userPayload)
      .then(() => userHTTPService.login(userPayload))
      .then((response) => {
        const userData = response?.data ?? {};
        if (!Object.keys(userData).length) {
          setFeedbackMessage('Account created -- please sign in manually.');
          setIsSubmitting(false);
          return;
        }
        CurrentUser.CONNECTED_USER = true;
        CurrentUser.USER_DETAIL = userData;
        localStorage.setItem('connected', 'true');
        localStorage.setItem('frontofficeRole', 'jobseeker');
        localStorage.setItem('currentUser', JSON.stringify(userData));

        return candidateHTTPService.createCandidate({
          firstName: formData.firstName, lastName: formData.lastName, email: formData.email,
          phone: formData.phone, dateOfBirth: formData.dateOfBirth, gender: formData.gender,
          nationality: formData.nationality, city: formData.city, country: formData.country,
          address: formData.address, jobRole: formData.jobRole, careerLevel: formData.careerLevel,
          experience: formData.experience, skills: formData.skills, language: formData.language,
          salary: formData.salary, remoteWork: formData.remoteWork,
          immediateAvailable: formData.immediateAvailable, summary: formData.summary,
          password: formData.password,
        });
      })
      .then(() => { setSuccess(true); setTimeout(() => history.push('/frontoffice/member'), 2500); })
      .catch((error) => {
        const apiMessage = error?.response?.data?.message;
        setFeedbackMessage(apiMessage || 'Registration failed. This email may already be in use or the server is unavailable.');
      })
      .finally(() => setIsSubmitting(false));
  };

  // -- Success screen ------------------------------------------------------------
  if (success) {
    return (
      <FrontOfficeLayout title="Welcome aboard!" subtitle="">
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ maxWidth: '480px', width: '100%', background: '#fff', borderRadius: '20px', border: '2px solid #86efac', padding: '48px 40px', textAlign: 'center', boxShadow: '0 20px 60px #00000012' }}>
            <div style={{ width: '68px', height: '68px', background: 'linear-gradient(135deg,#16a34a,#059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <i className="fa fa-check" style={{ color: '#fff', fontSize: '28px' }} />
            </div>
            <h2 style={{ color: '#15803d', marginBottom: '8px' }}>Account Created!</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Welcome, <strong>{formData.firstName}</strong>! Redirecting to your dashboard...</p>
          </div>
        </div>
      </FrontOfficeLayout>
    );
  }

  // -- Type chooser --------------------------------------------------------------
  if (!accountType) {
    return (
      <FrontOfficeLayout title="Create your account" subtitle="Choose how you want to join UPRECRUIT">
        <div style={{ padding: '48px 20px', maxWidth: '720px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>I want to join as...</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Select the account type that fits you best</p>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>

            {/* Job Seeker card */}
            <button type="button" onClick={() => setAccountType('jobseeker')} style={{ flex: '1 1 280px', maxWidth: '320px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '20px', padding: '32px 28px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: '0 4px 20px #00000008' }}
              onMouseEnter={e => { e.currentTarget.style.border = '2px solid #6366f1'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px #6366f120'; }}
              onMouseLeave={e => { e.currentTarget.style.border = '2px solid #e2e8f0'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px #00000008'; }}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <i className="fa fa-user" style={{ color: '#fff', fontSize: '22px' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Job Seeker / Candidate</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '16px' }}>Find your next role, apply with one click, track your applications, and get AI-matched to the best opportunities.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Apply to jobs', 'Track interviews', 'Build CV', 'Get matched'].map(t => (
                  <span key={t} style={{ background: '#f0f0ff', color: '#6366f1', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
              <div style={{ marginTop: '20px', background: '#6366f1', color: '#fff', borderRadius: '10px', padding: '10px', fontWeight: 700, fontSize: '13px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                Register as Job Seeker <i className="fa fa-arrow-right" />
              </div>
            </button>

            {/* Company card */}
            <button type="button" onClick={() => history.push('/frontoffice/company-register')} style={{ flex: '1 1 280px', maxWidth: '320px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '20px', padding: '32px 28px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: '0 4px 20px #00000008' }}
              onMouseEnter={e => { e.currentTarget.style.border = '2px solid #8b5cf6'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px #8b5cf620'; }}
              onMouseLeave={e => { e.currentTarget.style.border = '2px solid #e2e8f0'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px #00000008'; }}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <i className="fa fa-building" style={{ color: '#fff', fontSize: '22px' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Company / Employer</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '16px' }}>Post jobs, manage pipelines, run interviews, and hire top talent - all from one powerful recruitment platform.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Post jobs', 'Manage candidates', 'Schedule interviews', 'Analytics'].map(t => (
                  <span key={t} style={{ background: '#f5f3ff', color: '#8b5cf6', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
              <div style={{ marginTop: '20px', background: '#8b5cf6', color: '#fff', borderRadius: '10px', padding: '10px', fontWeight: 700, fontSize: '13px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                Register Company <i className="fa fa-arrow-right" />
              </div>
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/frontoffice/login" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>Sign in -&gt;</Link>
          </p>
        </div>
      </FrontOfficeLayout>
    );
  }

  // -- Job Seeker multi-step form ------------------------------------------------
  return (
    <FrontOfficeLayout title="Create Your Candidate Account" subtitle="Set up your profile to apply with one click, track interviews, and receive role recommendations.">
      <div style={{ maxWidth: '660px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Back to chooser */}
        <button type="button" onClick={() => { setAccountType(null); setStep(0); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer', marginBottom: '24px', padding: 0 }}>
          <i className="fa fa-arrow-left" /> Change account type
        </button>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '32px' }}>
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', background: i < step ? '#16a34a' : i === step ? '#6366f1' : '#f1f5f9', color: i <= step ? '#fff' : '#94a3b8', transition: 'all 0.2s', border: `2px solid ${i < step ? '#16a34a' : i === step ? '#6366f1' : '#e2e8f0'}` }}>
                  {i < step ? <i className="fa fa-check" /> : i + 1}
                </div>
                <span style={{ fontSize: '10px', fontWeight: i === step ? 700 : 400, color: i === step ? '#6366f1' : '#94a3b8', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: '2px', background: i < step ? '#16a34a' : '#e2e8f0', margin: '19px 8px 0', transition: 'all 0.2s' }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 30px #00000010', border: '1px solid #f1f5f9' }}>

          {/* -- Step 0: Account -- */}
          {step === 0 && (
            <form onSubmit={goNext}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '36px', height: '36px', background: '#eef2ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa fa-user" style={{ color: '#6366f1' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Account Information</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Your login credentials</p>
                </div>
              </div>

              {/* Avatar upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', background: '#f8fafc', borderRadius: '12px', padding: '14px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: formData.avatar ? '#e0e7ff' : '#f1f5f9', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="fa fa-user" style={{ fontSize: '24px', color: formData.avatar ? '#6366f1' : '#cbd5e1' }} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Profile Photo <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></div>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', border: '1.5px dashed #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#475569' }}>
                    <i className="fa fa-upload" /> {formData.avatar ? formData.avatar : 'Upload Photo'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={fw}>
                  <label style={lbl}>First Name *</label>
                  <input style={inp()} name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" required />
                </div>
                <div style={fw}>
                  <label style={lbl}>Last Name *</label>
                  <input style={inp()} name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required />
                </div>
                <div style={{ ...fw, gridColumn: '1/-1' }}>
                  <label style={lbl}>Email Address *</label>
                  <input style={inp()} name="email" type="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" required />
                </div>
                <div style={fw}>
                  <label style={lbl}>Password *</label>
                  <input style={inp()} name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Min. 8 characters" required />
                </div>
                <div style={fw}>
                  <label style={lbl}>Confirm Password *</label>
                  <input style={inp()} name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" required />
                </div>
              </div>

              {stepErrors && <p style={{ color: '#ef4444', margin: '10px 0 0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fa fa-exclamation-circle" />{stepErrors}</p>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="submit" style={{ padding: '11px 28px', borderRadius: '10px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  Personal Info <i className="fa fa-arrow-right" />
                </button>
              </div>
            </form>
          )}

          {/* -- Step 1: Personal Info -- */}
          {step === 1 && (
            <form onSubmit={goNext}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '36px', height: '36px', background: '#eef2ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa fa-map-marker" style={{ color: '#6366f1' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Personal Information</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Your contact and location details</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={fw}>
                  <label style={lbl}>Phone Number *</label>
                  <input style={inp()} name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 555 000 0000" required />
                </div>
                <div style={fw}>
                  <label style={lbl}>Date of Birth</label>
                  <input style={inp()} name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
                <div style={fw}>
                  <label style={lbl}>Gender</label>
                  <select style={inp()} name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">- Select -</option>
                    {GENDER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div style={fw}>
                  <label style={lbl}>Nationality</label>
                  <input style={inp()} name="nationality" value={formData.nationality} onChange={handleChange} placeholder="e.g. American" />
                </div>
                <div style={fw}>
                  <label style={lbl}>City *</label>
                  <input style={inp()} name="city" value={formData.city} onChange={handleChange} placeholder="New York" required />
                </div>
                <div style={fw}>
                  <label style={lbl}>Country *</label>
                  <input style={inp()} name="country" value={formData.country} onChange={handleChange} placeholder="USA" required />
                </div>
                <div style={{ ...fw, gridColumn: '1/-1' }}>
                  <label style={lbl}>Street Address</label>
                  <input style={inp()} name="address" value={formData.address} onChange={handleChange} placeholder="123 Main Street" />
                </div>
              </div>

              {stepErrors && <p style={{ color: '#ef4444', margin: '10px 0 0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fa fa-exclamation-circle" />{stepErrors}</p>}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button type="button" onClick={goBack} style={{ padding: '11px 22px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa fa-arrow-left" /> Back
                </button>
                <button type="submit" style={{ padding: '11px 28px', borderRadius: '10px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  Professional Profile <i className="fa fa-arrow-right" />
                </button>
              </div>
            </form>
          )}

          {/* -- Step 2: Professional Profile -- */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '36px', height: '36px', background: '#eef2ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa fa-briefcase" style={{ color: '#6366f1' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Professional Profile</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Help employers find the right match for you</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ ...fw, gridColumn: '1/-1' }}>
                  <label style={lbl}>Desired Job Title</label>
                  <input style={inp()} name="jobRole" value={formData.jobRole} onChange={handleChange} placeholder="e.g. Frontend Developer, Product Manager..." />
                </div>
                <div style={fw}>
                  <label style={lbl}>Career Level</label>
                  <select style={inp()} name="careerLevel" value={formData.careerLevel} onChange={handleChange}>
                    <option value="">- Select -</option>
                    {CAREER_LEVELS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div style={fw}>
                  <label style={lbl}>Years of Experience</label>
                  <select style={inp()} name="experience" value={formData.experience} onChange={handleChange}>
                    <option value="">- Select -</option>
                    {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ ...fw, gridColumn: '1/-1' }}>
                  <label style={lbl}>Skills</label>
                  <input style={inp()} name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, SQL, Design..." />
                </div>
                <div style={fw}>
                  <label style={lbl}>Languages Spoken</label>
                  <input style={inp()} name="language" value={formData.language} onChange={handleChange} placeholder="English, French..." />
                </div>
                <div style={fw}>
                  <label style={lbl}>Expected Salary</label>
                  <input style={inp()} name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. $60,000 / year" />
                </div>
                <div style={fw}>
                  <label style={lbl}>Open to Remote?</label>
                  <select style={inp()} name="remoteWork" value={formData.remoteWork} onChange={handleChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div style={fw}>
                  <label style={lbl}>Immediately Available?</label>
                  <select style={inp()} name="immediateAvailable" value={formData.immediateAvailable} onChange={handleChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Job type chips */}
                <div style={{ ...fw, gridColumn: '1/-1' }}>
                  <label style={lbl}>Preferred Job Types</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
                    {JOB_TYPES.map(jt => {
                      const selected = formData.jobTypes.includes(jt);
                      return (
                        <button key={jt} type="button" onClick={() => toggleJobType(jt)}
                          style={{ padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${selected ? '#6366f1' : '#e2e8f0'}`, background: selected ? '#eef2ff' : '#fff', color: selected ? '#6366f1' : '#64748b', fontWeight: selected ? 700 : 400, fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s' }}>
                          {selected && <i className="fa fa-check" style={{ marginRight: '5px', fontSize: '10px' }} />}{jt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ ...fw, gridColumn: '1/-1' }}>
                  <label style={lbl}>Professional Summary</label>
                  <textarea name="summary" value={formData.summary} onChange={handleChange} rows={4}
                    placeholder="Briefly describe your background, strengths, and career goals..."
                    style={{ ...inp(), resize: 'vertical' }} />
                </div>
              </div>

              {feedbackMessage && <p style={{ color: '#ef4444', margin: '10px 0 0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fa fa-exclamation-circle" />{feedbackMessage}</p>}
              {stepErrors && <p style={{ color: '#ef4444', margin: '10px 0 0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fa fa-exclamation-circle" />{stepErrors}</p>}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button type="button" onClick={goBack} style={{ padding: '11px 22px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa fa-arrow-left" /> Back
                </button>
                <button type="submit" disabled={isSubmitting}
                  style={{ padding: '11px 28px', borderRadius: '10px', border: 'none', background: isSubmitting ? '#94a3b8' : '#6366f1', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: '0 4px 14px #6366f140' }}>
                  {isSubmitting ? <><i className="fa fa-spinner fa-spin" /> Creating Account...</> : <><i className="fa fa-check" /> Create Account</>}
                </button>
              </div>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/frontoffice/login" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>Sign in -&gt;</Link>
        </p>
      </div>
    </FrontOfficeLayout>
  );
};

export default FrontOfficeRegisterNative;
