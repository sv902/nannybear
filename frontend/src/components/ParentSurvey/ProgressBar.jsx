// components/ParentSurvey/ProgressBar.jsx
import React from "react";
import "../../styles/progressBar.css";

const ProgressBar = ({ currentStep, totalSteps }) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="progress-bar-text">
        {/* {currentStep} / {totalSteps} */}
      </p>
    </div>
  );
};

export default ProgressBar;
