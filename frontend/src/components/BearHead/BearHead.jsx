import React from "react";
import nose from "../../assets/nose.png";
import "./BearHead.css";

const BearHead = () => {
  return (
    <div className="container-bear">
    <div className="bear-head-home">
      <div className="bear-ear-home left-ear-home"></div>
      <div className="bear-ear-home right-ear-home"></div>     
      <div className="bear-face-home">
         <p className="bear-head-home-text">
                    ПРОСТО, ШВИДКО <br />
                    ТА БЕЗ ЗАЙВИХ ЗУСИЛЬ ЗНАЙДІТЬ НЯНЮ ДЛЯ ДИТИНИ. ВЕЛИКИЙ ВИБІР
                    КАНДИДАТІВ З ДЕТАЛЬНИМИ РЕЗЮМЕ <br />
                    ТА ВІДГУКАМИ.
                  </p>
        <div className="cheek left-cheek"></div>
          <div className="cheek right-cheek"></div>
        <img src={nose} alt="Bear Nose" className="bear-nose-img" />
         <img
                         className="vector-2"
                         alt="Vector"
                         src="/assets/vector-1.svg"
                       />
      </div>
    </div></div>
  );
};

export default BearHead;
