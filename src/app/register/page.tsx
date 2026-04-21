import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/store/store";
import { setUser } from "@/store/feature/auth";
import { Play, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
      username: Yup.string().required("Username wajib diisi"),
      password: Yup.string()
        .min(6, "Minimal 6 karakter")
        .required("Kata sandi wajib diisi"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Kata sandi tidak cocok")
        .required("Konfirmasi kata sandi wajib diisi"),
    }),
    onSubmit: (values) => {
      dispatch(setUser({ 
        id: Date.now(),
        username: values.username,
        role: "user"
      }));
      toast.success("Akun berhasil dibuat!");
      navigate("/");
    },
  });

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-dark p-6 sm:p-8 md:p-12 rounded-3xl md:rounded-[3rem] apple-shadow space-y-6 md:space-y-8 z-10"
      >
        {/* Logo */}
        <div className="text-center space-y-4 pb-2">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-3xl md:text-4xl font-semibold tracking-tighter text-white/90 mb-4 transition-transform hover:scale-105"
          >
            <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-600/20">
              <Play className="fill-white" size={28} />
            </div>
            CHILL
          </Link>
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-white/90 tracking-tight">
              Daftar
            </h2>
            <p className="text-gray-400/70 text-sm leading-relaxed mx-auto">
              Mulai pengalaman menonton terbaikmu
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400/80 ml-1 mb-1">
              Email
            </div>
            <input
              type="email"
              name="email"
              placeholder="Masukkan email"
              className="w-full px-4 py-3 md:px-5 md:py-4 bg-white/5 border border-white/10 rounded-2xl text-white/90 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all placeholder:text-gray-600"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-400/90 text-xs ml-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Username */}
          <div className="space-y-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400/80 ml-1 mb-1">
              Username
            </div>
            <input
              type="text"
              name="username"
              placeholder="Masukkan username"
              className="w-full px-4 py-3 md:px-5 md:py-4 bg-white/5 border border-white/10 rounded-2xl text-white/90 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all placeholder:text-gray-600"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-400/90 text-xs ml-1">
                {formik.errors.username}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="space-y-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400/80 ml-1 mb-1">
              Kata Sandi
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Masukkan kata sandi"
                className="w-full px-4 py-3 md:px-5 md:py-4 bg-white/5 border border-white/10 rounded-2xl text-white/90 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all placeholder:text-gray-600"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-400/90 text-xs ml-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400/80 ml-1 mb-1">
              Konfirmasi Kata Sandi
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Masukkan kata sandi"
              className="w-full px-4 py-3 md:px-5 md:py-4 bg-white/5 border border-white/10 rounded-2xl text-white/90 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all placeholder:text-gray-600"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="text-red-400/90 text-xs ml-1">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 md:py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition active:scale-[0.98] text-xs md:text-sm shadow-lg shadow-purple-600/20"
          >
            Daftar
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0f172a] px-3 text-gray-400/50">Atau</span>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full py-2 md:py-2.5 glass hover:bg-white/10 text-white font-semibold rounded-full transition flex items-center justify-center gap-3 active:scale-[0.98] text-xs md:text-sm"
          >
            <img
              src="https://www.google.com/favicon.ico"
              width={18}
              height={18}
              alt="Google"
            />
            Daftar dengan Google
          </button>

          {/* Login link */}
          <div className="text-center text-xs text-gray-400 mt-6">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-white font-semibold hover:underline">
              Masuk
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
