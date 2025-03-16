import { useLogout } from "../../hooks/useLogout";
import { Button } from "@/components/ui/button";
import axiosConfig from "@/config/axiosConfig";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const BASE_URL = "http://localhost:3000"; // Remplace par l'URL de ton serveur si nécessaire

const Account = () => {
  const { logout, loading } = useLogout();
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await logout();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axiosConfig.post("/users/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.file?.path) {
        setUploadedFilePath(`${BASE_URL}/${response.data.file.path}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button onClick={handleClick} variant="outline" disabled={loading}>
        {t("pages.account.logout")}
      </Button>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <input type="file" className="form-control-file" name="avatar" onChange={handleFileChange} disabled={uploading} />
        </div>
        <Button type="submit" variant="outline" disabled={!file || uploading}>
          {uploading ? t("pages.account.uploading") : t("pages.account.upload")}
        </Button>
      </form>

      {uploadedFilePath && (
        <div className="mt-4">
          <p>{t("pages.account.uploadSuccess")}</p>
          <img src={uploadedFilePath} alt="Avatar uploadé" className="object-cover w-32 h-32 border rounded-full" />
        </div>
      )}
    </>
  );
};

export default Account;
