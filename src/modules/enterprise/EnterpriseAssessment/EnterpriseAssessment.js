import React, { useState, useEffect, useMemo, useRef } from 'react';
import '../../shared/DashBoard/DashBoard.css';

// ─── Question Bank ────────────────────────────────────────────────────────────

const QUESTION_BANK = {
  coding: [
    { id: 'c1', q: 'Write a function to reverse a string without using built-in reverse methods.', type: 'coding',  difficulty: 'Easy',   points: 10 },
    { id: 'c2', q: 'Implement a binary search algorithm on a sorted array.',                       type: 'coding',  difficulty: 'Medium', points: 20 },
    { id: 'c3', q: 'Design a rate limiter for an API that allows 100 requests per minute.',        type: 'coding',  difficulty: 'Hard',   points: 30 },
  ],
  sql: [
    { id: 's1', q: 'Write a SQL query to find the 3rd highest salary from an employees table.',   type: 'sql',     difficulty: 'Medium', points: 15 },
    { id: 's2', q: 'Explain the difference between INNER JOIN and LEFT JOIN with examples.',       type: 'sql',     difficulty: 'Easy',   points: 10 },
    { id: 's3', q: 'Optimise a slow query that performs a full table scan on 10 million records.', type: 'sql',     difficulty: 'Hard',   points: 25 },
  ],
  devops: [
    { id: 'd1', q: 'Describe the steps to deploy a containerised Node.js app to Kubernetes.',     type: 'devops',  difficulty: 'Medium', points: 20 },
    { id: 'd2', q: 'What is infrastructure as code and what are its advantages?',                  type: 'devops',  difficulty: 'Easy',   points: 10 },
    { id: 'd3', q: 'Design a CI/CD pipeline for a microservices architecture.',                    type: 'devops',  difficulty: 'Hard',   points: 30 },
  ],
  cloud: [
    { id: 'cl1', q: 'Compare AWS Lambda and EC2. When would you choose each?',                    type: 'cloud',   difficulty: 'Medium', points: 15 },
    { id: 'cl2', q: 'How does an auto-scaling group work in AWS?',                                 type: 'cloud',   difficulty: 'Easy',   points: 10 },
  ],
  logical: [
    { id: 'l1', q: 'If all roses are flowers and some flowers fade quickly, do some roses fade quickly?', type: 'logical', difficulty: 'Easy', points: 10, options: ['Yes', 'No', 'Cannot be determined'], answer: 'Cannot be determined' },
    { id: 'l2', q: 'A train travels 60 km/h for 2 hours, then 80 km/h for 1.5 hours. What is the average speed for the whole journey?', type: 'logical', difficulty: 'Medium', points: 15, options: ['68 km/h', '70 km/h', '67.5 km/h', '72 km/h'], answer: '68 km/h' },
  ],
  numerical: [
    { id: 'n1', q: 'A shop reduces its prices by 20%, then increases them by 25%. What is the net change?', type: 'numerical', difficulty: 'Medium', points: 15, options: ['0%', '+5%', '-5%', '+2%'], answer: '0%' },
    { id: 'n2', q: 'If 12 workers complete a task in 8 days, how many days will 16 workers take?',           type: 'numerical', difficulty: 'Easy',   points: 10, options: ['4 days', '6 days', '7 days', '9 days'],   answer: '6 days' },
  ],
  disc: [
    { id: 'di1', q: 'When facing a conflict at work, I typically…',   type: 'disc', difficulty: 'N/A', points: 5, options: ['Address it directly and push for a resolution', 'Seek consensus and try to find common ground', 'Analyse all the facts before taking any action', 'Avoid confrontation and hope it resolves itself'], answer: null },
    { id: 'di2', q: 'I am most motivated by…',                         type: 'disc', difficulty: 'N/A', points: 5, options: ['Winning and achieving measurable results', 'Influencing people and building relationships', 'A stable and predictable work environment', 'High accuracy and completing work correctly'],     answer: null },
  ],
  bigfive: [
    { id: 'b1', q: 'I enjoy meeting new people and attending social events.', type: 'bigfive', difficulty: 'N/A', points: 5, options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'], answer: null },
    { id: 'b2', q: 'I prefer to stick to routines and established processes.', type: 'bigfive', difficulty: 'N/A', points: 5, options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'], answer: null },
  ],
  english: [
    { id: 'en1', q: "Choose the correct sentence: a) \"He don't know the answer.\" b) \"He doesn't know the answer.\" c) \"He not know the answer.\"", type: 'english', difficulty: 'Easy', points: 10, options: ['a', 'b', 'c'], answer: 'b' },
    { id: 'en2', q: 'What is the past participle of "arise"?',  type: 'english', difficulty: 'Medium', points: 15, options: ['arised', 'arose', 'arisen', 'arising'], answer: 'arisen' },
  ],
  french: [
    { id: 'fr1', q: 'Complete: "Je ___ allé au bureau hier."', type: 'french', difficulty: 'Easy', points: 10, options: ['suis', 'ai', 'était', 'avoir'], answer: 'suis' },
  ],
  german: [
    { id: 'de1', q: 'Translate: "Ich arbeite seit fünf Jahren in diesem Unternehmen."', type: 'german', difficulty: 'Medium', points: 15, options: ['I worked for five years in this company.', 'I have been working in this company for five years.', 'I will work five years in this company.', 'I worked five years ago in this company.'], answer: 'I have been working in this company for five years.' },
  ],
};

const TEST_TYPES = [
  { id: 'coding',    label: 'Coding',           category: 'Technical',   icon: 'fa-code',          duration: 45 },
  { id: 'sql',       label: 'SQL',              category: 'Technical',   icon: 'fa-database',      duration: 30 },
  { id: 'devops',    label: 'DevOps',           category: 'Technical',   icon: 'fa-server',        duration: 30 },
  { id: 'cloud',     label: 'Cloud',            category: 'Technical',   icon: 'fa-cloud',         duration: 20 },
  { id: 'logical',   label: 'Logical Reasoning', category: 'Aptitude',   icon: 'fa-puzzle-piece',  duration: 20 },
  { id: 'numerical', label: 'Numerical Reasoning', category: 'Aptitude', icon: 'fa-calculator',   duration: 20 },
  { id: 'disc',      label: 'DISC Profile',     category: 'Personality', icon: 'fa-pie-chart',     duration: 15 },
  { id: 'bigfive',   label: 'Big Five',         category: 'Personality', icon: 'fa-star-o',        duration: 15 },
  { id: 'english',   label: 'English',          category: 'Language',    icon: 'fa-language',      duration: 25 },
  { id: 'french',    label: 'French',           category: 'Language',    icon: 'fa-language',      duration: 25 },
  { id: 'german',    label: 'German',           category: 'Language',    icon: 'fa-language',      duration: 25 },
];

const SESSIONS_SEED = [
  { id: 'sess-1', candidateName: 'Sophia Lee',   testType: 'coding',    score: 85,  duration: '38m', completedAt: '2026-06-10', flagged: false, flagReason: '' },
  { id: 'sess-2', candidateName: 'James Okafor', testType: 'sql',       score: 72,  duration: '28m', completedAt: '2026-06-11', flagged: false, flagReason: '' },
  { id: 'sess-3', candidateName: 'Tom Fischer',  testType: 'logical',   score: 55,  duration: '22m', completedAt: '2026-06-12', flagged: true,  flagReason: 'Multiple tab switches detected' },
  { id: 'sess-4', candidateName: 'Aisha Patel',  testType: 'bigfive',   score: null, duration: '14m', completedAt: '2026-06-12', flagged: false, flagReason: '' },
];

const SECTIONS = [
  { id: 'library',   label: 'Test Library',    icon: 'fa-book' },
  { id: 'session',   label: 'Take Test',       icon: 'fa-pencil-square-o' },
  { id: 'results',   label: 'Results',         icon: 'fa-bar-chart' },
  { id: 'proctoring', label: 'Proctoring',     icon: 'fa-eye' },
  { id: 'bank',      label: 'Question Bank',   icon: 'fa-list' },
];

const CATEGORY_COLORS = { Technical: '#3b82f6', Aptitude: '#8b5cf6', Personality: '#ec4899', Language: '#f59e0b' };

// ─── Timer hook ───────────────────────────────────────────────────────────────

const useTimer = (initialSeconds, running) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (!running || seconds <= 0) return;
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [running, seconds]);
  const reset = (val) => setSeconds(val);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return { seconds, display: `${mm}:${ss}`, reset };
};

