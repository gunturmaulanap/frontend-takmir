import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/auth";

export interface RegisterRequest {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  masjid_name: string;
  masjid_address: string;
  phone: string;
  profile_picture?: File | null;
}

export interface RegisterResponse {
  success: boolean;
  user: User;
  token: string;
}

export const registerApi = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  console.log("🔵 Register Request:", data);

  // Create FormData if there's a file
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("username", data.username);
  formData.append("password", data.password);
  formData.append("password_confirmation", data.confirmPassword);
  formData.append("nama_masjid", data.masjid_name);
  formData.append("alamat_masjid", data.masjid_address);
  formData.append("phone", data.phone);

  if (data.profile_picture) {
    formData.append("image", data.profile_picture);
  }

  const response = await axiosInstance.post("/api/signup", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("✅ Register Response:", response.data);
  return response.data;
};
