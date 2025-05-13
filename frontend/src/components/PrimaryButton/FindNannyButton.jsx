import { useNavigate } from "react-router-dom";


const FindNannyButton = ({ role, id }) => {
  const navigate = useNavigate();

  const handleFindClick = () => {
    switch (role) {
     case "nanny":
        const profileId = id || localStorage.getItem("nannyProfileId");
        if (profileId) {
            navigate(`/nanny/profile/${profileId}`);
        } else {
            console.warn("❌ Немає ID профілю няні");
        }
        break;
      case "parent":
        navigate("/all-nannies");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        navigate("/registrationlogin?section=register");
        break;
    }
  };

  return (
    <div className="find-nanny-combined">
      <button className="find-nanny-btn" onClick={handleFindClick}>
        ЗНАЙТИ НЯНЮ
      </button>
      <div className="arrow-circle" onClick={handleFindClick}>
        <span className="arrow-right">&rarr;</span>
      </div>
    </div>
  );
};


export default FindNannyButton;
