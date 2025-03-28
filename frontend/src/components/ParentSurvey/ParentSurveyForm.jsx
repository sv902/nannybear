import React, { useState } from "react";
import SurveyStep1 from "./SurveyStep1";
import SurveyStep2 from "./SurveyStep2";
import SurveyStep3 from "./SurveyStep3";
import SurveyStep4 from "./SurveyStep4";
import SurveyStep5 from "./SurveyStep5";
import SurveyStep6 from "./SurveyStep6";
import SurveyStep7 from "./SurveyStep7";
import SurveyStep8 from "./SurveyStep8";
import SurveyStep9 from "./SurveyStep9";
import SurveyStep10 from "./SurveyStep10";
import SurveyStep11 from "./SurveyStep11";
import SurveyStep12 from "./SurveyStep12";
import SurveyStep13 from "./SurveyStep13";
import SurveyStep14 from "./SurveyStep14";

const ParentSurveyForm = () => {
  const [step, setStep] = useState(1);
  const [surveyData, setSurveyData] = useState({});

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const handleChange = (field, value) => {
    setSurveyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Надсилання анкети:", surveyData);
    // TODO: Надіслати через axios.post()
  };

  const renderStep = () => {
    switch (step) {
        case 1:
            return <SurveyStep1 data={surveyData} onChange={handleChange} onNext={next} />;
        case 2:
            return <SurveyStep2 data={surveyData} onChange={handleChange} onNext={next} onBack={back} />;
        case 3:
            return <SurveyStep3 data={surveyData} onChange={handleChange} onNext={next} onBack={back} />;
        case 4:
            return <SurveyStep4 data={surveyData} onChange={handleChange} onNext={next} onBack={back} />;
        case 5:
            return <SurveyStep5 data={surveyData} onChange={handleChange} onNext={next} onBack={back} />;
        case 6:
            return <SurveyStep6 data={surveyData} onChange={handleChange} onNext={next} onBack={back} />;
        case 7:
            return <SurveyStep7 data={surveyData} onChange={handleChange} onNext={next} onBack={back} />;
        case 8:
            return <SurveyStep8 data={surveyData} onChange={handleChange} onNext={next} onBack={back} />;    
        case 9:
            return <SurveyStep9 data={surveyData} onChange={handleChange} onNext={next} onBack={back} />;    
        case 10:
            return <SurveyStep10 data={surveyData} onChange={handleChange} onNext={next} onBack={back} />;
        case 11:
            return <SurveyStep11 data={surveyData} onChange={handleChange} onNext={next} onBack={back} />;
        case 12:
            return <SurveyStep12 data={surveyData} onChange={handleChange} onNext={next} onBack={back} />;
        case 13:
            return <SurveyStep13 data={surveyData} onChange={handleChange} onNext={next} onBack={back} />;   
        case 14:
            return <SurveyStep14 data={surveyData} onChange={handleChange} onSubmit={handleSubmit} onBack={back} />;
      default:
        return null;
    }
  };

  return <div className="reg-form-container">{renderStep()}</div>;
};

export default ParentSurveyForm;
