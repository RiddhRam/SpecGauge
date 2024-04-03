import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WebDefaultPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/home");
    {
      /* automatically redirect to the homepage */
    }
  }, []);
}
