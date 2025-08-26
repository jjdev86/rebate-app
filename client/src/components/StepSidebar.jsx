import React from "react";
import PropTypes from "prop-types";

const StepSidebar = ({ steps, step }) => (
  <aside className="hidden md:block md:w-1/4 border-b md:border-b-0 md:border-r p-6">
    <ul className="relative">
      {steps.map((label, idx) => {
        const number = idx + 1;
        const isActive = number === step;
        const isCompleted = number < step;
        const isLast = idx === steps.length - 1;
        return (
          <li key={label} className="relative pl-10 mb-10 last:mb-0">
            {!isLast && (
              <span className="absolute left-[11px] top-7 h-8 w-[2px] bg-[#D9D9D9]"></span>
            )}
            <div
              className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium
                ${isCompleted ? "bg-[#1E2A5A] text-white" : isActive ? "bg-[#1E2A5A] text-white" : "bg-[#D9D9D9] text-[#6B7280]"}`}
            >
              {isCompleted ? "✓" : number}
            </div>
            <span className={isActive ? "text-[#1E2A5A] font-semibold" : "text-[#6B7280]"}>{label}</span>
          </li>
        );
      })}
    </ul>
  </aside>
);

StepSidebar.propTypes = {
  steps: PropTypes.array.isRequired,
  step: PropTypes.number.isRequired,
};

export default StepSidebar;
