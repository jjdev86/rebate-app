import React from "react";
import PropTypes from "prop-types";

const ReviewStep = ({ values, onPrev, onSubmit }) => (
  <>
    <pre className="bg-gray-100 p-3 text-sm rounded mb-6 overflow-auto">
      {JSON.stringify(
        { ...values, files: values.files.map((f) => f.name) },
        null,
        2
      )}
    </pre>
    <div className="flex justify-between">
      <button onClick={onPrev} className="btn-secondary" type="button">
        Back
      </button>
      <button onClick={onSubmit} className="btn-primary" type="button">
        Submit
      </button>
    </div>
  </>
);

ReviewStep.propTypes = {
  values: PropTypes.object.isRequired,
  onPrev: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ReviewStep;
