import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const NewApplication = () => {
  const [step, setStep] = useState(1);

  // Form Values
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

  // Dropdown option data
  const [options, setOptions] = useState({
    equipmentTypes: [],
    models: [],
    efficiencyRatings: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('/config/application-options'); // 👈
        setOptions(res.data);
      } catch (err) {
        console.error('Failed to load option data');
      }
    };

    fetchOptions();
  }, []);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Final submit
  const handleSubmit = async () => {
    try {
      await api.post('/applications', form); // you can attach S3 files later
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error submitting application');
    }
  };

  // ------------------------------
  // Step UI (simple switch-case)
  // ------------------------------
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <input
              name="customerName"
              placeholder="Customer Name"
              className="w-full border p-2 rounded mb-3"
              value={form.customerName}
              onChange={handleChange}
            />
            <input
              name="customerEmail"
              placeholder="Customer Email"
              className="w-full border p-2 rounded mb-3"
              value={form.customerEmail}
              onChange={handleChange}
            />
            <input
              name="claimNumber"
              placeholder="Claim Number"
              className="w-full border p-2 rounded"
              value={form.claimNumber}
              onChange={handleChange}
            />
            <button onClick={nextStep} className="mt-4 w-full bg-blue-600 text-white py-2 rounded">
              Next
            </button>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Equipment Details</h2>
            <select
              name="equipmentType"
              className="w-full p-2 border rounded mb-3"
              value={form.equipmentType}
              onChange={handleChange}
            >
              <option value="">Select equipment type</option>
              {options.equipmentTypes.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              name="model"
              className="w-full p-2 border rounded mb-3"
              value={form.model}
              onChange={handleChange}
            >
              <option value="">Select model</option>
              {options.models.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              name="efficiencyRating"
              className="w-full p-2 border rounded mb-3"
              value={form.efficiencyRating}
              onChange={handleChange}
            >
              <option value="">Select efficiency</option>
              {options.efficiencyRatings.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <div className="flex justify-between mt-4">
              <button onClick={prevStep} className="bg-gray-200 py-2 px-4 rounded">Back</button>
              <button onClick={nextStep} className="bg-blue-600 text-white py-2 px-4 rounded">Next</button>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
            <pre className="bg-gray-50 p-3 rounded text-sm mb-4">
              {JSON.stringify(form, null, 2)}
            </pre>
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-200 py-2 px-4 rounded">Back</button>
              <button onClick={handleSubmit} className="bg-green-600 text-white py-2 px-4 rounded">Submit</button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg p-6 rounded shadow">
        {renderStep()}
      </div>
    </div>
  );
};

export default NewApplication;
