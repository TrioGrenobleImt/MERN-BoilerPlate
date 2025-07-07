import { app } from "@/lib/firebase";
import { Button } from "../ui/button";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { axiosConfig } from "@/config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/authContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface OauthProps {
  message: string;
}

export function OAuth({ message }: OauthProps) {
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const { t } = useTranslation();

  const auth = getAuth(app);

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const googleRes = await signInWithPopup(auth, provider);

      const userData = {
        name: googleRes.user.displayName,
        email: googleRes.user.email,
        photoURL: googleRes.user.photoURL,
      };

      try {
        const res = await axiosConfig.post("/auth/login/google", userData);
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success(t(res.data.message));
        setAuthUser(res.data.user);
        navigate("/");
      } catch (err: any) {
        const errorMessage = err?.response?.data?.error;
        if (errorMessage === "User not found, lets register !") {
          navigate("/register/google", { state: userData });
        } else {
          toast.error(t(errorMessage || "auth.error"));
        }
      }
    } catch (err: any) {
      toast.error(t("auth.error"));
    }
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleAuth}
      className="flex items-center w-full gap-3 px-4 py-2 text-black bg-white border border-gray-300 hover:bg-gray-100"
    >
      <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.1h146.9c-6.4 34-25.2 62.8-53.6 82v68.1h86.8c50.8-46.8 81.4-115.7 81.4-194.9z"
          fill="#4285F4"
        />
        <path
          d="M272 544.3c72.6 0 133.5-24 178-65.4l-86.8-68.1c-24.1 16.1-54.8 25.6-91.2 25.6-70 0-129.2-47.2-150.4-110.5H30.2v69.6c44.3 87.5 135.5 149.8 241.8 149.8z"
          fill="#34A853"
        />
        <path d="M121.6 325.9c-10-29.7-10-61.6 0-91.3V165H30.2c-39.6 78.9-39.6 172.5 0 251.4l91.4-70.5z" fill="#FBBC05" />
        <path
          d="M272 107.7c39.4-.6 77 13.6 106.1 39.5l79.2-79.2C412.2 24.1 343.7-.2 272 0 165.7 0 74.5 62.3 30.2 149.8l91.4 70.5c21.1-63.2 80.4-110.4 150.4-112.6z"
          fill="#EA4335"
        />
      </svg>
      <span className="font-medium">{t(message + "_google")}</span>
    </Button>
  );
}
