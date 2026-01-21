"use client";

import { useState, ChangeEvent } from "react";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

const CreateDormAccount = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string): void => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    setPasswordStrength(Math.min(strength, 5));
  };

  const getPasswordStrengthColor = (): string => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-orange-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (): string => {
    if (passwordStrength <= 1) return "อ่อนมาก";
    if (passwordStrength <= 2) return "อ่อน";
    if (passwordStrength <= 3) return "ปานกลาง";
    if (passwordStrength <= 4) return "แข็งแรง";
    return "แข็งแรงมาก";
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "กรุณากรอกอีเมลให้ถูกต้อง";
    }

    if (!formData.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (formData.password.length < 8) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "กรุณายืนยันรหัสผ่าน";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      // TODO: Call API to create dorm account
      // await createDormAccount(formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert(`สร้างบัญชีสำเร็จ!\nอีเมล: ${formData.email}`);

      // Redirect to login or dashboard
      // router.push('/login');
    } catch (error) {
      console.error("Error creating account:", error);
      alert("เกิดข้อผิดพลาดในการสร้างบัญชี");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="text-blue-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">
                สร้างบัญชีหอพัก
              </h1>
            </div>
            <p className="text-gray-600">กรอกข้อมูลเพื่อเริ่มต้นใช้งาน</p>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="example@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-11 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          level <= passwordStrength
                            ? getPasswordStrengthColor()
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    ความแข็งแรง:{" "}
                    <span className="font-medium">
                      {getPasswordStrengthText()}
                    </span>
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password}
                </p>
              )}

              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <CheckCircle
                    size={12}
                    className={
                      formData.password.length >= 8
                        ? "text-green-500"
                        : "text-gray-300"
                    }
                  />
                  อย่างน้อย 8 ตัวอักษร
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <CheckCircle
                    size={12}
                    className={
                      /[a-z]/.test(formData.password) &&
                      /[A-Z]/.test(formData.password)
                        ? "text-green-500"
                        : "text-gray-300"
                    }
                  />
                  มีทั้งตัวพิมพ์เล็กและใหญ่
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <CheckCircle
                    size={12}
                    className={
                      /\d/.test(formData.password)
                        ? "text-green-500"
                        : "text-gray-300"
                    }
                  />
                  มีตัวเลข
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <CheckCircle
                    size={12}
                    className={
                      /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                        ? "text-green-500"
                        : "text-gray-300"
                    }
                  />
                  มีอักขระพิเศษ
                </p>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-11 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.confirmPassword}
                </p>
              )}
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword && (
                  <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle size={14} />
                    รหัสผ่านตรงกัน
                  </p>
                )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>หมายเหตุ:</strong> หลังจากสร้างบัญชีสำเร็จ
                ท่านจะสามารถเข้าสู่ระบบและกรอกข้อมูลหอพักเพิ่มเติมได้
              </p>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => window.history.back()}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    กำลังสร้างบัญชี...
                  </span>
                ) : (
                  "สร้างบัญชี"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDormAccount;
