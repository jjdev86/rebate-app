import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const steps = [
  "Project Details",
  "Equipment Details",
  "Attachments",
  "Review & Submit",
];

const NewApplication = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    claimNumber: "",
    equipmentType: "",
    model: "",
    efficiencyRating: "",
    files: [],
  });
  const [options, setOptions] = useState({
    equipmentTypes: [],
    models: [],
    efficiencyRatings: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await api.get("/config/application-options");
      setOptions(res.data);
    };
    fetchOptions();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    await api.post("/applications", form);
    navigate("/dashboard");
  };

  const getProgressWidth = () => `${(step / steps.length) * 100}%`;

  const getSupportingText = () => {
    switch (step) {
      case 1:
        return "Enter the project information and details.";
      case 2:
        return "Enter the type of equipment and its details.";
      case 3:
        return "Upload supporting documents for this claim.";
      case 4:
        return "Review the information before submitting.";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label className="label">Customer Name</label>
            <input
              name="customerName"
              className="input mt-1"
              value={form.customerName}
              onChange={handleChange}
            />

            <label className="label mt-4">Customer Email</label>
            <input
              name="customerEmail"
              className="input mt-1"
              value={form.customerEmail}
              onChange={handleChange}
            />

            <label className="label mt-4">Claim Number</label>
            <input
              name="claimNumber"
              className="input mt-1"
              value={form.claimNumber}
              onChange={handleChange}
            />

            <div className="flex justify-end mt-6">
              <button onClick={nextStep} className="btn-primary">
                Next
              </button>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <label className="label">Equipment Type</label>
            <select
              name="equipmentType"
              value={form.equipmentType}
              onChange={handleChange}
              className="input mt-1"
            >
              <option value="">Select</option>
              {options.equipmentTypes.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <label className="label mt-4">Model</label>
            <select
              name="model"
              value={form.model}
              onChange={handleChange}
              className="input mt-1"
            >
              <option value="">Select</option>
              {options.models.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <label className="label mt-4">Efficiency Rating</label>
            <select
              name="efficiencyRating"
              value={form.efficiencyRating}
              onChange={handleChange}
              className="input mt-1"
            >
              <option value="">Select</option>
              {options.efficiencyRatings.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <div className="bg-[#EAF3FF] text-[#1E2A5A] p-4 rounded mt-4 text-sm">
              Eligible for a <strong>$500 rebate</strong>
              <br />
              Rebates are available for energy-efficient heat pumps
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={prevStep} className="btn-secondary">
                Back
              </button>
              <button onClick={nextStep} className="btn-primary">
                Next
              </button>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <label className="label">Attachments</label>
            <input
              type="file"
              multiple
              className="w-full mt-1"
              onChange={(e) =>
                setForm({ ...form, files: Array.from(e.target.files) })
              }
            />
            {form.files.length > 0 && (
              <ul className="text-sm mt-3 bg-gray-100 p-3 rounded">
                {form.files.map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            )}

            <div className="flex justify-between mt-6">
              <button onClick={prevStep} className="btn-secondary">
                Back
              </button>
              <button onClick={nextStep} className="btn-primary">
                Next
              </button>
            </div>
          </>
        );

      default:
        return (
          <>
            <pre className="bg-gray-100 p-3 text-sm rounded mb-6 overflow-auto">
              {JSON.stringify(
                { ...form, files: form.files.map((f) => f.name) },
                null,
                2
              )}
            </pre>

            <div className="flex justify-between">
              <button onClick={prevStep} className="btn-secondary">
                Back
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                Submit
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-[#1E2A5A] mb-6">
        Smart Benefit Claim Portal
      </h1>
      {/* Main Container */}
      <div className="bg-white w-full max-w-5xl rounded shadow flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:block md:w-1/4 border-b md:border-b-0 md:border-r p-6">
          <ul className="relative">
            {steps.map((label, idx) => {
              const number = idx + 1;
              const isActive = number === step;
              const isCompleted = number < step;
              const isLast = idx === steps.length - 1;

              return (
                <li key={label} className="relative pl-10 mb-10 last:mb-0">
                  {/* Centered floating vertical line */}
                  {!isLast && (
                    <span className="absolute left-[11px] top-7 h-8 w-[2px] bg-[#D9D9D9]"></span>
                  )}

                  {/* Step Circle */}
                  <div
                    className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium
            ${
              isCompleted
                ? "bg-[#1E2A5A] text-white"
                : isActive
                ? "bg-[#1E2A5A] text-white"
                : "bg-[#D9D9D9] text-[#6B7280]"
            }`}
                  >
                    {isCompleted ? "✓" : number}
                  </div>

                  {/* Step Label */}
                  <span
                    className={
                      isActive
                        ? "text-[#1E2A5A] font-semibold"
                        : "text-[#6B7280]"
                    }
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Progress Bar */}
          <div className="w-full max-w-5xl mb-6">
            <div className="h-1 w-full bg-gray-200 rounded h-1.5">
              <div
                className="h-1 rounded h-1.5"
                style={{
                  width: getProgressWidth(),
                  backgroundColor: "#0052CC",
                }}
              />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-[#1E2A5A]">
            {steps[step - 1]}
          </h2>
          {getSupportingText() && (
            <p className="text-sm text-gray-500 mb-4">{getSupportingText()}</p>
          )}

          <div className="w-full mt-4 ">{renderStepContent()}</div>
        </main>

      </div>

    </div>
  );
};

export default NewApplication;
