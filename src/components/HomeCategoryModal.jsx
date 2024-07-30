import { logEvent } from "firebase/analytics";
import { useNavigate } from "react-router-dom";

export default function HomeCategoryModal({
  categories,
  analytics,
  isMobile,
  setModalVisible,
  links,
}) {
  const navigate = useNavigate();
  return (
    <>
      <p className="HeaderText">Select a category</p>
      {/* Buttons */}
      <div className="ModalButtonSection">
        {/* Buttons to select a category */}
        {categories.map((item, index) => (
          <button
            className="NormalButtonNoBackground"
            key={item}
            onClick={() => {
              if (analytics != null) {
                logEvent(analytics, "Modal Button", {
                  Type: "Comparison",
                  Category: item,
                  Platform: isMobile ? "Mobile" : "Computer",
                });
              }
              navigate(`${links[index]}`);
              setModalVisible(false);
            }}
            style={{
              width: "95%",
              whiteSpace: "nowrap",
            }}
          >
            <p>{item}</p>
          </button>
        ))}
      </div>
      {/* Cancel Button */}
      <button
        className="DangerButton"
        onClick={() => {
          setModalVisible(false);
        }}
        style={{ marginBottom: "20px" }}
      >
        Cancel
      </button>
    </>
  );
}
