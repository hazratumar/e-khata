export class CreateUserDto {
  name: string;
  username: string;
  email: string;
  role: "Super Admin" | "Admin";
  status: "Pending" | "Active" | "Disable" | "Delete";
  password: string;
  image: string;
  provider: "email" | "google";
  refreshToken: string;
  otp: string;
}
