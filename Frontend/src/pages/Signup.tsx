import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/Navbar';
import Footer from '../components/Footer';

interface FormData {
  email: string;
  password: string;
  relationToChild: string;
  childName: string;
  childDob: string;
  condition: string[];
  dyslexiaTypes: string[];
  otherConditionText: string;
  severity: string;
  specifications: string;
  interests: string[];
  learningAreas: string[];
  learningGoals: string;
  agreeToTerms: boolean;
}

const relationOptions = ["Parent", "Guardian", "Therapist", "Educator", "Other"];
const conditionOptions = [
  "Dyslexia",
  "Learning Difficulty",
  "Reading Difficulty",
  "Other"
];

const dyslexiaTypeOptions = [
  "Phonological Dyslexia",
  "Surface Dyslexia",
  "Rapid Naming Deficit",
  "Double Deficit Dyslexia"
];

const severityOptions = ["Mild", "Moderate", "Severe"];

const interestOptions = [
  "Reading", "Art & Craft", "Music", "Sports", "Gaming", "Science", "Nature", "Cooking", "Coding", "Writing"
];

const learningAreaOptions = [
  "Reading Comprehension", "Writing Skills", "Mathematics", "Speech & Language", "Social Skills", "Motor Skills", "Attention & Focus", "Memory"
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    email: '',
    password: '',
    relationToChild: '',
    childName: '',
    childDob: '',
    condition: [],
    dyslexiaTypes: [],
    otherConditionText: '',
    severity: '',
    specifications: '',
    interests: [],
    learningAreas: [],
    learningGoals: '',
    agreeToTerms: false,
  });

  const [calculatedChildAge, setCalculatedChildAge] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [relationError, setRelationError] = useState('');
  const [childNameError, setChildNameError] = useState('');
  const [childDobError, setChildDobError] = useState('');
  const [conditionError, setConditionError] = useState('');
  const [severityError, setSeverityError] = useState('');
  const [agreeToTermsError, setAgreeToTermsError] = useState('');

  const [step, setStep] = useState(1);

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }

    if (name === 'childDob') {
      setCalculatedChildAge(calculateAge(value));
    }

    if (name === 'email') setEmailError('');
    if (name === 'password') setPasswordError('');
    if (name === 'relationToChild') setRelationError('');
    if (name === 'childName') setChildNameError('');
    if (name === 'childDob') setChildDobError('');
    if (name === 'severity') setSeverityError('');
    if (name === 'agreeToTerms') setAgreeToTermsError('');
    setError('');
  };

  const handleConditionToggle = (condition: string) => {
    setForm(prev => {
      const updatedConditions = prev.condition.includes(condition)
        ? prev.condition.filter(c => c !== condition)
        : [...prev.condition, condition];
      return { ...prev, condition: updatedConditions };
    });
    setConditionError(''); 
  };

  const handleDyslexiaTypeToggle = (type: string) => {
    setForm(prev => ({
      ...prev,
      dyslexiaTypes: prev.dyslexiaTypes.includes(type)
        ? prev.dyslexiaTypes.filter(t => t !== type)
        : [...prev.dyslexiaTypes, type]
    }));
  };

  const handleMultiSelectToggle = (
    item: string,
    stateKey: 'interests' | 'learningAreas'
  ) => {
    setForm(prev => ({
      ...prev,
      [stateKey]: prev[stateKey].includes(item)
        ? prev[stateKey].filter(i => i !== item)
        : [...prev[stateKey], item]
    }));
  };

  const nextStep = () => {
    setError(''); 

    if (step === 1) {
      let hasError = false;
      if (!form.email) {
        setEmailError('Email is required.');
        hasError = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setEmailError('Invalid email format.');
        hasError = true;
      } else {
        setEmailError('');
      }
      if (!form.password) {
        setPasswordError('Password is required.');
        hasError = true;
      } else if (form.password.length < 6) {
        setPasswordError('Password must be at least 6 characters.');
        hasError = true;
      } else {
        setPasswordError('');
      }
      if (!form.relationToChild) {
        setRelationError('Relation to child is required.');
        hasError = true;
      } else {
        setRelationError('');
      }
      if (hasError) {
          setError('Please correct the errors in Step 1 to proceed.');
          return;
      }
    }

    if (step === 2) {
      let hasError = false;
      if (!form.childName) {
        setChildNameError("Child's name is required.");
        hasError = true;
      } else {
        setChildNameError('');
      }
      if (!form.childDob) {
        setChildDobError("Child's Date of Birth is required.");
        hasError = true;
      } else {
        setChildDobError('');
      }
      if (form.condition.length === 0) {
        setConditionError("Please select at least one condition.");
        hasError = true;
      } else if (form.condition.includes("Other") && !form.otherConditionText.trim()) {
        setConditionError("Please describe the 'Other' condition.");
        hasError = true;
      }
      else {
        setConditionError('');
      }
      if (!form.severity) {
        setSeverityError("Severity is required.");
        hasError = true;
      } else {
        setSeverityError('');
      }
      if (hasError) {
          setError('Please correct the errors in Step 2 to proceed.');
          return;
      }
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setEmailError('');
    setPasswordError('');
    setRelationError('');
    setChildNameError('');
    setChildDobError('');
    setConditionError('');
    setSeverityError('');
    setAgreeToTermsError('');
    setStep(step - 1);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAgreeToTermsError('');

    if (step === 4) {
        if (!form.agreeToTerms) {
            setAgreeToTermsError('You must agree to the Terms and Privacy Policy to complete signup.');
            setLoading(false);
            setError('Please agree to the Terms and Privacy Policy.'); 
            return;
        }
    }

    try {
      const dataToSubmit = {
        email: form.email,
        password: form.password,
        relationToChild: form.relationToChild,
        childName: form.childName,
        childDob: form.childDob,
        condition: form.condition,
        dyslexiaTypes: form.condition.includes("Dyslexia") ? form.dyslexiaTypes : [],
        otherConditionText: form.condition.includes("Other") ? form.otherConditionText : '',
        severity: form.severity,
        specifications: form.specifications,
        interests: form.interests,
        learningAreas: form.learningAreas,
        learningGoals: form.learningGoals,
        agreeToTerms: form.agreeToTerms
      };

      console.log('Sending signup data:', JSON.stringify(dataToSubmit, null, 2));

      const response = await fetch('https://zeen-1nln.onrender.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(`Server responded with status ${response.status}, but no valid JSON. Please try again.`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed.');
      }

      console.log('Signup successful:', data);

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      navigate('/personalize');

    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out";
  const buttonClass = "w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 shadow-md";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full text-black">
      <Navigation />
      <main className="flex-grow flex justify-center w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out transform mt-20 mb-20 border border-gray-200 py-6">
          <div className="px-6">
            <h2 className="text-3xl font-extrabold text-gray-800 text-center tracking-tight">Welcome to <span className="text-purple-600">Zeen</span></h2>
            <p className="text-gray-500 text-center mt-2 text-sm">
              Create your account to get started or <Link to="/login" className="text-purple-600 italic font-bold hover:underline"> Login</Link>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex justify-center py-4 px-6">
            <div className="flex items-center w-full max-w-sm">
              {[1, 2, 3, 4].map((stepNum, index) => (
                <React.Fragment key={stepNum}>
                  <div key={`circle-${stepNum}`} className={`relative flex items-center justify-center w-8 h-8 rounded-full text-white font-bold transition-all duration-300 ease-in-out
                    ${step > stepNum ? 'bg-green-500' : step === stepNum ? 'bg-purple-800' : 'bg-gray-300'}`}>
                    {step > stepNum ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </div>
                  {index < 3 && (
                    <div key={`line-${stepNum}`} className={`flex-1 h-1 ${step > stepNum ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-300`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="px-6 pb-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded animate-fadeIn flex items-center">
                <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-xl font-bold text-blue-600">Step 1: Your Details</h3>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-indigo-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      placeholder="your.email@example.com"
                      className={inputClass}
                      onChange={handleChange}
                      required
                    />
                    {emailError && <p className="text-red-500 text-xs italic mt-1">{emailError}</p>}
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-indigo-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={form.password}
                        placeholder="Create a secure password"
                        className={`${inputClass} pr-12`}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-purple-600 font-bold hover:text-purple-800 focus:outline-none"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                    {passwordError && <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>}
                  </div>
                  <div>
                    <label htmlFor="relationToChild" className="block text-sm font-medium text-indigo-700 mb-1">Relation to Child</label>
                    <select
                      id="relationToChild"
                      name="relationToChild"
                      value={form.relationToChild}
                      className={inputClass}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select your relation</option>
                      {relationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {relationError && <p className="text-red-500 text-xs italic mt-1">{relationError}</p>}
                  </div>
                  <button
                    type="button"
                    className={buttonClass}
                    onClick={nextStep}
                  >
                    Next
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-xl font-bold text-blue-600">Step 2: Child's Details</h3>
                  <div>
                    <label htmlFor="childName" className="block text-sm font-medium text-indigo-700 mb-1">Child's Name</label>
                    <input
                      type="text"
                      id="childName"
                      name="childName"
                      value={form.childName}
                      placeholder="Child's name"
                      className={inputClass}
                      onChange={handleChange}
                      required
                    />
                    {childNameError && <p className="text-red-500 text-xs italic mt-1">{childNameError}</p>}
                  </div>
                  <div>
                    <label htmlFor="childDob" className="block text-sm font-medium text-indigo-700 mb-1">Child's Date of Birth</label>
                    <input
                      type="date"
                      id="childDob"
                      name="childDob"
                      value={form.childDob}
                      className={inputClass}
                      onChange={handleChange}
                      required
                    />
                    {calculatedChildAge && <p className="text-sm text-gray-600 mt-1">Calculated Age: {calculatedChildAge} years</p>}
                    {childDobError && <p className="text-red-500 text-xs italic mt-1">{childDobError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-2">Condition (Select all that apply)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {conditionOptions.map(condition => (
                        <label key={condition} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={form.condition.includes(condition)}
                            onChange={() => handleConditionToggle(condition)}
                            className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span>{condition}</span>
                        </label>
                      ))}
                    </div>
                    {conditionError && <p className="text-red-500 text-xs italic mt-1">{conditionError}</p>}
                    {form.condition.includes("Dyslexia") && (
                      <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <p className="block text-sm font-medium text-gray-700 mb-2">Types of Dyslexia</p>
                        <div className="grid grid-cols-2 gap-2">
                          {dyslexiaTypeOptions.map(type => (
                            <label key={type} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={form.dyslexiaTypes.includes(type)}
                                onChange={() => handleDyslexiaTypeToggle(type)}
                                className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <span>{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    {form.condition.includes("Other") && (
                      <div className="mt-4">
                        <label htmlFor="otherConditionText" className="block text-sm font-medium text-indigo-700 mb-1">Please specify 'Other' condition:</label>
                        <textarea
                          id="otherConditionText"
                          name="otherConditionText"
                          value={form.otherConditionText}
                          onChange={handleChange}
                          rows={2}
                          className={`${inputClass} resize-none`}
                          placeholder="e.g., Rare Genetic Disorder"
                        ></textarea>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-2">Severity</label>
                    <div className="flex gap-4">
                      {severityOptions.map(severity => (
                        <label key={severity} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="severity"
                            value={severity}
                            checked={form.severity === severity}
                            onChange={handleChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span>{severity}</span>
                        </label>
                      ))}
                    </div>
                    {severityError && <p className="text-red-500 text-xs italic mt-1">{severityError}</p>}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="w-1/2 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className={buttonClass}
                      onClick={nextStep}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-xl font-bold text-blue-600">Step 3: Additional Information</h3>
                  <div>
                    <label htmlFor="specifications" className="block text-sm font-medium text-indigo-700 mb-1">Specifications (Optional)</label>
                    <textarea
                      id="specifications"
                      name="specifications"
                      value={form.specifications}
                      placeholder="Any specific needs, medical considerations, or other relevant details..."
                      className={`${inputClass} h-20 resize-none`}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-2">Interests (Optional)</label>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map(interest => (
                        <button
                          key={interest}
                          type="button"
                          className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-200 ease-in-out
                            ${form.interests.includes(interest)
                              ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'}
                            border border-transparent hover:border-purple-500`}
                          onClick={() => handleMultiSelectToggle(interest, 'interests')}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-2">Learning Areas of Concern (Optional)</label>
                    <div className="flex flex-wrap gap-2">
                      {learningAreaOptions.map(area => (
                        <button
                          key={area}
                          type="button"
                          className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-200 ease-in-out
                            ${form.learningAreas.includes(area)
                              ? 'bg-gradient-to-br from-green-500 to-teal-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'}
                            border border-transparent hover:border-green-400`}
                          onClick={() => handleMultiSelectToggle(area, 'learningAreas')}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="learningGoals" className="block text-sm font-medium text-indigo-700 mb-1">Learning Goals / What do you hope to achieve with Zeen? (Optional)</label>
                    <textarea
                      id="learningGoals"
                      name="learningGoals"
                      value={form.learningGoals}
                      placeholder="E.g., Improve reading fluency, enhance social interaction, develop fine motor skills..."
                      className={`${inputClass} h-24 resize-none`}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="w-1/2 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className={buttonClass}
                      onClick={nextStep}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-bold text-blue-600">Step 4: Review and Confirm</h3>

                  <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-md space-y-4">
                    <h4 className="font-bold text-xl text-purple-800 border-b-2 border-purple-200 pb-2 mb-3">Your Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                      <p><strong className="text-gray-800">Email:</strong> <span className="text-gray-700">{form.email}</span></p>
                      <p><strong className="text-gray-800">Relation to Child:</strong> <span className="text-gray-700">{form.relationToChild}</span></p>
                    </div>

                    <h4 className="font-bold text-xl text-green-700 border-b-2 border-green-200 pb-2 mb-3 mt-6">Child's Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                      <p><strong className="text-gray-800">Name:</strong> <span className="text-gray-700">{form.childName}</span></p>
                      <p><strong className="text-gray-800">Date of Birth:</strong> <span className="text-gray-700">{form.childDob} ({calculatedChildAge} years)</span></p>
                      <p className="col-span-full"><strong className="text-gray-800">Conditions:</strong> <span className="text-gray-700">{form.condition.length > 0 ? form.condition.join(', ') : 'N/A'}</span></p>
                      {form.condition.includes("Dyslexia") && form.dyslexiaTypes.length > 0 && (
                        <p className="col-span-full pl-4"><strong className="text-gray-800">Dyslexia Types:</strong> <span className="text-gray-700">{form.dyslexiaTypes.join(', ')}</span></p>
                      )}
                      {form.condition.includes("Other") && form.otherConditionText && (
                        <p className="col-span-full pl-4"><strong className="text-gray-800">Other Condition:</strong> <span className="text-gray-700">{form.otherConditionText}</span></p>
                      )}
                      <p><strong className="text-gray-800">Severity:</strong> <span className="text-gray-700">{form.severity || 'N/A'}</span></p>
                      <p className="col-span-full"><strong className="text-gray-800">Specifications:</strong> <span className="text-gray-700">{form.specifications || 'None'}</span></p>
                      <p className="col-span-full"><strong className="text-gray-800">Interests:</strong> <span className="text-gray-700">{form.interests.length > 0 ? form.interests.join(', ') : 'None'}</span></p>
                      <p className="col-span-full"><strong className="text-gray-800">Learning Areas of Concern:</strong> <span className="text-gray-700">{form.learningAreas.length > 0 ? form.learningAreas.join(', ') : 'None'}</span></p>
                      <p className="col-span-full"><strong className="text-gray-800">Learning Goals:</strong> <span className="text-gray-700">{form.learningGoals || 'None'}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={form.agreeToTerms}
                      onChange={handleChange}
                      className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="agreeToTerms" className="text-gray-700 text-base">
                      I agree to Zeen's <a href="/terms" className="text-purple-700 hover:underline font-medium" target="_blank" rel="noopener noreferrer">Terms</a> and <a href="/privacy" className="text-purple-700 hover:underline font-medium" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                    </label>
                  </div>
                  {agreeToTermsError && <p className="text-red-500 text-xs italic mt-1">{agreeToTermsError}</p>}

                  {error && (
                    <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-start space-x-3 mb-4">
                      <svg className="h-6 w-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="w-1/2 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className={`w-1/2 ${buttonClass}`}
                      disabled={loading}
                    >
                      {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}