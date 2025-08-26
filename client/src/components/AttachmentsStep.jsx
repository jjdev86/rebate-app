import React, { useRef } from "react";
import PropTypes from "prop-types";

const AttachmentsStep = ({ values, errors, onFileChange, onPrev, onNext, onView, onDelete, showDeletePopup, fileToDelete, onConfirmDelete, onCancelDelete }) => {
  const fileInputRef = useRef();

  // Wrap the onFileChange to clear the input after upload
  const handleFileChange = async (e) => {
    await onFileChange(e);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <label className="label">Attachments</label>
      <input
        type="file"
        multiple
        className="w-full mt-1"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    {values.files && values.files.length > 0 && (
      <ul className="text-sm mt-3 bg-gray-100 p-3 rounded">
        {values.files.map((f) => {
          const url = f.url || f.publicUrl;
          return (
            <li
              key={f.id || f.name}
              className="flex items-center gap-3 mb-2 last:mb-0"
            >
              <span>{f.filename || f.name}</span>
              <span className="text-gray-500 ml-1">
                ({((f.size || f.sizeBytes || 0) / 1024).toFixed(1)} KB)
              </span>
              {url && (
                <>
                  <button
                    className="ml-2 text-blue-600 underline"
                    type="button"
                    onClick={() => onView(f)}
                  >
                    View
                  </button>
                  <button
                    className="ml-2 text-red-600 underline"
                    type="button"
                    onClick={() => onDelete(f)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    )}
    {errors.files && (
      <div className="text-red-500 text-xs mt-1">{errors.files}</div>
    )}
    <div className="flex justify-between mt-6">
      <button onClick={onPrev} className="btn-secondary" type="button">
        Back
      </button>
      <button onClick={onNext} className="btn-primary" type="button">
        Next
      </button>
    </div>

    {/* Delete Confirmation Popup */}
    {showDeletePopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
          <h3 className="text-lg font-semibold mb-4">Delete Attachment</h3>
          <p className="mb-6">Are you sure you want to delete <span className="font-semibold">{fileToDelete?.filename || fileToDelete?.name}</span>?</p>
          <div className="flex justify-end gap-3">
            <button className="btn-secondary" onClick={onCancelDelete} type="button">No</button>
            <button className="btn-primary" onClick={onConfirmDelete} type="button">Yes, Delete</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

AttachmentsStep.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object,
  onFileChange: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onView: PropTypes.func,
  onDelete: PropTypes.func,
  showDeletePopup: PropTypes.bool,
  fileToDelete: PropTypes.object,
  onConfirmDelete: PropTypes.func,
  onCancelDelete: PropTypes.func,
};

export default AttachmentsStep;
