import React from "react";
import { useReducer } from "react";
import "./style.css";

export const MsgCard = ({ property1, className }) => {
  const [state, dispatch] = useReducer(reducer, {
    property1: property1 || "default",
  });

  return (
    <div
      className={`msg-card ${state.property1} ${className}`}
      onMouseLeave={() => {
        dispatch("mouse_leave");
      }}
      onMouseEnter={() => {
        dispatch("mouse_enter");
      }}
    >
      {state.property1 === "default" && (
        <div className="overlap-group">
          <p className="p">
            Великий вибір перевірених кандидатів, зручний пошук за критеріями,
            швидкий відгук від нянь. Дуже сподобалося, що можна переглянути
            відгуки інших батьків і поспілкуватися перед зустріччю. Дитина була
            в надійних руках, а я – спокійна. Рекомендую!
          </p>

          <div className="rectangle" />

          <div className="text-wrapper-2">...</div>
        </div>
      )}

      {state.property1 === "variant-2" && (
        <>
          <div className="rectangle-2" />

          <div className="frame" />

          <p className="text-wrapper-3">
            Великий вибір перевірених кандидатів, зручний пошук за критеріями,
            швидкий відгук від нянь. Дуже сподобалося, що можна переглянути
            відгуки інших батьків і поспілкуватися перед зустріччю. Дитина була
            в надійних руках, а я – спокійна. Рекомендую!
          </p>

          <div className="frame-2" />

          <div className="rectangle-3" />

          <div className="text-wrapper-4">...</div>
        </>
      )}
    </div>
  );
};

function reducer(state, action) {
  switch (action) {
    case "mouse_enter":
      return {
        ...state,
        property1: "variant-2",
      };

    case "mouse_leave":
      return {
        ...state,
        property1: "default",
      };
      default:
  }

  return state;
}

export default MsgCard;