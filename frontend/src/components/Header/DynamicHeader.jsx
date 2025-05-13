import NannyHeader from "../Header/VariantHeaderNanny";
import ParentHeader from "../Header/VariantHeader";
import GuestHeader from "../Header/Header";

const DynamicHeader = () => {
  const role = localStorage.getItem("userRole");

  switch (role) {
    case "nanny":
      return <NannyHeader />;
    case "parent":
      return <ParentHeader />;
    default:
      return <GuestHeader />;
  }
};

export default DynamicHeader;
