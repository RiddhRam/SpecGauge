import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function WebDefaultPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/home");
    {
      /* automatically redirect to the homepage */
    }
  });
}
