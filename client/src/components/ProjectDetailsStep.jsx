import React from "react";
import PropTypes from "prop-types";

const ProjectDetailsStep = ({ values, errors, onChange, sameAsInstall, onSameAsInstallChange, onNext }) => (
  <>
    <div className="flex gap-2">
      <div className="flex-1">
        <label className="label">First Name</label>
        <input
          name="customerFirstName"
          className="input mt-1"
          value={values.customerFirstName}
          onChange={onChange}
        />
        {errors.customerFirstName && (
          <div className="text-red-500 text-xs mt-1">
            {errors.customerFirstName}
          </div>
        )}
      </div>
      <div className="flex-1">
        <label className="label">Last Name</label>
        <input
          name="customerLastName"
          className="input mt-1"
          value={values.customerLastName}
          onChange={onChange}
        />
        {errors.customerLastName && (
          <div className="text-red-500 text-xs mt-1">
            {errors.customerLastName}
          </div>
        )}
      </div>
    </div>

    <div className="flex gap-2 mt-4">
      <div className="flex-1">
        <label className="label">Email</label>
        <input
          name="email"
          className="input mt-1 bg-gray-100 cursor-not-allowed"
          value={values.email}
          onChange={onChange}
          readOnly
        />
        {errors.email && (
          <div className="text-red-500 text-xs mt-1">
            {errors.email}
          </div>
        )}
      </div>
      <div className="flex-1">
        <label className="label">Phone Number</label>
        <input
          name="phoneNumber"
          className="input mt-1"
          value={values.phoneNumber}
          onChange={onChange}
        />
        {errors.phoneNumber && (
          <div className="text-red-500 text-xs mt-1">
            {errors.phoneNumber}
          </div>
        )}
      </div>
    </div>
    {/* Install Address Fields */}
    <label className="label mt-4">Install Address</label>
    <input
      name="installAddress"
      className="input mt-1"
      value={values.installAddress}
      onChange={onChange}
    />
    {errors.installAddress && (
      <div className="text-red-500 text-xs mt-1">
        {errors.installAddress}
      </div>
    )}
    <div className="flex gap-2 mt-2">
      <div className="flex-1">
        <label className="label">City</label>
        <input
          name="installCity"
          className="input mt-1"
          value={values.installCity}
          onChange={onChange}
        />
        {errors.installCity && (
          <div className="text-red-500 text-xs mt-1">
            {errors.installCity}
          </div>
        )}
      </div>
      <div className="flex-1">
        <label className="label">State</label>
        <input
          name="installState"
          className="input mt-1"
          value={values.installState}
          onChange={onChange}
        />
        {errors.installState && (
          <div className="text-red-500 text-xs mt-1">
            {errors.installState}
          </div>
        )}
      </div>
      <div className="flex-1">
        <label className="label">Zip</label>
        <input
          name="installZip"
          className="input mt-1"
          value={values.installZip}
          onChange={onChange}
        />
        {errors.installZip && (
          <div className="text-red-500 text-xs mt-1">
            {errors.installZip}
          </div>
        )}
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
          onChange={onSameAsInstallChange}
        />
        <span className="ml-2 text-sm">
          Mailing address is the same as install address
        </span>
      </label>
    </div>

    {/* Mailing Address Fields */}
    <label className="label mt-2">Mailing Address</label>
    <input
      name="mailingAddress"
      className="input mt-1"
      value={values.mailingAddress}
      onChange={onChange}
      disabled={sameAsInstall}
    />
    {errors.mailingAddress && (
      <div className="text-red-500 text-xs mt-1">
        {errors.mailingAddress}
      </div>
    )}
    <div className="flex gap-2 mt-2">
      <div className="flex-1">
        <label className="label">City</label>
        <input
          name="mailingCity"
          className="input mt-1"
          value={values.mailingCity}
          onChange={onChange}
          disabled={sameAsInstall}
        />
        {errors.mailingCity && (
          <div className="text-red-500 text-xs mt-1">
            {errors.mailingCity}
          </div>
        )}
      </div>
      <div className="flex-1">
        <label className="label">State</label>
        <input
          name="mailingState"
          className="input mt-1"
          value={values.mailingState}
          onChange={onChange}
          disabled={sameAsInstall}
        />
        {errors.mailingState && (
          <div className="text-red-500 text-xs mt-1">
            {errors.mailingState}
          </div>
        )}
      </div>
      <div className="flex-1">
        <label className="label">Zip</label>
        <input
          name="mailingZip"
          className="input mt-1"
          value={values.mailingZip}
          onChange={onChange}
          disabled={sameAsInstall}
        />
        {errors.mailingZip && (
          <div className="text-red-500 text-xs mt-1">
            {errors.mailingZip}
          </div>
        )}
      </div>
    </div>

    {/* Claim Number (read-only for now) */}
    <label className="label mt-4">Claim Number</label>
    <input
      name="claimNumber"
      className="input mt-1 bg-gray-100 cursor-not-allowed"
      value={values.claimNumber}
      readOnly
    />

    <div className="flex justify-end mt-6">
      <button onClick={onNext} className="btn-primary" type="button">
        Next
      </button>
    </div>
  </>
);

ProjectDetailsStep.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  sameAsInstall: PropTypes.bool,
  onSameAsInstallChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default ProjectDetailsStep;
