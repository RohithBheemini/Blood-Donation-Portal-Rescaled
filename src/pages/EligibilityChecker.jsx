import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  XCircle,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 'age',
    question: 'Are you between 18 and 65 years of age?',
    explanation: 'Donors must be at least 18 years old to legally consent and physically eligible up to 65 years.'
  },
  {
    id: 'weight',
    question: 'Do you weigh 50 kg (110 lbs) or more?',
    explanation: 'Body weight ensures safe blood volume removal (typically 350ml - 450ml) without causing dizziness.'
  },
  {
    id: 'recentDonation',
    question: 'Have you donated blood within the last 90 days (3 months)?',
    explanation: 'A minimum of 90 days is required between donations for men, and 120 days for women, to restore iron stores.',
    isDisqualifierIfYes: true
  },
  {
    id: 'tattoo',
    question: 'Have you had a tattoo or body piercing in the last 6 months?',
    explanation: 'A temporary deferral of 6 months applies following tattoos/piercings to rule out bloodborne infections.',
    isDisqualifierIfYes: true
  },
  {
    id: 'medication',
    question: 'Are you currently taking oral antibiotics or recovering from flu/fever?',
    explanation: 'You should be completely free of active symptoms and finish antibiotic courses at least 48 hours prior.',
    isDisqualifierIfYes: true
  },
  {
    id: 'surgery',
    question: 'Have you undergone major surgery in the last 6 months?',
    explanation: 'Major surgery requires at least 6 months of complete recovery before donating whole blood.',
    isDisqualifierIfYes: true
  }
];

const EligibilityChecker = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleSelect = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleEvaluate = () => {
    let eligible = true;
    const reasons = [];

    QUESTIONS.forEach(q => {
      const ans = answers[q.id];
      if (q.isDisqualifierIfYes) {
        if (ans === true) {
          eligible = false;
          reasons.push(q.explanation);
        }
      } else {
        if (ans === false) {
          eligible = false;
          reasons.push(q.explanation);
        }
      }
    });

    setResult({ eligible, reasons });
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
  };

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined);

  return (
    <div className="container page-content">
      <div className="page-header-row text-center">
        <div>
          <span className="page-eyebrow">Self-Assessment Tool</span>
          <h1 className="page-title">Blood Donor Eligibility Quiz</h1>
          <p className="page-subtitle">
            Answer 6 quick questions to see if you are medically prepared to donate blood today.
          </p>
        </div>
      </div>

      <div className="eligibility-container">
        {!result ? (
          <div className="quiz-card">
            <div className="questions-list">
              {QUESTIONS.map((q, idx) => (
                <div key={q.id} className="quiz-question-row">
                  <div className="q-number-wrap">
                    <span className="q-num">{idx + 1}</span>
                  </div>
                  <div className="q-content">
                    <h4>{q.question}</h4>
                    <p className="q-hint">{q.explanation}</p>
                  </div>
                  <div className="q-buttons">
                    <button
                      className={`btn-choice ${answers[q.id] === true ? 'selected-yes' : ''}`}
                      onClick={() => handleSelect(q.id, true)}
                    >
                      Yes
                    </button>
                    <button
                      className={`btn-choice ${answers[q.id] === false ? 'selected-no' : ''}`}
                      onClick={() => handleSelect(q.id, false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="quiz-submit-bar">
              <button
                className="btn-primary"
                onClick={handleEvaluate}
                disabled={!allAnswered}
              >
                {allAnswered ? 'Check My Eligibility Now' : 'Please Answer All Questions'}
              </button>
            </div>
          </div>
        ) : (
          <div className={`result-card ${result.eligible ? 'result-eligible' : 'result-deferred'}`}>
            <div className="result-icon-wrap">
              {result.eligible ? (
                <ShieldCheck size={56} className="text-emerald-500" />
              ) : (
                <AlertTriangle size={56} className="text-amber-500" />
              )}
            </div>

            <h2>{result.eligible ? 'You Are Eligible to Donate!' : 'Temporary Deferral Advised'}</h2>
            <p className="result-main-text">
              {result.eligible
                ? 'Great news! Based on your responses, you meet the initial physical and health criteria for voluntary blood donation.'
                : 'Based on standard medical safety guidelines, you may need to wait before donating blood:'}
            </p>

            {!result.eligible && (
              <ul className="deferral-reasons-list">
                {result.reasons.map((r, i) => (
                  <li key={i}>
                    <XCircle size={16} className="text-red-500" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="result-actions">
              {result.eligible ? (
                <Link to="/donate" className="btn-primary">
                  Proceed to Donor Registration <ArrowRight size={16} />
                </Link>
              ) : (
                <Link to="/requests-feed" className="btn-secondary">
                  Share Blood Requests with Friends
                </Link>
              )}
              <button className="btn-outline" onClick={handleReset}>
                <RotateCcw size={16} /> Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EligibilityChecker;
