import { useNavigate } from "react-router-dom";

export default function WebDefaultPage() {
  const navigate = useNavigate();

  navigate("/home");
  {
    /* automatically redirect to the homepage */
  }
}
