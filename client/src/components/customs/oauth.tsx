import { app } from "@/lib/firebase";
import { Button } from "../ui/button";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { axiosConfig } from "@/config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/authContext";
import { toast } from "sonner";

export const OAuth = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const auth = getAuth(app);
  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      const googleRes = await signInWithPopup(auth, provider);
      const res = await axiosConfig.post("/auth/google", {
        name: googleRes.user.displayName,
        email: googleRes.user.email,
        photoURL: googleRes.user.photoURL,
      });

      toast.success(res.data.message);
      setAuthUser(res.data.user);
      navigate("/");
    } catch (error) {}
  };

  return (
    <Button type="button" onClick={() => handleGoogleAuth()}>
      Sign in with Google
    </Button>
  );
};