// ─── Component ────────────────────────────────────────────────────────────────

const EnterpriseAssessment = () => {
  const [activeSection, setActiveSection] = useState('library');
  const [sessions, setSessions] = useState(SESSIONS_SEED);
  const [actionMessage, setActionMessage] = useState('');

  // Test session state
  const [activeTest, setActiveTest] = useState(null);      // TEST_TYPES object
  const [testRunning, setTestRunning] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [answers, setAnswers] = useState({});               // { questionId: answerText }
  const [candidateNameInput, setCandidateNameInput] = useState('');
  const [webcamActive, setWebcamActive] = useState(false);
  const [proctorFlags, setProctorFlags] = useState([]);
  const tabSwitchRef = useRef(0);

  const questions = activeTest ? (QUESTION_BANK[activeTest.id] || []) : [];
  const timerDuration = activeTest ? activeTest.duration * 60 : 0;
  const { seconds: timeLeft, display: timeDisplay, reset: resetTimer } = useTimer(timerDuration, testRunning && !testFinished);

  const flash = (msg) => { setActionMessage(msg); setTimeout(() => setActionMessage(''), 3500); };

  // Anti-cheat: tab-switch detection
  useEffect(() => {
    if (!testRunning) return;
    const handleVisibility = () => {
      if (document.hidden) {
        tabSwitchRef.current += 1;
        if (tabSwitchRef.current >= 2) {
          setProctorFlags((prev) => [...prev, `Tab switch #${tabSwitchRef.current} detected at ${timeDisplay}`]);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [testRunning, timeDisplay]);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (testRunning && timeLeft === 0) handleSubmitTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, testRunning]);

  const handleStartTest = () => {
    if (!candidateNameInput.trim()) { flash('Enter candidate name first.'); return; }
    setAnswers({});
    setProctorFlags([]);
    tabSwitchRef.current = 0;
    resetTimer(timerDuration);
    setTestRunning(true);
    setTestFinished(false);
  };

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitTest = () => {
    setTestRunning(false);
    setTestFinished(true);
    const hasAnswerKey = questions.some((q) => q.answer !== null && q.answer !== undefined);
    let score = null;
    if (hasAnswerKey) {
      const correct = questions.filter((q) => q.answer !== null && answers[q.id] === q.answer).length;
      score = Math.round((correct / Math.max(questions.length, 1)) * 100);
    }
    const flagged = proctorFlags.length > 0;
    setSessions((prev) => [...prev, {
      id: `sess-${Date.now()}`,
      candidateName: candidateNameInput,
      testType: activeTest.id,
      score,
      duration: `${activeTest.duration - Math.floor(timeLeft / 60)}m`,
      completedAt: new Date().toISOString().slice(0, 10),
      flagged,
      flagReason: proctorFlags.join('; '),
    }]);
    flash(`Test submitted for ${candidateNameInput}${score !== null ? ` — Score: ${score}%` : ' — Personality profile recorded'}.`);
    setActiveSection('results');
  };

  const answeredCount = Object.keys(answers).length;
  const completionPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  // Question bank filter
  const [qbFilter, setQbFilter] = useState('all');
  const [newQForm, setNewQForm] = useState({ q: '', type: 'coding', difficulty: 'Medium', points: 10, options: '', answer: '' });
  const [customQuestions, setCustomQuestions] = useState([]);

  const handleAddQuestion = (event) => {
    event.preventDefault();
    if (!newQForm.q.trim()) return;
    setCustomQuestions((prev) => [...prev, {
      id: `cq-${Date.now()}`,
      ...newQForm,
      points: Number(newQForm.points),
      options: newQForm.options ? newQForm.options.split(',').map((o) => o.trim()) : [],
    }]);
    setNewQForm({ q: '', type: 'coding', difficulty: 'Medium', points: 10, options: '', answer: '' });
    flash('Question added to bank.');
  };

  const allQuestions = useMemo(() => {
    const base = Object.values(QUESTION_BANK).flat();
    const combined = [...base, ...customQuestions];
    return qbFilter === 'all' ? combined : combined.filter((q) => q.type === qbFilter);
  }, [customQuestions, qbFilter]);

  return (
    <div className="user-management">
      {actionMessage && <div className="alert alert-success" style={{ marginBottom: '16px' }}>{actionMessage}</div>}

      <aside className="user-management__sidebar">
        <div className="user-management__sidebar-header"><i className="fa fa-graduation-cap" /><span>Assessment Platform</span></div>
        {SECTIONS.map((s) => (
          <button key={s.id} type="button" className={`user-management__sidebar-item${activeSection === s.id ? ' active' : ''}`} onClick={() => setActiveSection(s.id)}>
            <i className={`fa ${s.icon}`} /><span>{s.label}</span>
          </button>
        ))}
      </aside>

      <main className="user-management__main">

        {/* ── Test Library ── */}
        {activeSection === 'library' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-book" /> Test Library</h4>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Choose a test type to begin a timed assessment session with anti-cheat monitoring.</p>

            {['Technical', 'Aptitude', 'Personality', 'Language'].map((cat) => (
              <div key={cat} style={{ marginBottom: '20px' }}>
                <h5 style={{ color: CATEGORY_COLORS[cat], marginBottom: '10px' }}><i className="fa fa-tag" /> {cat} Tests</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {TEST_TYPES.filter((t) => t.category === cat).map((test) => (
                    <div key={test.id} style={{ background: '#fff', border: `2px solid ${CATEGORY_COLORS[cat]}33`, borderRadius: '10px', padding: '14px', minWidth: '150px', flex: '1 1 140px', cursor: 'pointer' }}
                      onClick={() => { setActiveTest(test); setTestRunning(false); setTestFinished(false); setCandidateNameInput(''); setAnswers({}); setActiveSection('session'); }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <i className={`fa ${test.icon}`} style={{ color: CATEGORY_COLORS[cat], fontSize: '16px' }} />
                        <strong style={{ fontSize: '13px' }}>{test.label}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}><i className="fa fa-clock-o" /> {test.duration} min</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{(QUESTION_BANK[test.id] || []).length} questions</div>
                      <button type="button" className="btn btn-outline-primary btn-sm" style={{ marginTop: '8px', width: '100%' }}>
                        Start Test
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── Take Test ── */}
        {activeSection === 'session' && (
          <section className="user-management__section">
            {!activeTest && (
              <div style={{ color: '#64748b', padding: '40px', textAlign: 'center' }}>
                <i className="fa fa-arrow-left" /> Select a test from the <button type="button" className="btn btn-link" style={{ padding: 0, fontSize: 'inherit' }} onClick={() => setActiveSection('library')}>Test Library</button>.
              </div>
            )}

            {activeTest && !testRunning && !testFinished && (
              <div>
                <h4 className="dashboard-section-heading"><i className={`fa ${activeTest.icon}`} /> {activeTest.label} Test</h4>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', maxWidth: '500px' }}>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <div><strong>{activeTest.duration} min</strong><div style={{ fontSize: '11px', color: '#94a3b8' }}>Duration</div></div>
                    <div><strong>{questions.length}</strong><div style={{ fontSize: '11px', color: '#94a3b8' }}>Questions</div></div>
                    <div><strong>{activeTest.category}</strong><div style={{ fontSize: '11px', color: '#94a3b8' }}>Category</div></div>
                  </div>
                  <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', color: '#92400e', marginBottom: '16px' }}>
                    <i className="fa fa-exclamation-triangle" /> Anti-cheat monitoring is active. Tab-switching is logged. Webcam monitoring available.
                  </div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Candidate Name</label>
                  <input className="fo-input" placeholder="Enter candidate name" value={candidateNameInput} onChange={(e) => setCandidateNameInput(e.target.value)} style={{ marginBottom: '12px', width: '100%' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="btn btn-primary" onClick={handleStartTest}><i className="fa fa-play" /> Start Test</button>
                    <button type="button" className={`btn ${webcamActive ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => setWebcamActive((p) => !p)}>
                      <i className="fa fa-video-camera" /> {webcamActive ? 'Webcam ON' : 'Enable Webcam'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTest && testRunning && !testFinished && (
              <div>
                {/* Timer bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{activeTest.label} — {candidateNameInput}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{answeredCount}/{questions.length} answered</span>
                    <span style={{ fontWeight: 800, fontSize: '18px', color: timeLeft < 120 ? '#dc2626' : '#3b82f6', fontVariantNumeric: 'tabular-nums' }}>{timeDisplay}</span>
                    <button type="button" className="btn btn-success btn-sm" onClick={handleSubmitTest}>Submit Test</button>
                  </div>
                </div>
                <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '20px', overflow: 'hidden' }}>
                  <div style={{ width: `${completionPct}%`, height: '100%', background: '#3b82f6', borderRadius: '2px', transition: 'width 0.3s' }} />
                </div>

                {webcamActive && (
                  <div style={{ background: '#1e293b', borderRadius: '8px', padding: '8px 12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                    <span style={{ color: '#f1f5f9', fontSize: '12px' }}><i className="fa fa-video-camera" /> Webcam monitoring active — AI proctoring enabled</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {questions.map((q, index) => (
                    <div key={q.id} style={{ background: '#fff', border: `1px solid ${answers[q.id] ? '#a7f3d0' : '#e2e8f0'}`, borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <span style={{ background: '#f1f5f9', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 700, color: '#475569', flexShrink: 0 }}>Q{index + 1}</span>
                        <span style={{ background: q.difficulty === 'Hard' ? '#fee2e2' : q.difficulty === 'Medium' ? '#fef3c7' : '#d1fae5', color: q.difficulty === 'Hard' ? '#dc2626' : q.difficulty === 'Medium' ? '#b45309' : '#065f46', borderRadius: '4px', padding: '1px 7px', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>{q.difficulty}</span>
                        <span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: '4px', padding: '1px 7px', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>{q.points}pts</span>
                      </div>
                      <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#1e293b' }}>{q.q}</p>

                      {q.options ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {q.options.map((opt) => (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', padding: '6px 10px', borderRadius: '6px', background: answers[q.id] === opt ? '#eff6ff' : 'transparent', border: answers[q.id] === opt ? '1px solid #93c5fd' : '1px solid transparent' }}>
                              <input type="radio" name={q.id} value={opt} checked={answers[q.id] === opt} onChange={() => handleAnswer(q.id, opt)} style={{ flexShrink: 0 }} />
                              {opt}
                            </label>
                          ))}
                        </div>
                      ) : (
                        <textarea
                          className="fo-input"
                          placeholder="Write your answer here…"
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswer(q.id, e.target.value)}
                          style={{ width: '100%', minHeight: '100px', resize: 'vertical', fontFamily: q.type === 'coding' || q.type === 'sql' ? 'monospace' : 'inherit', fontSize: '13px' }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn btn-success" onClick={handleSubmitTest}>Submit Test ({answeredCount}/{questions.length} answered)</button>
                </div>
              </div>
            )}

            {testFinished && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px' }}>✅</div>
                <h4 style={{ marginTop: '16px' }}>Test Submitted</h4>
                <p style={{ color: '#64748b' }}>Results have been saved and are available in the Results tab.</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
                  <button type="button" className="btn btn-outline-primary" onClick={() => setActiveSection('results')}>View Results</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => { setActiveTest(null); setTestFinished(false); setActiveSection('library'); }}>Start Another Test</button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Results ── */}
        {activeSection === 'results' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-bar-chart" /> Assessment Results</h4>

            <div className="user-management__kpi-row">
              <div className="user-management__kpi"><strong>{sessions.length}</strong><span>Tests Completed</span></div>
              <div className="user-management__kpi"><strong>{sessions.filter((s) => s.score !== null && s.score >= 70).length}</strong><span>Passed (≥70%)</span></div>
              <div className="user-management__kpi"><strong>{sessions.filter((s) => s.flagged).length}</strong><span>Flagged Sessions</span></div>
              <div className="user-management__kpi"><strong>{sessions.filter((s) => s.score !== null).length > 0 ? Math.round(sessions.filter((s) => s.score !== null).reduce((sum, s) => sum + s.score, 0) / sessions.filter((s) => s.score !== null).length) : '—'}%</strong><span>Avg Score</span></div>
            </div>

            <div className="user-management__table-wrapper" style={{ marginTop: '20px' }}>
              <table className="user-management__table">
                <thead>
                  <tr><th>Candidate</th><th>Test Type</th><th>Score</th><th>Duration</th><th>Date</th><th>Proctor Status</th></tr>
                </thead>
                <tbody>
                  {[...sessions].reverse().map((sess) => {
                    const testInfo = TEST_TYPES.find((t) => t.id === sess.testType);
                    return (
                      <tr key={sess.id}>
                        <td><strong>{sess.candidateName}</strong></td>
                        <td>
                          <span style={{ background: (CATEGORY_COLORS[testInfo?.category] || '#94a3b8') + '22', color: CATEGORY_COLORS[testInfo?.category] || '#94a3b8', border: `1px solid ${CATEGORY_COLORS[testInfo?.category] || '#e2e8f0'}`, borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>
                            {testInfo?.label || sess.testType}
                          </span>
                        </td>
                        <td>
                          {sess.score !== null
                            ? <span style={{ fontWeight: 800, fontSize: '15px', color: sess.score >= 80 ? '#16a34a' : sess.score >= 60 ? '#f59e0b' : '#dc2626' }}>{sess.score}%</span>
                            : <span style={{ color: '#94a3b8', fontSize: '12px' }}>Profile</span>}
                        </td>
                        <td style={{ fontSize: '12px' }}>{sess.duration}</td>
                        <td style={{ fontSize: '12px' }}>{sess.completedAt}</td>
                        <td>
                          {sess.flagged
                            ? <span className="dashboard-pill dashboard-pill--danger" title={sess.flagReason} style={{ fontSize: '10px', cursor: 'help' }}>⚠ Flagged</span>
                            : <span className="dashboard-pill dashboard-pill--success" style={{ fontSize: '10px' }}>Clean</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Proctoring ── */}
        {activeSection === 'proctoring' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-eye" /> AI Proctoring</h4>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Anti-cheating controls active during live assessments. Review flagged sessions below.</p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {[
                { icon: 'fa-ban', label: 'Tab Switch Detection', description: 'Logs every time the candidate leaves the test tab. 2+ switches trigger a flag.', active: true },
                { icon: 'fa-video-camera', label: 'Webcam Monitoring', description: 'Optional webcam stream captured during the session. Stored for review.', active: true },
                { icon: 'fa-magic', label: 'AI Proctoring', description: 'AI model analyses webcam feed for suspicious movements or multiple faces.', active: true },
                { icon: 'fa-clock-o', label: 'Timed Tests', description: 'All tests are strictly timed. Auto-submit triggers when the timer expires.', active: true },
                { icon: 'fa-copy', label: 'Copy-Paste Blocking', description: 'Copy and paste is disabled in open-text answer fields during the test.', active: false },
              ].map((control) => (
                <div key={control.label} style={{ flex: '1 1 220px', background: '#fff', border: `1px solid ${control.active ? '#a7f3d0' : '#e2e8f0'}`, borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <i className={`fa ${control.icon}`} style={{ color: control.active ? '#16a34a' : '#94a3b8', fontSize: '16px' }} />
                    <strong style={{ fontSize: '13px' }}>{control.label}</strong>
                    <span className={`dashboard-pill ${control.active ? 'dashboard-pill--success' : 'dashboard-pill--warning'}`} style={{ fontSize: '10px', marginLeft: 'auto' }}>{control.active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{control.description}</p>
                </div>
              ))}
            </div>

            <h5>Flagged Sessions</h5>
            {sessions.filter((s) => s.flagged).length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>No flagged sessions at this time.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sessions.filter((s) => s.flagged).map((sess) => (
                  <div key={sess.id} style={{ background: '#fff', border: '1px solid #fca5a5', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <strong>{sess.candidateName}</strong>
                        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '10px' }}>{sess.testType} · {sess.completedAt}</span>
                      </div>
                      <span className="dashboard-pill dashboard-pill--danger" style={{ fontSize: '10px' }}>⚠ Flagged</span>
                    </div>
                    {sess.flagReason && <div style={{ marginTop: '8px', fontSize: '12px', color: '#dc2626', fontWeight: 600 }}><i className="fa fa-exclamation-triangle" /> {sess.flagReason}</div>}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Question Bank ── */}
        {activeSection === 'bank' && (
          <section className="user-management__section">
            <h4 className="dashboard-section-heading"><i className="fa fa-list" /> Question Bank</h4>

            <div className="user-management__card-form">
              <h5>Add Custom Question</h5>
              <form style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} onSubmit={handleAddQuestion}>
                <textarea className="fo-input" placeholder="Question text" value={newQForm.q} onChange={(e) => setNewQForm((p) => ({ ...p, q: e.target.value }))} required style={{ flex: '3 1 100%', minHeight: '60px', resize: 'vertical' }} />
                <select className="fo-input" value={newQForm.type} onChange={(e) => setNewQForm((p) => ({ ...p, type: e.target.value }))} style={{ flex: '1 1 130px' }}>
                  {TEST_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                <select className="fo-input" value={newQForm.difficulty} onChange={(e) => setNewQForm((p) => ({ ...p, difficulty: e.target.value }))} style={{ flex: '1 1 110px' }}>
                  {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
                </select>
                <input className="fo-input" type="number" min="1" placeholder="Points" value={newQForm.points} onChange={(e) => setNewQForm((p) => ({ ...p, points: e.target.value }))} style={{ flex: '0 1 80px' }} />
                <input className="fo-input" placeholder="Options (comma-separated, leave blank for open text)" value={newQForm.options} onChange={(e) => setNewQForm((p) => ({ ...p, options: e.target.value }))} style={{ flex: '2 1 280px' }} />
                <input className="fo-input" placeholder="Correct answer (if MCQ)" value={newQForm.answer} onChange={(e) => setNewQForm((p) => ({ ...p, answer: e.target.value }))} style={{ flex: '1 1 160px' }} />
                <button type="submit" className="btn btn-primary btn-sm">Add Question</button>
              </form>
            </div>

            <div style={{ display: 'flex', gap: '8px', margin: '16px 0', flexWrap: 'wrap' }}>
              <button type="button" className={`btn btn-sm ${qbFilter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setQbFilter('all')}>All ({Object.values(QUESTION_BANK).flat().length + customQuestions.length})</button>
              {TEST_TYPES.map((t) => {
                const count = (QUESTION_BANK[t.id] || []).length + customQuestions.filter((q) => q.type === t.id).length;
                if (count === 0) return null;
                return <button key={t.id} type="button" className={`btn btn-sm ${qbFilter === t.id ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setQbFilter(t.id)}>{t.label} ({count})</button>;
              })}
            </div>

            <div className="user-management__table-wrapper">
              <table className="user-management__table">
                <thead>
                  <tr><th>Question</th><th>Type</th><th>Difficulty</th><th>Points</th><th>Format</th></tr>
                </thead>
                <tbody>
                  {allQuestions.map((q) => {
                    const testInfo = TEST_TYPES.find((t) => t.id === q.type);
                    return (
                      <tr key={q.id}>
                        <td style={{ maxWidth: '360px', fontSize: '12px' }}>{q.q}</td>
                        <td><span style={{ background: (CATEGORY_COLORS[testInfo?.category] || '#94a3b8') + '22', color: CATEGORY_COLORS[testInfo?.category] || '#94a3b8', border: `1px solid ${CATEGORY_COLORS[testInfo?.category] || '#e2e8f0'}`, borderRadius: '4px', padding: '1px 7px', fontSize: '10px', fontWeight: 600 }}>{testInfo?.label || q.type}</span></td>
                        <td><span style={{ fontSize: '11px', fontWeight: 700, color: q.difficulty === 'Hard' ? '#dc2626' : q.difficulty === 'Medium' ? '#f59e0b' : '#16a34a' }}>{q.difficulty}</span></td>
                        <td style={{ fontWeight: 700, color: '#3b82f6' }}>{q.points}</td>
                        <td style={{ fontSize: '11px', color: '#64748b' }}>{q.options?.length > 0 ? 'MCQ' : 'Open text'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default EnterpriseAssessment;
