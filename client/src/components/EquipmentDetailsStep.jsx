import React from "react";
import PropTypes from "prop-types";

const EquipmentDetailsStep = ({ values, errors, options, onEquipmentTypeChange, onBrandChange, onModelChange, onChange, onPrev, onNext }) => (
  <>
    <label className="label">Equipment Type</label>
    <select
      name="equipmentType"
      value={values.equipmentType}
      onChange={onEquipmentTypeChange}
      className="input mt-1"
    >
      <option value="">Select</option>
      {options.equipmentTypes.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {errors.equipmentType && (
      <div className="text-red-500 text-xs mt-1">
        {errors.equipmentType}
      </div>
    )}

    <label className="label mt-4">Brand</label>
    <select
      name="brand"
      value={values.brand || ""}
      onChange={onBrandChange}
      className="input mt-1"
      disabled={!values.equipmentType}
      required
    >
      <option value="">Select</option>
      {options.brands && options.brands.map((brand) => (
        <option key={brand} value={brand}>{brand}</option>
      ))}
    </select>
    {errors.brand && (
      <div className="text-red-500 text-xs mt-1">{errors.brand}</div>
    )}

    <label className="label mt-4">Model</label>
    <select
      name="productId"
      value={values.productId || ""}
      onChange={onModelChange}
      className="input mt-1"
      disabled={!values.brand}
    >
      <option value="">Select</option>
      {options.models.map((opt) =>
        typeof opt === "object" ? (
          <option key={opt.id} value={opt.id}>
            {opt.modelNumber}
          </option>
        ) : (
          <option key={opt} value={opt}>
            {opt}
          </option>
        )
      )}
    </select>
    {errors.model && (
      <div className="text-red-500 text-xs mt-1">{errors.model}</div>
    )}

    <div className="bg-[#EAF3FF] text-[#1E2A5A] p-4 rounded mt-4 text-sm">
      Eligible for a <strong>$500 rebate</strong>
      <br />
      Rebates are available for energy-efficient heat pumps
    </div>

    <div className="flex justify-between mt-6">
      <button onClick={onPrev} className="btn-secondary" type="button">
        Back
      </button>
      <button onClick={onNext} className="btn-primary" type="button">
        Next
      </button>
    </div>
  </>
);

EquipmentDetailsStep.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object,
  options: PropTypes.object.isRequired,
  onEquipmentTypeChange: PropTypes.func.isRequired,
  onBrandChange: PropTypes.func.isRequired,
  onModelChange: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default EquipmentDetailsStep;
