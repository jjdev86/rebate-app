import React, { useEffect, useState } from "react";
import { useUser } from '../context/useUser';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../api";

const steps = [
  "Project Details",
  "Equipment Details",
  "Attachments",
  "Review & Submit",
];

const NewApplication = () => {
  const { user } = useUser();
  const { id: applicationId } = useParams();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [sameAsInstall, setSameAsInstall] = useState(false);
  const [form, setForm] = useState({
    customerFirstName: user?.firstName || "",
    customerLastName: user?.lastName || "",
    email: user?.email || "",
    installAddress: "",
    installZip: "",
    installCity: "",
    installState: "",
    mailingAddress: "",
    mailingZip: "",
    mailingCity: "",
    mailingState: "",
    phoneNumber: user?.phoneNumber || "",
    claimNumber: applicationId || "",
    equipmentType: "",
    model: "",
    efficiencyRating: "",
    files: [],
    isSameAsInstall: false,
  });
  const [options, setOptions] = useState({
    equipmentTypes: [],
    models: [],
    efficiencyRatings: [],
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.get("/config/application-options");
        setOptions(response.data);
      } catch (error) {
        console.error("Error fetching product options:", error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customerFirstName: user.firstName || "",
        customerLastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (applicationId) {
      setForm((prev) => ({ ...prev, claimNumber: applicationId }));
    }
  }, [applicationId]);

  useEffect(() => {
    // If application data is passed via navigation, map it into the form
    if (location.state && location.state.application) {
      const app = location.state.application;
      let mappedProductId = app.productId;
      let mappedModel = app.model;
      let mappedEquipmentType = app.equipmentType;
      let mappedEfficiencyRating = app.efficiencyRating;
      if (options.models && Array.isArray(options.models) && mappedProductId) {
        const foundModel = options.models.find(m => typeof m === 'object' && m.id === mappedProductId);
        if (foundModel) {
          mappedModel = foundModel.modelNumber;
          if (foundModel.type) mappedEquipmentType = foundModel.type;
          // If you add efficiencyRating to Product in the future, map it here
        }
      }
      setForm(prev => ({
        ...prev,
        ...app,
        productId: mappedProductId,
        model: mappedModel,
        equipmentType: mappedEquipmentType,
        efficiencyRating: mappedEfficiencyRating,
        email: app.email || user?.email || '',
        files: app.files || [],
        claimNumber: app.claimNumber || app.id || "",
        isSameAsInstall: app.isSameAsInstall || false,
      }));
      setSameAsInstall(!!app.isSameAsInstall);
    } else if (applicationId) {
      // If no state, fetch from server
      (async () => {
        try {
          const res = await api.get(`/applications/${applicationId}`);
          const app = res.data;
          let mappedProductId = app.productId;
          let mappedModel = app.model;
          let mappedEquipmentType = app.equipmentType;
          let mappedEfficiencyRating = app.efficiencyRating;
          if (options.models && Array.isArray(options.models) && mappedProductId) {
            const foundModel = options.models.find(m => typeof m === 'object' && m.id === mappedProductId);
            if (foundModel) {
              mappedModel = foundModel.modelNumber;
              if (foundModel.type) mappedEquipmentType = foundModel.type;
              // If you add efficiencyRating to Product in the future, map it here
            }
          }
          setForm(prev => ({
            ...prev,
            ...app,
            productId: mappedProductId,
            model: mappedModel,
            equipmentType: mappedEquipmentType,
            efficiencyRating: mappedEfficiencyRating,
            email: app.email || user?.email || '',
            files: app.files || [],
            claimNumber: app.claimNumber || app.id || "",
            isSameAsInstall: app.isSameAsInstall || false,
          }));
          setSameAsInstall(!!app.isSameAsInstall);
        } catch (err) {
          console.error('Failed to fetch application:', err);
        }
      })();
    } else if (user) {
      // If no application data, set from user
      setForm(prev => ({
        ...prev,
        customerFirstName: user.firstName || "",
        customerLastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      }));
    }
  }, [location.state, applicationId, options.models, user]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Special handling for phone number to format it
    if (name === "phoneNumber") {
      // Remove all non-digits
      value = value.replace(/\D/g, '');
      // Only allow up to 10 digits
      if (value.length > 10) value = value.slice(0, 10);
      // Format as (xxx) xxx-xxxx
      if (value.length > 0) {
        value = `(${value}`;
        if (value.length > 4) value = value.slice(0, 4) + ') ' + value.slice(4);
        if (value.length > 9) value = value.slice(0, 9) + '-' + value.slice(9);
      }
    }

    // Cap state fields to 2 characters
    if (name === "installState" || name === "mailingState") {
      value = value.slice(0, 2);
    }

    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Handler for equipment type change
  const handleEquipmentTypeChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      equipmentType: value,
      model: '',
      productId: '',
      efficiencyRating: ''
    }));
  };

  // Handler for model change
  const handleModelChange = (e) => {
    const value = e.target.value;
    let selected = null;
    if (options.models && Array.isArray(options.models)) {
      selected = options.models.find(m => (typeof m === 'object' && m.id === value) || m === value);
    }
    setForm((prev) => ({
      ...prev,
      model: selected && typeof selected === 'object' ? selected.modelNumber : (selected || ''),
      productId: selected && typeof selected === 'object' ? selected.id : value,
    }));
  };

  // Validation for step 1 fields (except claimNumber)
  const validateStep1 = () => {
    const newErrors = {};
    if (!form.customerFirstName || !form.customerFirstName.trim()) newErrors.customerFirstName = 'First name is required';
    if (!form.customerLastName || !form.customerLastName.trim()) newErrors.customerLastName = 'Last name is required';
    // Only check for null/undefined email, not empty string
    if (form.email == null) newErrors.email = 'Customer email is required';
    if (!form.installAddress || !form.installAddress.trim()) newErrors.installAddress = 'Install address is required';
    if (!form.installCity || !form.installCity.trim()) newErrors.installCity = 'Install city is required';
    if (!form.installState || !form.installState.trim()) newErrors.installState = 'Install state is required';
    if (!form.installZip || !form.installZip.trim()) newErrors.installZip = 'Install zip is required';
    if (!form.mailingAddress || !form.mailingAddress.trim()) newErrors.mailingAddress = 'Mailing address is required';
    if (!form.mailingCity || !form.mailingCity.trim()) newErrors.mailingCity = 'Mailing city is required';
    if (!form.mailingState || !form.mailingState.trim()) newErrors.mailingState = 'Mailing state is required';
    if (!form.mailingZip || !form.mailingZip.trim()) newErrors.mailingZip = 'Mailing zip is required';
    if (!form.phoneNumber || !form.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    // Phone number: (123) 456-7890
    else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(form.phoneNumber)) newErrors.phoneNumber = 'Format: (123) 456-7890';
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.equipmentType) newErrors.equipmentType = 'Equipment type is required';
    if (!form.productId) newErrors.model = 'Model is required';
    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!form.files || form.files.length === 0) newErrors.files = 'At least one document must be uploaded';
    return newErrors;
  };

  const saveProgress = async () => {
    if (applicationId) {
      try {
        await api.put(`/applications/${applicationId}`, form);
      } catch (err) {
        console.error('Failed to save application progress:', err);
      }
    }
  };

  const nextStep = async () => {
    let validationErrors = {};
    if (step === 1) {
      validationErrors = validateStep1();
    } else if (step === 2) {
      validationErrors = validateStep2();
    } else if (step === 3) {
      validationErrors = validateStep3();
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // Equipment Details step: send productId to application
    if (step === 2 && applicationId) {
      // Only send productId if it is a valid UUID (from model object)
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      if (!form.productId || !uuidRegex.test(form.productId)) {
        setErrors({ ...errors, model: 'Please select a valid model number.' });
        console.warn('Invalid productId:', form.productId, 'Form:', form, 'Options:', options.models);
        return;
      }
      await api.put(`/applications/${applicationId}`, { ...form, productId: form.productId });
    } else {
      await saveProgress();
    }
    setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    await api.put(`/applications/${applicationId}`, { ...form, status: 'submitted' });
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
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="label">First Name</label>
                <input
                  name="customerFirstName"
                  className="input mt-1"
                  value={form.customerFirstName}
                  onChange={handleChange}
                />
                {errors.customerFirstName && <div className="text-red-500 text-xs mt-1">{errors.customerFirstName}</div>}
              </div>
              <div className="flex-1">
                <label className="label">Last Name</label>
                <input
                  name="customerLastName"
                  className="input mt-1"
                  value={form.customerLastName}
                  onChange={handleChange}
                />
                {errors.customerLastName && <div className="text-red-500 text-xs mt-1">{errors.customerLastName}</div>}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <div className="flex-1">
                <label className="label">Email</label>
                <input
                  name="email"
                  className="input mt-1 bg-gray-100 cursor-not-allowed"
                  value={form.email}
                  onChange={handleChange}
                  readOnly
                />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>
              <div className="flex-1">
                <label className="label">Phone Number</label>
                <input
                  name="phoneNumber"
                  className="input mt-1"
                  value={form.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phoneNumber && <div className="text-red-500 text-xs mt-1">{errors.phoneNumber}</div>}
              </div>
            </div>
            {/* Install Address Fields */}
            <label className="label mt-4">Install Address</label>
            <input
              name="installAddress"
              className="input mt-1"
              value={form.installAddress}
              onChange={handleChange}
            />
            {errors.installAddress && <div className="text-red-500 text-xs mt-1">{errors.installAddress}</div>}
            <div className="flex gap-2 mt-2">
              <div className="flex-1">
                <label className="label">City</label>
                <input
                  name="installCity"
                  className="input mt-1"
                  value={form.installCity}
                  onChange={handleChange}
                />
                {errors.installCity && <div className="text-red-500 text-xs mt-1">{errors.installCity}</div>}
              </div>
              <div className="flex-1">
                <label className="label">State</label>
                <input
                  name="installState"
                  className="input mt-1"
                  value={form.installState}
                  onChange={handleChange}
                />
                {errors.installState && <div className="text-red-500 text-xs mt-1">{errors.installState}</div>}
              </div>
              <div className="flex-1">
                <label className="label">Zip</label>
                <input
                  name="installZip"
                  className="input mt-1"
                  value={form.installZip}
                  onChange={handleChange}
                />
                {errors.installZip && <div className="text-red-500 text-xs mt-1">{errors.installZip}</div>}
              </div>
            </div>


            {/* Divider and Checkbox */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="mx-4 text-gray-500">Mailing Address</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={sameAsInstall}
                  onChange={e => {
                    const checked = e.target.checked;
                    setSameAsInstall(checked);
                    setForm(f => ({
                      ...f,
                      isSameAsInstall: checked,
                      ...(checked ? {
                        mailingAddress: f.installAddress,
                        mailingCity: f.installCity,
                        mailingState: f.installState,
                        mailingZip: f.installZip
                      } : {})
                    }));
                  }}
                />
                <span className="ml-2 text-sm">Mailing address is the same as install address</span>
              </label>
            </div>

            {/* Mailing Address Fields */}
            <label className="label mt-2">Mailing Address</label>
            <input
              name="mailingAddress"
              className="input mt-1"
              value={form.mailingAddress}
              onChange={handleChange}
              disabled={sameAsInstall}
            />
            {errors.mailingAddress && <div className="text-red-500 text-xs mt-1">{errors.mailingAddress}</div>}
            <div className="flex gap-2 mt-2">
              <div className="flex-1">
                <label className="label">City</label>
                <input
                  name="mailingCity"
                  className="input mt-1"
                  value={form.mailingCity}
                  onChange={handleChange}
                  disabled={sameAsInstall}
                />
                {errors.mailingCity && <div className="text-red-500 text-xs mt-1">{errors.mailingCity}</div>}
              </div>
              <div className="flex-1">
                <label className="label">State</label>
                <input
                  name="mailingState"
                  className="input mt-1"
                  value={form.mailingState}
                  onChange={handleChange}
                  disabled={sameAsInstall}
                />
                {errors.mailingState && <div className="text-red-500 text-xs mt-1">{errors.mailingState}</div>}
              </div>
              <div className="flex-1">
                <label className="label">Zip</label>
                <input
                  name="mailingZip"
                  className="input mt-1"
                  value={form.mailingZip}
                  onChange={handleChange}
                  disabled={sameAsInstall}
                />
                {errors.mailingZip && <div className="text-red-500 text-xs mt-1">{errors.mailingZip}</div>}
              </div>
            </div>


            {/* Claim Number (read-only for now) */}
            <label className="label mt-4">Claim Number</label>
            <input
              name="claimNumber"
              className="input mt-1 bg-gray-100 cursor-not-allowed"
              value={form.claimNumber}
              readOnly
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
              onChange={handleEquipmentTypeChange}
              className="input mt-1"
            >
              <option value="">Select</option>
              {options.equipmentTypes.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.equipmentType && <div className="text-red-500 text-xs mt-1">{errors.equipmentType}</div>}

            <label className="label mt-4">Model</label>
            <select
              name="productId"
              value={form.productId || ''}
              onChange={handleModelChange}
              className="input mt-1"
            >
              <option value="">Select</option>
              {options.models.map((opt) => (
                typeof opt === 'object' ? (
                  <option key={opt.id} value={opt.id}>
                    {opt.modelNumber}
                  </option>
                ) : (
                  <option key={opt} value={opt}>{opt}</option>
                )
              ))}
            </select>
            {errors.model && <div className="text-red-500 text-xs mt-1">{errors.model}</div>}

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
              onChange={async e => {
                const files = Array.from(e.target.files);
                for (const file of files) {
                  // 1. Request presigned URL
                  let presignRes;
                  try {
                    presignRes = await api.post(`/applications/${applicationId}/files/presign`, {
                      filename: file.name,
                      contentType: file.type,
                      size: file.size
                    });
                  } catch {
                    alert('Failed to get upload URL for ' + file.name);
                    continue;
                  }
                  const { uploadUrl, s3Key, publicUrl } = presignRes.data;
                  console.log('Presign response:', presignRes.data);
                  // 2. Upload to S3
                  try {
                    await fetch(uploadUrl, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': file.type
                      },
                      body: file
                    });
                  } catch {
                    alert('Failed to upload to S3 for ' + file.name);
                    continue;
                  }
                  // 3. Save metadata
                  try {
                    await api.post(`/applications/${applicationId}/files`, {
                      s3Key,
                      publicUrl,
                      filename: file.name,
                      contentType: file.type,
                      size: file.size
                    });
                  } catch (err) {
                    console.error('Failed to save file metadata:', err);
                    alert('Failed to save file metadata for ' + file.name);
                    continue;
                  }
                }
                // 4. Refresh file list
                try {
                  const res = await api.get(`/applications/${applicationId}/files`);
                  console.log('Updated file list:', res.data);
                  setForm(f => ({ ...f, files: res.data }));
                } catch {
                  alert('Failed to refresh file list');
                }
              }}
            />
            {form.files.length > 0 && (
              <ul className="text-sm mt-3 bg-gray-100 p-3 rounded">
                {form.files.map((f) => {
                  const url = f.url || f.publicUrl;
                  return (
                    <li key={f.id || f.name} className="flex items-center gap-3 mb-2 last:mb-0">
                      <span>{f.filename || f.name}</span>
                      <span className="text-gray-500 ml-1">({((f.size || f.sizeBytes || 0)/1024).toFixed(1)} KB)</span>
                      {url && (
                        <>
                          <button
                            className="ml-2 text-blue-600 underline"
                            onClick={async () => {
                              try {
                                const res = await api.get(`/applications/${applicationId}/files/${f.id}/presign-view`);
                                window.open(res.data.url, '_blank', 'noopener');
                              } catch {
                                alert('Failed to get view URL');
                              }
                            }}
                          >View</button>
                          <button
                            className="ml-2 text-red-600 underline"
                            onClick={async () => {
                              if (!window.confirm('Delete this file?')) return;
                              try {
                                await api.delete(`/applications/${applicationId}/files/${f.id}`);
                                // Refresh file list
                                const res = await api.get(`/applications/${applicationId}/files`);
                                setForm(prev => ({ ...prev, files: res.data }));
                              } catch (err) {
                                alert('Failed to delete file');
                              }
                            }}
                          >Delete</button>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            {errors.files && <div className="text-red-500 text-xs mt-1">{errors.files}</div>}

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
          <h2 className="text-lg font-semibold text-[#1E2A5A">
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
