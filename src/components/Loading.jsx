import { Navbar } from "./Navbar";

export const Loading = () => {
  return (
    <>
      <Navbar isMobile={null}></Navbar>
      <div className="LargeContainer" style={{ minHeight: "608px" }}>
        <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
      </div>
    </>
  );
};
