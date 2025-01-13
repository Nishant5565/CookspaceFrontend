import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../Constant";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import LoginBg from "../../assets/Images/ballBG.png";
import Logo from "../../assets/Images/cookingLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner"
import { useContext } from "react";
import { UserContext } from "../../Contexts/UserContext";


const AuthForm = ({ mode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const initialValues = { userName: "", email: "", password: "", confirmPassword: "", remember: false };
  const { setUser } = useContext(UserContext);

  const validationSchema = Yup.object({
    userName: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .when('mode', {
        is: 'signup',
        then: Yup.string().required('Required')
      }),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .when('mode', {
        is: 'signup',
        then: Yup.string().required('Required')
      }),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const endpoint = mode === "signup" ? "signup" : "login";
    try {
      const response = await axios.post(`${API_URL + endpoint}`, values);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      setUser(response.data.user);
      toast.success(mode === "signup" ? "Account created successfully" : "Logged in successfully", {description: response.data?.message})
      navigate("/recipes");
      setSubmitting(false);
    } catch (error) {
      setFieldError(
        "general",
        error.response?.data?.message || "An error occurred"
      );
      toast.error(error.response?.data?.message || "An error occurred")
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }
  , []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-[#2e2381] rounded-[20px]"
      style={{
        backgroundImage: `url(${LoginBg})`,
        transform  : "rotateY(180deg)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "100% 0",
        backgroundSize: "30%",
      }}
    >
      <div className="flex flex-col md:flex-row items-center justify-around w-full h-full"
     style={{transform  : "rotateY(180deg)"}} 
      >
        <div className="flex flex-col justify-center items-center mt-20 md:mt-0">
        <img
          src={Logo}
          alt="Cookscape"
          className="w-36 filter brightness-[10000]"
        />

          <h1 className="text-3xl md:text-5xl text-white font-bold text-center" >Welcome to Cookscape
            <br />
            </h1>
          <p className="text-white mt-4 text-center"> {
              "Explore Cookscapes, Create your own and much more"
            }
          </p>
        </div>
        <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-30 rounded-2xl px-6 md:px-10 py-8 w-full max-w-md shadow-lg mt-10 md:mt-0">
          <h2 className="text-xl md:text-2xl text-start text-white mb-10">
            {mode === "signup" ? "Create Account in Cookscape" : "Login to Cookscape"}
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors }) => (
              <Form>
                {mode === "signup" && (
                  <div className="mb-6">
                    <label
                      className="block text-white text-sm font-medium mb-2 text-start"
                      htmlFor="userName"
                    >
                      Name
                    </label>
                    <Field
                      type="text"
                      id="userName"
                      name="userName"
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-out bg-transparent placeholder:text-gray-200"
                      placeholder="Enter your name"
                    />
                    <ErrorMessage
                      name="userName"
                      component="div"
                      className="text-red-500 text-sm mt-1 absolute -translate-x-1/2 left-1/2"
                    />
                  </div>
                )}
                <div className="mb-6">
                  <label
                    className="block text-white text-sm font-medium mb-2 text-start"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-out bg-transparent placeholder:text-gray-200"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1 absolute -translate-x-1/2 left-1/2"
                  />
                </div>
                <div className="mb-6 relative">
                  <label
                    className="block text-white text-sm font-medium mb-2 text-start"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-out bg-transparent placeholder:text-gray-200"
                    placeholder="Enter your password"
                  />
                  <span
                    className="absolute right-4 top-10 cursor-pointer text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1 absolute -translate-x-1/2 left-1/2 text-nowrap"
                  />
                </div>
                {mode === "signup" && (
                  <>
                    <div className="mb-10 relative">
                      <label
                        className="block text-white text-sm font-medium mb-2 text-start"
                        htmlFor="confirmPassword"
                      >
                        Confirm Password
                      </label>
                      <Field
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-full border border-gray-300 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-out bg-transparent placeholder:text-gray-200"
                        placeholder="Confirm your password"
                      />
                      <span
                        className="absolute right-4 top-10 cursor-pointer text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-sm mt-1 absolute -translate-x-1/2 left-1/2"
                      />
                    </div>
                  </>
                )}
                {
                  mode === "login" && (
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <label className="block text-white cursor-pointer text-sm font-medium text-start mb-1" htmlFor="remember">
                        Remember me
                      </label>
                      <Field type="checkbox" id="remember" name="remember" className="hue-rotate-60 scale-105 mb-0" />
                    </div>
                    <Link to="/forget-password" className="text-white cursor-pointer text-sm font-medium text-start mb-">
                      Forget Password?
                    </Link>
                  </div>
                  )
                }
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-out font-normal"
                  disabled={isSubmitting}
                >
                  {mode === "signup" ? "Sign Up" : "Login"}
                </button>
                {errors.general && (
                  <p className="text-center text-red-500 text-sm mt-4">
                    {errors.general}
                  </p>
                )}
                <p className="text-center text-sm mt-4 text-white">
                  {mode === "signup"
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <Link
                    to={mode === "signup" ? "/login" : "/signup"}
                    className="hover:underline"
                  >
                    {mode === "signup" ? "Log In" : "Sign Up"}
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export const Login = () => <AuthForm mode="login" />;
export const Signup = () => <AuthForm mode="signup"  />;