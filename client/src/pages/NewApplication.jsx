import React, { useEffect, useState } from "react";
import { useUser } from "../context/useUser";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../api";
import {
  SiteHeader,
  SiteFooter,
  CREATOR_NAME,
  CONTACT_EMAIL,
  SOCIAL_LINKS,
} from "../components/SiteChrome";
import ProjectDetailsStep from "../components/ProjectDetailsStep";
import EquipmentDetailsStep from "../components/EquipmentDetailsStep";
import AttachmentsStep from "../components/AttachmentsStep";
import ReviewStep from "../components/ReviewStep";
import StepSidebar from "../components/StepSidebar";

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
        const foundModel = options.models.find(
          (m) => typeof m === "object" && m.id === mappedProductId
        );
        if (foundModel) {
          mappedModel = foundModel.modelNumber;
          if (foundModel.type) mappedEquipmentType = foundModel.type;
          // If you add efficiencyRating to Product in the future, map it here
        }
      }
      setForm((prev) => ({
        ...prev,
        ...app,
        productId: mappedProductId,
        model: mappedModel,
        equipmentType: mappedEquipmentType,
        efficiencyRating: mappedEfficiencyRating,
        email: app.email || user?.email || "",
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
          if (
            options.models &&
            Array.isArray(options.models) &&
            mappedProductId
          ) {
            const foundModel = options.models.find(
              (m) => typeof m === "object" && m.id === mappedProductId
            );
            if (foundModel) {
              mappedModel = foundModel.modelNumber;
              if (foundModel.type) mappedEquipmentType = foundModel.type;
              // If you add efficiencyRating to Product in the future, map it here
            }
          }
          setForm((prev) => ({
            ...prev,
            ...app,
            productId: mappedProductId,
            model: mappedModel,
            equipmentType: mappedEquipmentType,
            efficiencyRating: mappedEfficiencyRating,
            email: app.email || user?.email || "",
            files: app.files || [],
            claimNumber: app.claimNumber || app.id || "",
            isSameAsInstall: app.isSameAsInstall || false,
          }));
          setSameAsInstall(!!app.isSameAsInstall);
        } catch (err) {
          console.error("Failed to fetch application:", err);
        }
      })();
    } else if (user) {
      // If no application data, set from user
      setForm((prev) => ({
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
      value = value.replace(/\D/g, "");
      // Only allow up to 10 digits
      if (value.length > 10) value = value.slice(0, 10);
      // Format as (xxx) xxx-xxxx
      if (value.length > 0) {
        value = `(${value}`;
        if (value.length > 4) value = value.slice(0, 4) + ") " + value.slice(4);
        if (value.length > 9) value = value.slice(0, 9) + "-" + value.slice(9);
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
      model: "",
      productId: "",
      efficiencyRating: "",
    }));
  };

  // Handler for model change
  const handleModelChange = (e) => {
    const value = e.target.value;
    let selected = null;
    if (options.models && Array.isArray(options.models)) {
      selected = options.models.find(
        (m) => (typeof m === "object" && m.id === value) || m === value
      );
    }
    setForm((prev) => ({
      ...prev,
      model:
        selected && typeof selected === "object"
          ? selected.modelNumber
          : selected || "",
      productId: selected && typeof selected === "object" ? selected.id : value,
    }));
  };

  // Validation for step 1 fields (except claimNumber)
  const validateStep1 = () => {
    const newErrors = {};
    if (!form.customerFirstName || !form.customerFirstName.trim())
      newErrors.customerFirstName = "First name is required";
    if (!form.customerLastName || !form.customerLastName.trim())
      newErrors.customerLastName = "Last name is required";
    // Only check for null/undefined email, not empty string
    if (form.email == null) newErrors.email = "Customer email is required";
    if (!form.installAddress || !form.installAddress.trim())
      newErrors.installAddress = "Install address is required";
    if (!form.installCity || !form.installCity.trim())
      newErrors.installCity = "Install city is required";
    if (!form.installState || !form.installState.trim())
      newErrors.installState = "Install state is required";
    if (!form.installZip || !form.installZip.trim())
      newErrors.installZip = "Install zip is required";
    if (!form.mailingAddress || !form.mailingAddress.trim())
      newErrors.mailingAddress = "Mailing address is required";
    if (!form.mailingCity || !form.mailingCity.trim())
      newErrors.mailingCity = "Mailing city is required";
    if (!form.mailingState || !form.mailingState.trim())
      newErrors.mailingState = "Mailing state is required";
    if (!form.mailingZip || !form.mailingZip.trim())
      newErrors.mailingZip = "Mailing zip is required";
    if (!form.phoneNumber || !form.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    // Phone number: (123) 456-7890
    else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(form.phoneNumber))
      newErrors.phoneNumber = "Format: (123) 456-7890";
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.equipmentType)
      newErrors.equipmentType = "Equipment type is required";
    if (!form.productId) newErrors.model = "Model is required";
    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!form.files || form.files.length === 0)
      newErrors.files = "At least one document must be uploaded";
    return newErrors;
  };

  const saveProgress = async () => {
    if (applicationId) {
      try {
        await api.put(`/applications/${applicationId}`, form);
      } catch (err) {
        console.error("Failed to save application progress:", err);
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
      const uuidRegex =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      if (!form.productId || !uuidRegex.test(form.productId)) {
        setErrors({ ...errors, model: "Please select a valid model number." });
        console.warn(
          "Invalid productId:",
          form.productId,
          "Form:",
          form,
          "Options:",
          options.models
        );
        return;
      }
      await api.put(`/applications/${applicationId}`, {
        ...form,
        productId: form.productId,
      });
    } else {
      await saveProgress();
    }
    setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    await api.put(`/applications/${applicationId}`, {
      ...form,
      status: "submitted",
    });
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

  // Step content handlers for children
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      // 1. Request presigned URL
      let presignRes;
      try {
        presignRes = await api.post(
          `/applications/${applicationId}/files/presign`,
          {
            filename: file.name,
            contentType: file.type,
            size: file.size,
          }
        );
      } catch {
        alert("Failed to get upload URL for " + file.name);
        continue;
      }
      const { uploadUrl, s3Key, publicUrl } = presignRes.data;
      try {
        await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
      } catch {
        alert("Failed to upload to S3 for " + file.name);
        continue;
      }
      try {
        await api.post(`/applications/${applicationId}/files`, {
          s3Key,
          publicUrl,
          filename: file.name,
          contentType: file.type,
          size: file.size,
        });
      } catch (err) {
        console.error("Failed to save file metadata:", err);
        alert("Failed to save file metadata for " + file.name);
        continue;
      }
    }
    // 4. Refresh file list
    try {
      const res = await api.get(`/applications/${applicationId}/files`);
      setForm((f) => ({ ...f, files: res.data }));
    } catch {
      alert("Failed to refresh file list");
    }
  };

  const handleViewFile = async (file) => {
    try {
      const res = await api.get(
        `/applications/${applicationId}/files/${file.id}/presign-view`
      );
      window.open(res.data.url, "_blank", "noopener");
    } catch {
      alert("Failed to get view URL");
    }
  };

  // Delete popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const handleDeleteFile = (file) => {
    setFileToDelete(file);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    try {
      const res = await api.delete(
        `/applications/${applicationId}/files/${fileToDelete.id}`,
        { validateStatus: () => true }
      );
      if (res.status === 204) {
        setForm((prev) => ({
          ...prev,
          files: prev.files.filter((f) => f.id !== fileToDelete.id),
        }));
      } else {
        alert("Failed to delete file");
      }
    } catch {
      alert("Failed to delete file");
    }
    setShowDeletePopup(false);
    setFileToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setFileToDelete(null);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ProjectDetailsStep
            values={form}
            errors={errors}
            onChange={handleChange}
            sameAsInstall={sameAsInstall}
            onSameAsInstallChange={(e) => {
              const checked = e.target.checked;
              setSameAsInstall(checked);
              setForm((f) => ({
                ...f,
                isSameAsInstall: checked,
                ...(checked
                  ? {
                      mailingAddress: f.installAddress,
                      mailingCity: f.installCity,
                      mailingState: f.installState,
                      mailingZip: f.installZip,
                    }
                  : {}),
              }));
            }}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <EquipmentDetailsStep
            values={form}
            errors={errors}
            options={options}
            onEquipmentTypeChange={handleEquipmentTypeChange}
            onModelChange={handleModelChange}
            onChange={handleChange}
            onPrev={prevStep}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <AttachmentsStep
            values={form}
            errors={errors}
            onFileChange={handleFileChange}
            onPrev={prevStep}
            onNext={nextStep}
            onView={handleViewFile}
            onDelete={handleDeleteFile}
            showDeletePopup={showDeletePopup}
            fileToDelete={fileToDelete}
            onConfirmDelete={handleConfirmDelete}
            onCancelDelete={handleCancelDelete}
          />
        );
      default:
        return (
          <>
            <div className="mb-6">
              <p className="text-gray-700 text-sm">
                Please review your application details before submitting. Once
                submitted, our team will begin processing your rebate.
              </p>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded p-4 mb-4 shadow-sm">
              <h3 className="text-[#1E2A5A] font-semibold mb-2">
                Customer Info
              </h3>
              <p className="text-sm text-gray-700">
                {form.customerFirstName} {form.customerLastName}
              </p>
              <p className="text-sm text-gray-700">{form.email}</p>
              <p className="text-sm text-gray-700">{form.phoneNumber}</p>
            </div>

            {/* Project Location */}
            <div className="bg-gray-50 rounded p-4 mb-4 shadow-sm">
              <h3 className="text-[#1E2A5A] font-semibold mb-2">
                Project Location
              </h3>
              <p className="text-sm text-gray-700">{form.installAddress}</p>
              <p className="text-sm text-gray-700">
                {form.installCity}, {form.installState} {form.installZip}
              </p>
              <p className="text-sm text-gray-700">
                Claim #: {form.claimNumber}
              </p>
            </div>

            {/* Equipment Info */}
            <div className="bg-gray-50 rounded p-4 mb-6 shadow-sm">
              <h3 className="text-[#1E2A5A] font-semibold mb-2">
                Equipment Info
              </h3>
              <p className="text-sm text-gray-700">
                Type: {form.equipmentType}
              </p>
              <p className="text-sm text-gray-700">Model: {form.model}</p>
              {form.efficiencyRating && (
                <p className="text-sm text-gray-700">
                  Efficiency Rating: {form.efficiencyRating}
                </p>
              )}
            </div>

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
    <>
      <SiteHeader variant="app" />
      <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col items-center">
        {/* Title */}
        <div className="w-full max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold text-[#1E2A5A] mb-6 text-left">
            Smart Benift Application
          </h1>
        </div>
        {/* Main Container */}
        <div className="bg-white w-full max-w-5xl rounded shadow flex flex-col md:flex-row overflow-hidden">
          <StepSidebar steps={steps} step={step} />
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
              <p className="text-sm text-gray-500 mb-4">
                {getSupportingText()}
              </p>
            )}
            <div className="w-full mt-4 ">{renderStepContent()}</div>
          </main>
        </div>
      </div>
      <SiteFooter
        creatorName={CREATOR_NAME}
        contactEmail={CONTACT_EMAIL}
        socialLinks={SOCIAL_LINKS}
      />
    </>
  );
};

export default NewApplication;
