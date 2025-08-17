import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const steps = ['Project Details', 'Equipment Details', 'Review & Submit'];

const NewApplication = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    claimNumber: '',
    equipmentType: '',
    model: '',
    efficiencyRating: '',
    rebateAmount: '',
    notes: '',
    files: []
  });

  const [options, setOptions] = useState({
    equipmentTypes: [],
    models: [],
    efficiencyRatings: []
  });

  const navigate = useNavigate();

  // Load dropdown options
  useEffect(() => {
    const fetchOptions = async () => {
      const res = await api.get('/config/application-options');
      setOptions(res.data);
    };
    fetchOptions();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    await api.post('/applications', form);
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">Project Details</h2>
            <input
              name="customerName"
              className="input mb-3"
              placeholder="Customer Name"
              value={form.customerName}
              onChange={handleChange}
            />
            <input
              name="customerEmail"
              className="input mb-3"
              placeholder="Customer Email"
              value={form.customerEmail}
              onChange={handleChange}
            />
            <input
              name="claimNumber"
              className="input"
              placeholder="Claim Number"
              value={form.claimNumber}
              onChange={handleChange}
            />
            <button onClick={nextStep} className="btn-primary mt-4 w-full">Next</button>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">Equipment Details</h2>
            <select name="equipmentType" value={form.equipmentType} onChange={handleChange} className="input mb-3">
              <option value="">Select equipment type</option>
              {options.equipmentTypes.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <select name="model" value={form.model} onChange={handleChange} className="input mb-3">
              <option value="">Select model</option>
              {options.models.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <select name="efficiencyRating" value={form.efficiencyRating} onChange={handleChange} className="input">
              <option value="">Select efficiency</option>
              {options.efficiencyRatings.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <div className="flex justify-between mt-4">
              <button onClick={prevStep} className="btn-secondary">Back</button>
              <button onClick={nextStep} className="btn-primary">Next</button>
            </div>
          </>
        );

      case 3:
      default:
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">Review & Submit</h2>
            <pre className="bg-gray-100 p-3 rounded text-sm mb-4">{JSON.stringify(form, null, 2)}</pre>
            <div className="flex justify-between">
              <button onClick={prevStep} className="btn-secondary">Back</button>
              <button onClick={handleSubmit} className="btn-primary">Submit</button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center">
      <div className="bg-white max-w-3xl w-full flex rounded shadow overflow-hidden">

        {/* LEFT – Steps */}
        <div className="w-1/3 border-r p-4 hidden sm:block">
          <ul className="space-y-3">
            {steps.map((label, index) => (
              <li
                key={label}
                className={`${step === index + 1 ? 'font-semibold text-gray-800' : 'text-gray-400'}`}
              >
                {index + 1}. {label}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT – Step Content */}
        <div className="flex-1 p-6">{renderStep()}</div>

      </div>
    </div>
  );
};

export default NewApplication;
