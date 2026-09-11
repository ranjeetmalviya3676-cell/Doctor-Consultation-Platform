"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { userAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthFormProps {
  type: "login" | "signup";
  userRole: "doctor" | "patient";
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type FormDataType = {
  name: string;
  email: string;
  password: string;
  licenseNumber: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  licenseNumber?: string;
  terms?: string;
  submit?: string;
};

const AuthForm = ({ type, userRole }: AuthFormProps) => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    password: "",
    licenseNumber: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const {
    registerPatient,
    registerDoctor,
    loginPatient,
    loginDoctor,
    loading,
    error,
  } = userAuthStore();

  const router = useRouter();

  const isSignup = type === "signup";
  const isDoctorSignup = isSignup && userRole === "doctor";

  const title = isSignup ? "Create a secure account" : "Welcome back";
  const buttonText = isSignup ? "Create account" : "Sign in";
  const altLinkText = isSignup ? "Already a member?" : "Don't have an account?";
  const altLinkAction = isSignup ? "Sign in" : "Sign up";
  const altLinkPath = isSignup ? `/login/${userRole}` : `/signup/${userRole}`;

  const apiErrorMessage = useMemo(() => {
    if (!error) return "";

    const normalized = String(error).toLowerCase();

    if (normalized.includes("doctor not verified yet")) {
      return "Your doctor account is pending verification. Please wait for admin approval before signing in.";
    }

    if (normalized.includes("doctor rejected by admin")) {
      return "Your doctor account was rejected by admin. Please contact support or register again with valid details.";
    }

    if (normalized.includes("license already registered")) {
      return "This license number is already registered.";
    }

    if (normalized.includes("invalid license format")) {
      return "License format is invalid. Example: GMC12345";
    }

    return String(error);
  }, [error]);

  const updateField = (field: keyof FormDataType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "licenseNumber" ? value.toUpperCase().trimStart() : value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [field]: "",
      submit: "",
    }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (isSignup) {
      if (!formData.name.trim()) {
        errors.name = "Full name is required";
      } else if (formData.name.trim().length < 3) {
        errors.name = "Full name must be at least 3 characters";
      }
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (isDoctorSignup) {
      if (!formData.licenseNumber.trim()) {
        errors.licenseNumber = "License number is required for doctors";
      } else if (!/^[A-Z]{2,5}[0-9]{3,}$/.test(formData.licenseNumber.trim())) {
        errors.licenseNumber = "Invalid format. Example: GMC12345";
      }
    }

    if (isSignup && !agreeToTerms) {
      errors.terms = "Please accept the terms and privacy policy";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (type === "signup") {
        if (userRole === "doctor") {
          await registerDoctor({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            licenseNumber: formData.licenseNumber.trim(),
          });

          router.push("/onboarding/doctor");
        } else {
          await registerPatient({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          });
          router.push("/onboarding/patient");
        }
      } else {
        if (userRole === "doctor") {
          await loginDoctor(formData.email.trim(), formData.password);
          router.push("/doctor/dashboard");
        } else {
          await loginPatient(formData.email.trim(), formData.password);
          router.push("/patient/dashboard");
        }
      }
    } catch (err) {
      console.error(`${type} failed:`, err);
      setFormErrors((prev) => ({
        ...prev,
        submit: "Please check your details and try again.",
      }));
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${BASE_URL}/auth/google?type=${userRole}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900">MediCare+</h1>
      </div>

      <Card className="border-0 shadow-xl">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

          {(apiErrorMessage || formErrors.submit) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {apiErrorMessage || formErrors.submit}
            </div>
          )}

          {isDoctorSignup && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
              Doctors must provide a valid license number. Accounts may require
              admin verification before login.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0"
                  required
                />
                {formErrors.name && (
                  <p className="text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                {type === "login" && userRole === "doctor"
                  ? "Email or License Number"
                  : "Email"}
              </Label>
              <Input
                id="email"
                type="text"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder={
                  type === "login" && userRole === "doctor"
                    ? "Enter email or license number"
                    : "Enter your email"
                }
                className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0"
                required
              />
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {isDoctorSignup && (
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  type="text"
                  placeholder="Enter license (e.g. GMC12345)"
                  value={formData.licenseNumber}
                  onChange={(e) => updateField("licenseNumber", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0"
                  required
                />
                {formErrors.licenseNumber && (
                  <p className="text-sm text-red-600">
                    {formErrors.licenseNumber}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {formErrors.password && (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            {isSignup && (
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => {
                      setAgreeToTerms(checked as boolean);
                      setFormErrors((prev) => ({ ...prev, terms: "" }));
                    }}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 leading-5"
                  >
                    I confirm that I am over 18 years old and agree to
                    MediCare+&apos;s{" "}
                    <Link href="#" className="text-blue-600 hover:underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
                {formErrors.terms && (
                  <p className="text-sm text-red-600">{formErrors.terms}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-full py-3"
              disabled={loading}
            >
              {loading
                ? `${type === "signup" ? "Creating" : "Signing"}...`
                : buttonText}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex justify-center">
                <span className="bg-white px-2 text-gray-500 text-sm">OR</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full border-gray-300"
                onClick={handleGoogleAuth}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isSignup ? "Sign up" : "Sign in"} with Google
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-gray-600">{altLinkText} </span>
            <Link
              href={altLinkPath}
              className="text-blue-600 hover:underline font-medium"
            >
              {altLinkAction}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
