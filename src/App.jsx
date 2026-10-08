import { useEffect, useMemo, useState } from "react";
import {
  Link,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  Heart,
  ShoppingCart,
  User,
  Search,
  Moon,
  Sun,
  ArrowRight,
  ArrowLeft,
  Star,
  Smartphone,
  Headphones,
  Watch,
  Laptop,
  Gamepad2,
  Shirt,
  Sparkles,
  ShieldCheck,
  Truck,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Camera,
  X,
  RefreshCw,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  LogOut,
  Phone,
  MapPin,
} from "lucide-react";

import "./App.css";
import AdminDashboard from "./admin/AdminDashboard";

/* =========================================================
   API
========================================================= */

const API_URL =
  "http://localhost:5000/api/products";

const AUTH_API_URL =
  "http://localhost:5000/api/customers";

/* =========================================================
   CURRENCY
   Product prices are stored and displayed in BDT.
========================================================= */

const formatBDT = (amount) => {
  return `BDT ${Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};
/* =========================================================
   HERO IMAGES
========================================================= */

const heroImages = [
  "/images/hero-1.png",
  "/images/hero-2.png",
  "/images/hero-3.png",
];

/* =========================================================
   CATEGORY ICONS
========================================================= */

const categoryIcons = {
  Electronics: Headphones,
  Fashion: Shirt,
  Accessories: Watch,
  Laptop: Laptop,
  Mobile: Smartphone,
  Gaming: Gamepad2,
  "Smart Watch": Watch,
  Earbuds: Headphones,
  Headphones: Headphones,
  Camera: Camera,
  Shoes: ShoppingBag,
  Perfume: Sparkles,
};

/* =========================================================
   AUTH PAGE
========================================================= */

function AuthPage({ mode = "login" }) {
  const navigate = useNavigate();

  const isLogin = mode === "login";

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    /* =====================================================
       REGISTER VALIDATION
    ===================================================== */

    if (!isLogin) {
      if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.phone.trim() ||
        !form.address.trim() ||
        !form.password ||
        !form.confirmPassword
      ) {
        setMessage(
          "Please fill in all fields."
        );
        return;
      }

      if (form.password.length < 6) {
        setMessage(
          "Password must be at least 6 characters."
        );
        return;
      }

      if (
        form.password !==
        form.confirmPassword
      ) {
        setMessage(
          "Passwords do not match."
        );
        return;
      }
    }

    /* =====================================================
       LOGIN VALIDATION
    ===================================================== */

    if (
      isLogin &&
      (!form.email.trim() ||
        !form.password)
    ) {
      setMessage(
        "Email and password are required."
      );
      return;
    }

    try {
      setLoading(true);

      const email = form.email
        .trim()
        .toLowerCase();

      /* ===================================================
         CUSTOMER REGISTER
      =================================================== */

      if (!isLogin) {
        const response = await fetch(
          `${AUTH_API_URL}/register`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name: form.name.trim(),
              email,
              phone: form.phone.trim(),
              address:
                form.address.trim(),
              password:
                form.password,
            }),
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Registration failed."
          );
        }

        setMessage(
          "Account created successfully. Please sign in."
        );

        navigate("/login");
        return;
      }

      /* ===================================================
         ADMIN LOGIN
      =================================================== */

      const adminResponse =
        await fetch(
          "http://localhost:5000/api/admin/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password:
                form.password,
            }),
          }
        );

      const adminData =
        await adminResponse.json();

      /* ===================================================
         ADMIN LOGIN SUCCESS
      =================================================== */

      if (
        adminResponse.ok &&
        adminData.success &&
        adminData.token &&
        adminData.admin
      ) {
        localStorage.setItem(
          "shopvista_admin_token",
          adminData.token
        );

        localStorage.setItem(
          "shopvista_admin",
          JSON.stringify(
            adminData.admin
          )
        );

        localStorage.removeItem(
          "shopvista_token"
        );

        localStorage.removeItem(
          "shopvista_customer"
        );

        navigate("/admin");

        return;
      }

      /* ===================================================
         CUSTOMER LOGIN
      =================================================== */

      const customerResponse =
        await fetch(
          `${AUTH_API_URL}/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password:
                form.password,
            }),
          }
        );

      const customerData =
        await customerResponse.json();

      if (
        !customerResponse.ok ||
        !customerData.success
      ) {
        throw new Error(
          customerData.message ||
            adminData.message ||
            "Invalid email or password."
        );
      }

      /* ===================================================
         SAVE CUSTOMER LOGIN
      =================================================== */

      localStorage.setItem(
        "shopvista_token",
        customerData.token
      );

      localStorage.setItem(
        "shopvista_customer",
        JSON.stringify(
          customerData.customer
        )
      );

      localStorage.removeItem(
        "shopvista_admin_token"
      );

      localStorage.removeItem(
        "shopvista_admin"
      );

      navigate("/");
    } catch (error) {
      console.error(
        "Authentication Error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setMessage(
      `${provider} Sign-In UI is ready. OAuth connection will be connected after the provider credentials/backend OAuth route are added.`
    );
  };

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  };

  const glowOne = {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(120,150,255,.22), transparent 68%)",
    top: "-160px",
    left: "-140px",
    pointerEvents: "none",
  };

  const glowTwo = {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(190,120,255,.18), transparent 68%)",
    bottom: "-180px",
    right: "-130px",
    pointerEvents: "none",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "560px",
    padding: isLogin
      ? "42px 38px 34px"
      : "38px",
    borderRadius: "30px",
    position: "relative",
    zIndex: 2,
  };

  const inputWrapStyle = {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "0 15px",
    minHeight: "52px",
    borderRadius: "16px",
    background:
      "rgba(255,255,255,.08)",
    border:
      "1px solid rgba(255,255,255,.12)",
  };

  const inputStyle = {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "inherit",
    fontSize: "14px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: 600,
  };

  return (
    <div
      className="app auth-app"
      style={pageStyle}
    >
      <div style={glowOne}></div>
      <div style={glowTwo}></div>

      <div
        className="glass"
        style={cardStyle}
      >
        {/* BRAND */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "26px",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              color: "inherit",
              textDecoration: "none",
              fontSize: "24px",
              fontWeight: 800,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "46px",
                height: "46px",
                display: "grid",
                placeItems: "center",
                borderRadius: "14px",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,.62), rgba(255,255,255,.18))",
                border:
                  "1px solid rgba(255,255,255,.72)",
                boxShadow:
                  "0 10px 28px rgba(66,126,214,.10)",
              }}
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                aria-hidden="true"
              >
                <rect
                  x="5.2"
                  y="5.2"
                  width="14.6"
                  height="14.6"
                  rx="1.6"
                  transform="rotate(45 12.5 12.5)"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                />
              </svg>
            </span>

            ShopVista
          </Link>

          <h1
            style={{
              margin:
                "26px 0 8px",
              fontSize: "34px",
              lineHeight: 1.15,
              letterSpacing: "-0.7px",
            }}
          >
            {isLogin
              ? "Welcome Back"
              : "Create Account"}
          </h1>

          <p
            style={{
              margin: 0,
              opacity: 0.68,
              fontSize: "14px",
            }}
          >
            {isLogin
              ? "Sign in to continue shopping"
              : "Join ShopVista and start shopping"}
          </p>
        </div>

        {/* SOCIAL LOGIN */}

        <div
          style={{
            display: "grid",
            gap: "11px",
          }}
        >
          <button
            type="button"
            onClick={() =>
              handleSocialLogin(
                "Google"
              )
            }
            style={{
              width: "100%",
              minHeight: "56px",
              borderRadius: "16px",
              border:
                "1px solid rgba(255,255,255,.14)",
              background:
                "rgba(255,255,255,.08)",
              color: "inherit",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontWeight: 650,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "24px",
                height: "24px",
                display: "grid",
                placeItems: "center",
                flex: "0 0 24px",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                role="img"
              >
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.39 3.62v3.01h3.87c2.27-2.09 3.56-5.17 3.56-8.66Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-3.01c-1.07.72-2.44 1.15-4.08 1.15-3.14 0-5.8-2.12-6.75-4.97H1.25v3.1A12 12 0 0 0 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.25 14.26A7.22 7.22 0 0 1 4.87 12c0-.78.13-1.54.38-2.26v-3.1H1.25A12 12 0 0 0 0 12c0 1.93.46 3.75 1.25 5.36l4-3.1Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.77c1.77 0 3.36.61 4.61 1.81l3.45-3.45C17.95 1.11 15.24 0 12 0A12 12 0 0 0 1.25 6.64l4 3.1C6.2 6.89 8.86 4.77 12 4.77Z"
                />
              </svg>
            </span>

            Continue with Google
          </button>

          <button
            type="button"
            onClick={() =>
              handleSocialLogin(
                "Apple"
              )
            }
            style={{
              width: "100%",
              minHeight: "56px",
              borderRadius: "16px",
              border:
                "1px solid rgba(255,255,255,.14)",
              background:
                "rgba(255,255,255,.08)",
              color: "inherit",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontWeight: 650,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "24px",
                height: "24px",
                display: "grid",
                placeItems: "center",
                flex: "0 0 24px",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M16.77 12.63c.02 2.2 1.93 2.93 1.95 2.94-.02.05-.31 1.06-1.01 2.1-.61.91-1.24 1.82-2.24 1.84-.98.02-1.3-.59-2.43-.59-1.13 0-1.49.57-2.42.61-.97.04-1.71-.98-2.32-1.89-1.26-1.82-2.22-5.15-.93-7.4.64-1.12 1.77-1.83 2.99-1.85.94-.02 1.82.63 2.43.63.61 0 1.76-.78 2.96-.66.5.02 1.9.2 2.8 1.51-.07.04-1.67.98-1.66 2.76ZM14.83 4.93c.52-.63.87-1.5.77-2.37-.75.03-1.65.5-2.18 1.12-.48.55-.9 1.44-.79 2.29.83.06 1.68-.42 2.2-1.04Z"
                />
              </svg>
            </span>

            Continue with Apple
          </button>
        </div>

        {/* DIVIDER */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "22px 0",
            opacity: 0.55,
            fontSize: "12px",
          }}
        >
          <span
            style={{
              height: "1px",
              flex: 1,
              background:
                "currentColor",
              opacity: 0.25,
            }}
          />

          OR CONTINUE WITH EMAIL

          <span
            style={{
              height: "1px",
              flex: 1,
              background:
                "currentColor",
              opacity: 0.25,
            }}
          />
        </div>

        {/* ERROR / INFO */}

        {message && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 14px",
              borderRadius: "13px",
              background:
                "rgba(255,100,120,.10)",
              border:
                "1px solid rgba(255,100,120,.18)",
              fontSize: "13px",
              lineHeight: 1.45,
            }}
          >
            {message}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "15px",
          }}
        >
          {!isLogin && (
            <>
              <div>
                <label style={labelStyle}>
                  Full Name
                </label>

                <div
                  style={inputWrapStyle}
                >
                  <User
                    size={18}
                    opacity={0.65}
                  />

                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) =>
                      updateField(
                        "name",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label
                    style={labelStyle}
                  >
                    Phone
                  </label>

                  <div
                    style={
                      inputWrapStyle
                    }
                  >
                    <Phone
                      size={18}
                      opacity={0.65}
                    />

                    <input
                      style={inputStyle}
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={form.phone}
                      onChange={(e) =>
                        updateField(
                          "phone",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={labelStyle}
                  >
                    Address
                  </label>

                  <div
                    style={
                      inputWrapStyle
                    }
                  >
                    <MapPin
                      size={18}
                      opacity={0.65}
                    />

                    <input
                      style={inputStyle}
                      type="text"
                      placeholder="City / Area"
                      value={
                        form.address
                      }
                      onChange={(e) =>
                        updateField(
                          "address",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>
              Email
            </label>

            <div
              style={inputWrapStyle}
            >
              <Mail
                size={18}
                opacity={0.65}
              />

              <input
                style={inputStyle}
                type="email"
                placeholder="you@gmail.com"
                value={form.email}
                onChange={(e) =>
                  updateField(
                    "email",
                    e.target.value
                  )
                }
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>
              Password
            </label>

            <div
              style={inputWrapStyle}
            >
              <Lock
                size={18}
                opacity={0.65}
              />

              <input
                style={inputStyle}
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="••••••••"
                value={
                  form.password
                }
                onChange={(e) =>
                  updateField(
                    "password",
                    e.target.value
                  )
                }
                autoComplete={
                  isLogin
                    ? "current-password"
                    : "new-password"
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) =>
                      !value
                  )
                }
                style={{
                  border: "none",
                  background:
                    "transparent",
                  color: "inherit",
                  opacity: 0.65,
                  cursor: "pointer",
                  display: "grid",
                  placeItems:
                    "center",
                }}
              >
                {showPassword ? (
                  <EyeOff
                    size={18}
                  />
                ) : (
                  <Eye
                    size={18}
                  />
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label style={labelStyle}>
                Confirm Password
              </label>

              <div
                style={
                  inputWrapStyle
                }
              >
                <Lock
                  size={18}
                  opacity={0.65}
                />

                <input
                  style={inputStyle}
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={
                    form.confirmPassword
                  }
                  onChange={(e) =>
                    updateField(
                      "confirmPassword",
                      e.target.value
                    )
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) =>
                        !value
                    )
                  }
                  style={{
                    border: "none",
                    background:
                      "transparent",
                    color: "inherit",
                    opacity: 0.65,
                    cursor: "pointer",
                    display: "grid",
                    placeItems:
                      "center",
                  }}
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>
              </div>
            </div>
          )}

          {isLogin && (
            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setMessage(
                    "Password reset will be added with the email verification flow."
                  )
                }
                style={{
                  border: "none",
                  background:
                    "transparent",
                  color: "inherit",
                  opacity: 0.7,
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="primary-button"
            style={{
              width: "100%",
              minHeight: "52px",
              justifyContent:
                "center",
              borderRadius: "16px",
              border: "none",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              opacity: loading
                ? 0.7
                : 1,
            }}
          >
            {loading ? (
              <>
                <RefreshCw
                  size={18}
                  className="loading-icon"
                />
                Please wait...
              </>
            ) : isLogin ? (
              <>
                <LogIn size={18} />
                Sign In
              </>
            ) : (
              <>
                <UserPlus
                  size={18}
                />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* SWITCH */}

        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
            fontSize: "13px",
            opacity: 0.78,
          }}
        >
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "inherit",
                  fontWeight: 750,
                }}
              >
                Create account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "inherit",
                  fontWeight: 750,
                }}
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/")
          }
          style={{
            width: "100%",
            marginTop: "18px",
            border: "none",
            background:
              "transparent",
            color: "inherit",
            opacity: 0.58,
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ← Continue shopping
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE PAGE
========================================================= */

function ProfilePage() {
  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState(null);

  const [orders, setOrders] =
    useState([]);

  const [loadingOrders, setLoadingOrders] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [cancellingId, setCancellingId] =
    useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token =
          localStorage.getItem(
            "shopvista_token"
          );

        const savedCustomer =
          localStorage.getItem(
            "shopvista_customer"
          );

        if (
          !token ||
          !savedCustomer
        ) {
          navigate("/login", {
            replace: true,
          });
          return;
        }

        setCustomer(
          JSON.parse(savedCustomer)
        );

        const response =
          await fetch(
            "http://localhost:5000/api/orders",
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to load orders."
          );
        }

        setOrders(
          Array.isArray(
            data.orders
          )
            ? data.orders
            : []
        );
      } catch (error) {
        console.error(
          "Profile Load Error:",
          error
        );

        setMessage(
          error.message ||
            "Unable to load profile."
        );
      } finally {
        setLoadingOrders(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem(
      "shopvista_token"
    );

    localStorage.removeItem(
      "shopvista_customer"
    );

    navigate("/login", {
      replace: true,
    });

    window.location.reload();
  };

  const handleCancelOrder = async (
    orderId
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order?"
      )
    ) {
      return;
    }

    try {
      setCancellingId(orderId);
      setMessage("");

      const token =
        localStorage.getItem(
          "shopvista_token"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      const response =
        await fetch(
          `http://localhost:5000/api/orders/${orderId}/cancel`,
          {
            method: "PUT",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to cancel order."
        );
      }

      setOrders(
        (previousOrders) =>
          previousOrders.map(
            (order) =>
              order.order_id ===
              orderId
                ? {
                    ...order,
                    status:
                      "Cancelled",
                  }
                : order
          )
      );

      setMessage(
        "Order cancelled successfully."
      );
    } catch (error) {
      console.error(
        "Cancel Order Error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to cancel order."
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (!customer) {
    return (
      <div
        className="app auth-app"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          className="glass"
          style={{
            padding: "30px",
            borderRadius: "24px",
          }}
        >
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div
      className="app auth-app"
      style={{
        minHeight: "100vh",
        padding: "34px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "430px",
          height: "430px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(120,150,255,.22), transparent 68%)",
          top: "-170px",
          left: "-150px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "430px",
          height: "430px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(190,120,255,.18), transparent 68%)",
          bottom: "-180px",
          right: "-140px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="glass"
          style={{
            padding: "16px 20px",
            borderRadius: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: "16px",
            marginBottom: "18px",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              color: "inherit",
              textDecoration: "none",
              fontSize: "21px",
              fontWeight: 800,
            }}
          >
            <span
              style={{
                width: "38px",
                height: "38px",
                display: "grid",
                placeItems: "center",
                borderRadius: "12px",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,.62), rgba(255,255,255,.18))",
                border:
                  "1px solid rgba(255,255,255,.72)",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 25 25"
              >
                <rect
                  x="5.2"
                  y="5.2"
                  width="14.6"
                  height="14.6"
                  rx="1.6"
                  transform="rotate(45 12.5 12.5)"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                />
              </svg>
            </span>

            ShopVista
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="primary-button"
            style={{
              border: "none",
              cursor: "pointer",
              borderRadius: "13px",
              padding: "10px 16px",
            }}
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

        <div
          className="glass"
          style={{
            borderRadius: "30px",
            padding: "34px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                width: "86px",
                height: "86px",
                margin:
                  "0 auto 16px",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(145deg, #62adff, #1769ed)",
                color: "#fff",
                fontSize: "32px",
                fontWeight: 800,
                boxShadow:
                  "0 14px 35px rgba(35,110,235,.25)",
              }}
            >
              {(customer.name ||
                "U")
                .trim()
                .charAt(0)
                .toUpperCase()}
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "30px",
              }}
            >
              My Profile
            </h1>

            <p
              style={{
                margin:
                  "7px 0 0",
                opacity: 0.68,
              }}
            >
              Manage your ShopVista account
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            {[
              [
                User,
                "Full Name",
                customer.name,
              ],
              [
                Mail,
                "Email",
                customer.email,
              ],
              [
                Phone,
                "Phone",
                customer.phone,
              ],
              [
                MapPin,
                "Address",
                customer.address,
              ],
            ].map(
              ([
                Icon,
                label,
                value,
              ]) => (
                <div
                  key={label}
                  style={{
                    padding: "18px",
                    borderRadius:
                      "18px",
                    background:
                      "rgba(255,255,255,.10)",
                    border:
                      "1px solid rgba(255,255,255,.14)",
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "9px",
                      marginBottom:
                        "8px",
                      opacity: 0.65,
                      fontSize: "12px",
                      fontWeight: 650,
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </div>

                  <strong
                    style={{
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {value ||
                      "Not provided"}
                  </strong>
                </div>
              )
            )}
          </div>

          {message && (
            <div
              style={{
                marginTop: "20px",
                padding: "13px 15px",
                borderRadius: "15px",
                background:
                  "rgba(70,160,255,.10)",
                border:
                  "1px solid rgba(70,160,255,.18)",
                fontSize: "13px",
              }}
            >
              {message}
            </div>
          )}

          {/* =================================================
              MY ORDERS
          ================================================= */}

          <div
            style={{
              marginTop: "34px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "23px",
                }}
              >
                My Orders
              </h2>

              <span
                style={{
                  opacity: 0.65,
                  fontSize: "13px",
                }}
              >
                {orders.length}{" "}
                {orders.length === 1
                  ? "Order"
                  : "Orders"}
              </span>
            </div>

            {loadingOrders ? (
              <div
                style={{
                  padding:
                    "35px 20px",
                  textAlign:
                    "center",
                  borderRadius:
                    "20px",
                  background:
                    "rgba(255,255,255,.07)",
                  border:
                    "1px solid rgba(255,255,255,.12)",
                  opacity: 0.7,
                }}
              >
                Loading orders...
              </div>
            ) : orders.length ===
              0 ? (
              <div
                style={{
                  padding:
                    "45px 20px",
                  textAlign:
                    "center",
                  borderRadius:
                    "20px",
                  background:
                    "rgba(255,255,255,.07)",
                  border:
                    "1px solid rgba(255,255,255,.12)",
                }}
              >
                <ShoppingBag
                  size={42}
                  style={{
                    marginBottom:
                      "10px",
                    opacity: 0.55,
                  }}
                />

                <h3
                  style={{
                    margin:
                      "0 0 7px",
                  }}
                >
                  No Orders Yet
                </h3>

                <p
                  style={{
                    margin:
                      "0 0 18px",
                    opacity: 0.62,
                    fontSize:
                      "14px",
                  }}
                >
                  Start shopping and
                  your orders will appear
                  here.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/")
                  }
                  className="primary-button"
                  style={{
                    border: "none",
                    borderRadius:
                      "14px",
                    padding:
                      "11px 18px",
                    cursor:
                      "pointer",
                  }}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "14px",
                }}
              >
                {orders.map(
                  (order) => {
                    const details =
                      Array.isArray(
                        order.OrderDetails
                      )
                        ? order.OrderDetails
                        : [];

                    const canCancel =
                      ![
                        "Shipped",
                        "Delivered",
                        "Cancelled",
                      ].includes(
                        order.status
                      );

                    return (
                      <div
                        key={
                          order.order_id
                        }
                        style={{
                          padding:
                            "20px",
                          borderRadius:
                            "22px",
                          background:
                            "rgba(255,255,255,.08)",
                          border:
                            "1px solid rgba(255,255,255,.13)",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "space-between",
                            gap: "12px",
                            marginBottom:
                              "15px",
                          }}
                        >
                          <div>
                            <strong
                              style={{
                                fontSize:
                                  "17px",
                              }}
                            >
                              Order #
                              {
                                order.order_id
                              }
                            </strong>

                            <div
                              style={{
                                fontSize:
                                  "12px",
                                opacity:
                                  0.58,
                                marginTop:
                                  "4px",
                              }}
                            >
                              {order.order_date
                                ? new Date(
                                    order.order_date
                                  ).toLocaleDateString(
                                    "en-BD"
                                  )
                                : ""}
                            </div>
                          </div>

                          <span
                            style={{
                              padding:
                                "7px 12px",
                              borderRadius:
                                "999px",
                              fontSize:
                                "12px",
                              fontWeight:
                                700,
                              background:
                                order.status ===
                                "Cancelled"
                                  ? "rgba(255,80,100,.12)"
                                  : "rgba(40,125,242,.12)",
                              border:
                                "1px solid rgba(255,255,255,.12)",
                            }}
                          >
                            {order.status ||
                              "Pending"}
                          </span>
                        </div>

                        <div
                          style={{
                            display:
                              "grid",
                            gap: "9px",
                            marginBottom:
                              "16px",
                          }}
                        >
                          {details.length >
                          0 ? (
                            details.map(
                              (
                                detail
                              ) => {
                                const product =
                                  detail.Product ||
                                  {};

                                const image =
                                  product.image
                                    ? product.image.startsWith(
                                        "http"
                                      ) ||
                                      product.image.startsWith(
                                        "/"
                                      )
                                      ? product.image
                                      : `/images/${product.image}`
                                    : "/images/iphone15.png";

                                return (
                                  <div
                                    key={
                                      detail.order_detail_id
                                    }
                                    style={{
                                      display:
                                        "flex",
                                      alignItems:
                                        "center",
                                      gap: "12px",
                                      padding:
                                        "10px",
                                      borderRadius:
                                        "15px",
                                      background:
                                        "rgba(255,255,255,.06)",
                                    }}
                                  >
                                    <img
                                      src={
                                        image
                                      }
                                      alt={
                                        product.name ||
                                        "Product"
                                      }
                                      style={{
                                        width:
                                          "55px",
                                        height:
                                          "55px",
                                        objectFit:
                                          "contain",
                                        borderRadius:
                                          "12px",
                                        background:
                                          "rgba(255,255,255,.08)",
                                      }}
                                      onError={(
                                        e
                                      ) => {
                                        e.currentTarget.src =
                                          "/images/iphone15.png";
                                      }}
                                    />

                                    <div
                                      style={{
                                        flex: 1,
                                        minWidth:
                                          0,
                                      }}
                                    >
                                      <strong
                                        style={{
                                          display:
                                            "block",
                                          marginBottom:
                                            "3px",
                                        }}
                                      >
                                        {product.name ||
                                          "Product"}
                                      </strong>

                                      <span
                                        style={{
                                          fontSize:
                                            "12px",
                                          opacity:
                                            0.6,
                                        }}
                                      >
                                        Qty:{" "}
                                        {
                                          detail.quantity
                                        }
                                      </span>
                                    </div>

                                    <strong>
                                      {formatBDT(
                                        detail.subtotal
                                      )}
                                    </strong>
                                  </div>
                                );
                              }
                            )
                          ) : (
                            <div
                              style={{
                                opacity:
                                  0.6,
                                fontSize:
                                  "13px",
                              }}
                            >
                              Order items
                              unavailable.
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "space-between",
                            gap: "12px",
                            paddingTop:
                              "14px",
                            borderTop:
                              "1px solid rgba(255,255,255,.10)",
                          }}
                        >
                          <div>
                            <span
                              style={{
                                display:
                                  "block",
                                fontSize:
                                  "12px",
                                opacity:
                                  0.58,
                                marginBottom:
                                  "3px",
                              }}
                            >
                              Total
                            </span>

                            <strong
                              style={{
                                fontSize:
                                  "18px",
                              }}
                            >
                              {formatBDT(
                                order.total_amount
                              )}
                            </strong>
                          </div>

                          {canCancel && (
                            <button
                              type="button"
                              disabled={
                                cancellingId ===
                                order.order_id
                              }
                              onClick={() =>
                                handleCancelOrder(
                                  order.order_id
                                )
                              }
                              style={{
                                minHeight:
                                  "42px",
                                padding:
                                  "0 14px",
                                borderRadius:
                                  "13px",
                                border:
                                  "1px solid rgba(255,80,100,.20)",
                                background:
                                  "rgba(255,80,100,.08)",
                                color:
                                  "inherit",
                                cursor:
                                  "pointer",
                                fontWeight:
                                  650,
                                opacity:
                                  cancellingId ===
                                  order.order_id
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              {cancellingId ===
                              order.order_id
                                ? "Cancelling..."
                                : "Cancel Order"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "12px",
              marginTop: "25px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              style={{
                minHeight: "50px",
                borderRadius: "15px",
                border:
                  "1px solid rgba(255,255,255,.18)",
                background:
                  "rgba(255,255,255,.08)",
                color: "inherit",
                cursor: "pointer",
                fontWeight: 650,
              }}
            >
              ← Continue Shopping
            </button>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="primary-button"
              style={{
                minHeight: "50px",
                borderRadius:
                  "15px",
                border: "none",
                cursor:
                  "pointer",
                justifyContent:
                  "center",
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAYMENT BRAND LOGOS
========================================================= */

function BkashLogo() {
  return (
    <img
      src="/images/bkash-logo.png"
      alt="bKash"
      style={{
        width: "48px",
        height: "48px",
        objectFit: "contain",
        borderRadius: "10px",
        flexShrink: 0,
      }}
      onError={(e) => {
        e.currentTarget.style.display =
          "none";
      }}
    />
  );
}

function NagadLogo() {
  return (
    <img
      src="/images/nagad-logo.png"
      alt="Nagad"
      style={{
        width: "48px",
        height: "48px",
        objectFit: "contain",
        borderRadius: "10px",
        flexShrink: 0,
      }}
      onError={(e) => {
        e.currentTarget.style.display =
          "none";
      }}
    />
  );
}

/* =========================================================
   CHECKOUT PAGE
========================================================= */

function CheckoutPage() {
  const navigate = useNavigate();

  const [cart, setCart] =
    useState([]);

  const [customer, setCustomer] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("bKash");

  const [transactionId, setTransactionId] =
    useState("");

  const [paymentResult, setPaymentResult] =
    useState("success");

  useEffect(() => {
    try {
      const token =
        localStorage.getItem(
          "shopvista_token"
        );

      const savedCustomer =
        localStorage.getItem(
          "shopvista_customer"
        );

      const savedCart =
        localStorage.getItem(
          "shopvista_cart"
        );

      if (
        !token ||
        !savedCustomer
      ) {
        navigate("/login", {
          replace: true,
        });
        return;
      }

      setCustomer(
        JSON.parse(savedCustomer)
      );

      setCart(
        savedCart
          ? JSON.parse(savedCart)
          : []
      );
    } catch (error) {
      console.error(
        "Checkout Load Error:",
        error
      );

      navigate("/login", {
        replace: true,
      });
    }
  }, [navigate]);

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const formatCheckoutPrice = (
    amount
  ) => formatBDT(amount);

  const placeOrder = async () => {
    setMessage("");

    const token =
      localStorage.getItem(
        "shopvista_token"
      );

    if (!token) {
      navigate("/login");
      return;
    }

    if (!cart.length) {
      setMessage(
        "Your cart is empty."
      );
      return;
    }

    if (
      paymentMethod !==
        "Cash on Delivery" &&
      !transactionId.trim()
    ) {
      setMessage(
        "Transaction ID is required for bKash, Nagad and Card."
      );
      return;
    }

    try {
      setLoading(true);

      /* ===================================================
         STEP 1: CREATE ORDER
      =================================================== */

      const orderResponse =
        await fetch(
          "http://localhost:5000/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              products: cart.map(
                (item) => ({
                  product_id:
                    item.id,
                  quantity:
                    item.quantity,
                })
              ),
            }),
          }
        );

      const orderData =
        await orderResponse.json();

      if (
        !orderResponse.ok ||
        !orderData.success
      ) {
        throw new Error(
          orderData.message ||
            "Unable to create order."
        );
      }

      const createdOrder =
        orderData.order;

      /* ===================================================
         STEP 2: CREATE PAYMENT
      =================================================== */

      const paymentResponse =
        await fetch(
          "http://localhost:5000/api/payments",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              order_id:
                createdOrder.order_id,

              payment_method:
                paymentMethod,

              transaction_id:
                transactionId.trim() ||
                null,

              payment_result:
                paymentMethod ===
                "Cash on Delivery"
                  ? "success"
                  : paymentResult,
            }),
          }
        );

      const paymentData =
        await paymentResponse.json();

      if (
        !paymentResponse.ok ||
        !paymentData.success
      ) {
        throw new Error(
          paymentData.message ||
            "Payment could not be recorded."
        );
      }

      localStorage.removeItem(
        "shopvista_cart"
      );

      navigate(
        `/order-success/${createdOrder.order_id}`,
        {
          state: {
            order:
              paymentData.order ||
              createdOrder,

            payment:
              paymentData.payment,
          },
        }
      );
    } catch (error) {
      console.error(
        "Order / Payment Error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return (
      <div
        className="app auth-app"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          className="glass"
          style={{
            padding: "30px",
            borderRadius: "24px",
          }}
        >
          Loading checkout...
        </div>
      </div>
    );
  }

  return (
    <div
      className="app auth-app"
      style={{
        minHeight: "100vh",
        padding: "34px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "430px",
          height: "430px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(120,150,255,.22), transparent 68%)",
          top: "-170px",
          left: "-150px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="glass"
          style={{
            padding: "17px 20px",
            borderRadius: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            marginBottom: "20px",
          }}
        >
          <Link
            to="/"
            style={{
              color: "inherit",
              textDecoration: "none",
              fontSize: "21px",
              fontWeight: 800,
            }}
          >
            <div className="brand-icon">
              <img
                src="/images/shopvista-logo.png"
                alt="ShopVista"
              />
            </div>
            <span>
              ShopVista
            </span>
          </Link>

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            style={{
              border: "none",
              background:
                "transparent",
              color: "inherit",
              cursor: "pointer",
              opacity: 0.7,
            }}
          >
            Continue Shopping
          </button>
        </div>

        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
            }}
          >
            Checkout
          </h1>

          <p
            style={{
              margin:
                "7px 0 0",
              opacity: 0.65,
            }}
          >
            Review your order before
            placing it.
          </p>
        </div>

        {message && (
          <div
            style={{
              marginBottom: "18px",
              padding: "13px 15px",
              borderRadius: "15px",
              background:
                "rgba(255,80,100,.10)",
              border:
                "1px solid rgba(255,80,100,.18)",
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1.45fr) minmax(300px, .75fr)",
            gap: "20px",
          }}
        >
          <div
            className="glass"
            style={{
              padding: "25px",
              borderRadius: "26px",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 18px",
                fontSize: "21px",
              }}
            >
              Delivery Information
            </h2>

            <div
              style={{
                display: "grid",
                gap: "12px",
                marginBottom:
                  "28px",
              }}
            >
              {[
                [
                  "Name",
                  customer.name,
                ],
                [
                  "Email",
                  customer.email,
                ],
                [
                  "Phone",
                  customer.phone,
                ],
                [
                  "Address",
                  customer.address,
                ],
              ].map(
                ([label, value]) => (
                  <div
                    key={label}
                    style={{
                      padding:
                        "14px 16px",
                      borderRadius:
                        "15px",
                      background:
                        "rgba(255,255,255,.08)",
                      border:
                        "1px solid rgba(255,255,255,.12)",
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          "11px",
                        opacity:
                          0.58,
                        marginBottom:
                          "5px",
                        fontWeight:
                          700,
                      }}
                    >
                      {label}
                    </div>

                    <strong>
                      {value ||
                        "Not provided"}
                    </strong>
                  </div>
                )
              )}
            </div>

            <h2
              style={{
                margin:
                  "0 0 18px",
                fontSize: "21px",
              }}
            >
              Order Items
            </h2>

            {cart.length === 0 ? (
              <div
                style={{
                  textAlign:
                    "center",
                  padding:
                    "45px 20px",
                  opacity: 0.65,
                }}
              >
                <ShoppingCart
                  size={42}
                  style={{
                    marginBottom:
                      "10px",
                  }}
                />

                <div>
                  Your cart is empty.
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                {cart.map(
                  (item) => (
                    <div
                      key={item.id}
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "14px",
                        padding:
                          "13px",
                        borderRadius:
                          "18px",
                        background:
                          "rgba(255,255,255,.07)",
                        border:
                          "1px solid rgba(255,255,255,.11)",
                      }}
                    >
                      <img
                        src={
                          item.image
                            ? item.image.startsWith(
                                "http"
                              ) ||
                              item.image.startsWith(
                                "/"
                              )
                              ? item.image
                              : `/images/${item.image}`
                            : "/images/iphone15.png"
                        }
                        alt={item.name}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit:
                            "contain",
                          borderRadius:
                            "14px",
                          background:
                            "rgba(255,255,255,.08)",
                        }}
                        onError={(
                          e
                        ) => {
                          e.currentTarget.src =
                            "/images/iphone15.png";
                        }}
                      />

                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <strong
                          style={{
                            display:
                              "block",
                            marginBottom:
                              "5px",
                          }}
                        >
                          {item.name}
                        </strong>

                        <span
                          style={{
                            opacity:
                              0.62,
                            fontSize:
                              "13px",
                          }}
                        >
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </span>
                      </div>

                      <strong>
                        {formatCheckoutPrice(
                          Number(
                            item.price
                          ) *
                            Number(
                              item.quantity
                            )
                        )}
                      </strong>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div
            className="glass"
            style={{
              padding: "25px",
              borderRadius: "26px",
              alignSelf:
                "start",
              position:
                "sticky",
              top: "20px",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 18px",
                fontSize: "21px",
              }}
            >
              Payment Method
            </h2>

            <div
              style={{
                display: "grid",
                gap: "10px",
                marginBottom:
                  "20px",
              }}
            >
              {[
                {
                  value: "bKash",
                  label: "bKash",
                  logo: "bkash",
                },
                {
                  value: "Nagad",
                  label: "Nagad",
                  logo: "nagad",
                },
                {
                  value: "Card",
                  label: "Card",
                  logo: null,
                },
                {
                  value:
                    "Cash on Delivery",
                  label:
                    "Cash on Delivery",
                  logo: null,
                },
              ].map(
                (method) => {
                  const selected =
                    paymentMethod ===
                    method.value;

                  return (
                    <button
                      key={
                        method.value
                      }
                      type="button"
                      onClick={() => {
                        setPaymentMethod(
                          method.value
                        );
                        setMessage("");
                      }}
                      style={{
                        width:
                          "100%",
                        minHeight:
                          "70px",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "12px",
                        padding:
                          "10px 18px",
                        borderRadius:
                          "18px",
                        border:
                          selected
                            ? "2px solid #287df2"
                            : "1px solid rgba(255,255,255,.18)",
                        background:
                          selected
                            ? "rgba(40,125,242,.10)"
                            : "rgba(255,255,255,.07)",
                        color:
                          "inherit",
                        cursor:
                          "pointer",
                        textAlign:
                          "left",
                      }}
                    >
                      {method.logo ===
                      "bkash" ? (
                        <BkashLogo />
                      ) : method.logo ===
                        "nagad" ? (
                        <NagadLogo />
                      ) : (
                        <span
                          style={{
                            width:
                              "48px",
                            height:
                              "48px",
                            display:
                              "grid",
                            placeItems:
                              "center",
                            flexShrink:
                              0,
                            fontSize:
                              "24px",
                          }}
                        >
                          {method.value ===
                          "Card"
                            ? "💳"
                            : "💵"}
                        </span>
                      )}

                      <span
                        style={{
                          flex: 1,
                          fontWeight:
                            700,
                        }}
                      >
                        {
                          method.label
                        }
                      </span>

                      <span
                        style={{
                          width:
                            "19px",
                          height:
                            "19px",
                          borderRadius:
                            "50%",
                          border:
                            "2px solid currentColor",
                          display:
                            "grid",
                          placeItems:
                            "center",
                          opacity:
                            selected
                              ? 1
                              : 0.4,
                        }}
                      >
                        {selected && (
                          <span
                            style={{
                              width:
                                "9px",
                              height:
                                "9px",
                              borderRadius:
                                "50%",
                              background:
                                "#287df2",
                            }}
                          />
                        )}
                      </span>
                    </button>
                  );
                }
              )}
            </div>

            {paymentMethod !==
              "Cash on Delivery" && (
              <div
                style={{
                  marginBottom:
                    "22px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    fontSize:
                      "12px",
                    fontWeight:
                      700,
                    opacity:
                      0.7,
                    marginBottom:
                      "8px",
                  }}
                >
                  {paymentMethod}{" "}
                  Transaction ID
                </label>

                <input
                  value={
                    transactionId
                  }
                  onChange={(e) =>
                    setTransactionId(
                      e.target.value
                    )
                  }
                  placeholder={
                    paymentMethod ===
                    "Card"
                      ? "Enter payment reference / transaction ID"
                      : `Enter ${paymentMethod} transaction ID`
                  }
                  style={{
                    width:
                      "100%",
                    boxSizing:
                      "border-box",
                    minHeight:
                      "48px",
                    padding:
                      "0 14px",
                    borderRadius:
                      "14px",
                    border:
                      "1px solid rgba(255,255,255,.20)",
                    outline:
                      "none",
                    background:
                      "rgba(255,255,255,.10)",
                    color:
                      "inherit",
                    fontSize:
                      "14px",
                  }}
                />

                <div
                  style={{
                    marginTop:
                      "8px",
                    fontSize:
                      "11px",
                    lineHeight:
                      1.45,
                    opacity:
                      0.55,
                  }}
                >
                  Enter the transaction/reference
                  ID returned by your payment
                  provider.
                </div>
              </div>
            )}

            <h2
              style={{
                margin:
                  "0 0 22px",
                fontSize: "21px",
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                display: "grid",
                gap: "13px",
                paddingBottom:
                  "18px",
                borderBottom:
                  "1px solid rgba(255,255,255,.12)",
              }}
            >
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  gap: "15px",
                }}
              >
                <span
                  style={{
                    opacity:
                      0.65,
                  }}
                >
                  Subtotal
                </span>

                <strong>
                  {formatCheckoutPrice(
                    subtotal
                  )}
                </strong>
              </div>

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  gap: "15px",
                }}
              >
                <span
                  style={{
                    opacity:
                      0.65,
                  }}
                >
                  Delivery
                </span>

                <strong>
                  Free
                </strong>
              </div>
            </div>

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                gap: "15px",
                margin:
                  "20px 0",
              }}
            >
              <strong>
                Total
              </strong>

              <strong
                style={{
                  fontSize:
                    "21px",
                }}
              >
                {formatCheckoutPrice(
                  subtotal
                )}
              </strong>
            </div>

            <button
              type="button"
              onClick={
                placeOrder
              }
              disabled={
                loading ||
                cart.length ===
                  0
              }
              className="primary-button"
              style={{
                width: "100%",
                minHeight:
                  "54px",
                border:
                  "none",
                borderRadius:
                  "16px",
                justifyContent:
                  "center",
                cursor:
                  loading ||
                  cart.length ===
                    0
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  loading ||
                  cart.length ===
                    0
                    ? 0.55
                    : 1,
              }}
            >
              {loading ? (
                <>
                  <RefreshCw
                    size={18}
                    className="loading-icon"
                  />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart
                    size={18}
                  />

                  {paymentMethod ===
                  "Cash on Delivery"
                    ? "Place Order"
                    : `Pay ${formatCheckoutPrice(
                        subtotal
                      )}`}
                </>
              )}
            </button>

            <p
              style={{
                fontSize:
                  "11px",
                lineHeight:
                  1.5,
                opacity:
                  0.55,
                margin:
                  "14px 0 0",
                textAlign:
                  "center",
              }}
            >
              Your order will be saved
              securely to your ShopVista
              account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ORDER SUCCESS PAGE
========================================================= */

function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <div
      className="app auth-app"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "30px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND GLOW */}

      <div
        style={{
          position: "absolute",
          width: "430px",
          height: "430px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(70,140,255,.22), transparent 68%)",
          top: "-170px",
          left: "-150px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "430px",
          height: "430px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(110,190,255,.18), transparent 68%)",
          bottom: "-180px",
          right: "-140px",
          pointerEvents: "none",
        }}
      />

      {/* SUCCESS CARD */}

      <div
        className="glass"
        style={{
          width: "100%",
          maxWidth: "560px",
          padding:
            "50px 38px 42px",
          borderRadius: "32px",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent)",
          }}
        />

        {/* SUCCESS ICON */}

        <div
          style={{
            width: "92px",
            height: "92px",
            margin:
              "0 auto 24px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background:
              "linear-gradient(145deg, rgba(70,200,130,.20), rgba(70,200,130,.08))",
            border:
              "1px solid rgba(70,200,130,.32)",
            boxShadow:
              "0 12px 35px rgba(40,180,110,.15), inset 0 1px 0 rgba(255,255,255,.45)",
            color: "#25b96f",
            fontSize: "42px",
            fontWeight: 800,
          }}
        >
          ✓
        </div>

        <h1
          style={{
            margin:
              "0 0 12px",
            fontSize: "34px",
            lineHeight: 1.2,
            letterSpacing:
              "-0.7px",
          }}
        >
          Order Successful!
        </h1>

        <p
          style={{
            margin:
              "0 0 7px",
            fontSize: "16px",
            lineHeight: 1.6,
            opacity: 0.72,
          }}
        >
          Your order has been
          placed successfully.
        </p>

        <p
          style={{
            margin:
              "0 0 32px",
            fontSize: "14px",
            lineHeight: 1.6,
            opacity: 0.55,
          }}
        >
          Thank you for shopping
          with ShopVista.
        </p>

        {/* ORDER CONFIRMED */}

        <div
          style={{
            display:
              "inline-flex",
            alignItems:
              "center",
            gap: "8px",
            padding:
              "9px 15px",
            marginBottom:
              "30px",
            borderRadius:
              "999px",
            background:
              "rgba(70,190,125,.09)",
            border:
              "1px solid rgba(70,190,125,.18)",
            fontSize: "12px",
            fontWeight: 700,
            color: "#22a968",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius:
                "50%",
              background:
                "#28b873",
              boxShadow:
                "0 0 10px rgba(40,184,115,.55)",
            }}
          />

          Order Confirmed
        </div>

        {/* ACTION BUTTONS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={() =>
              navigate(
                "/profile"
              )
            }
            className="primary-button"
            style={{
              minHeight: "52px",
              borderRadius:
                "16px",
              border: "none",
              cursor:
                "pointer",
              justifyContent:
                "center",
              fontWeight: 700,
              fontSize: "14px",
              background:
                "linear-gradient(135deg, #1769ed, #62adff)",
              boxShadow:
                "0 10px 25px rgba(35,110,235,.20)",
            }}
          >
            View My Orders
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            style={{
              minHeight: "52px",
              borderRadius:
                "16px",
              border:
                "1px solid rgba(255,255,255,.18)",
              background:
                "rgba(255,255,255,.08)",
              color: "inherit",
              cursor:
                "pointer",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            Continue Shopping
          </button>
        </div>

        <p
          style={{
            margin:
              "24px 0 0",
            fontSize: "11px",
            opacity: 0.42,
          }}
        >
          ShopVista • Thank you
          for your purchase
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [darkMode, setDarkMode] =
    useState(false);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [cart, setCart] = useState(
    () => {
      try {
        const savedCart =
          localStorage.getItem(
            "shopvista_cart"
          );

        return savedCart
          ? JSON.parse(
              savedCart
            )
          : [];
      } catch (error) {
        console.error(
          "Cart Load Error:",
          error
        );

        return [];
      }
    }
  );

  const [wishlist, setWishlist] =
    useState(() => {
      try {
        const savedWishlist =
          localStorage.getItem(
            "shopvista_wishlist"
          );

        return savedWishlist
          ? JSON.parse(
              savedWishlist
            )
          : [];
      } catch (error) {
        console.error(
          "Wishlist Load Error:",
          error
        );

        return [];
      }
    });

  const [heroIndex, setHeroIndex] =
    useState(0);

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const data =
        await response.json();

      console.log(
        "PRODUCT API RESPONSE:",
        data
      );

      console.log(
        "PRODUCT COUNT FROM API:",
        Array.isArray(
          data.products
        )
          ? data.products.length
          : 0
      );

      console.log(
        "PRODUCT IDs FROM API:",
        Array.isArray(
          data.products
        )
          ? data.products.map(
              (product) =>
                product.id
            )
          : []
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to load products"
        );
      }

      setProducts(
        Array.isArray(
          data.products
        )
          ? data.products
          : []
      );
    } catch (err) {
      console.error(
        "Product Fetch Error:",
        err
      );

      setError(
        "Unable to load products. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =====================================================
     SAVE CART
  ===================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        "shopvista_cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Cart Save Error:",
        error
      );
    }
  }, [cart]);

  /* =====================================================
     SAVE WISHLIST
  ===================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        "shopvista_wishlist",
        JSON.stringify(
          wishlist
        )
      );
    } catch (error) {
      console.error(
        "Wishlist Save Error:",
        error
      );
    }
  }, [wishlist]);

  /* =====================================================
     HERO SLIDESHOW
     3.5 SECOND
  ===================================================== */

  useEffect(() => {
    const interval =
      setInterval(() => {
        setHeroIndex(
          (prev) =>
            (prev + 1) %
            heroImages.length
        );
      }, 3500);

    return () =>
      clearInterval(interval);
  }, []);

  /* =====================================================
     IMAGE PATH
  ===================================================== */

  const getProductImage = (
    image
  ) => {
    if (!image) {
      return "/images/iphone15.png";
    }

    if (
      image.startsWith(
        "http://"
      ) ||
      image.startsWith(
        "https://"
      )
    ) {
      return image;
    }

    if (
      image.startsWith(
        "/uploads/"
      )
    ) {
      return `http://localhost:5000${image}`;
    }

    if (image.startsWith("/")) {
      return image;
    }

    return `/images/${image}`;
  };

  /* =====================================================
     CATEGORIES
  ===================================================== */

  const productCategories =
    useMemo(() => {
      const uniqueCategories = [
        ...new Set(
          products
            .map(
              (product) =>
                product.category
            )
            .filter(Boolean)
        ),
      ];

      return uniqueCategories;
    }, [products]);

  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts =
    useMemo(() => {
      return products.filter(
        (product) => {
          const search =
            searchTerm
              .trim()
              .toLowerCase();

          const matchesSearch =
            !search ||
            product.name
              ?.toLowerCase()
              .includes(search) ||
            product.description
              ?.toLowerCase()
              .includes(search) ||
            product.category
              ?.toLowerCase()
              .includes(search);

          const matchesCategory =
            selectedCategory ===
              "All" ||
            product.category ===
              selectedCategory;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      products,
      searchTerm,
      selectedCategory,
    ]);

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(
      "All"
    );
  };

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const addToCart = (product) => {
    setCart(
      (previousCart) => {
        const existing =
          previousCart.find(
            (item) =>
              item.id ===
              product.id
          );

        if (existing) {
          return previousCart.map(
            (item) =>
              item.id ===
              product.id
                ? {
                    ...item,
                    quantity:
                      item.quantity +
                      1,
                  }
                : item
          );
        }

        return [
          ...previousCart,
          {
            ...product,
            quantity: 1,
          },
        ];
      }
    );
  };

  /* =====================================================
     REMOVE FROM CART
  ===================================================== */

  const removeFromCart = (
    productId
  ) => {
    setCart(
      (previousCart) =>
        previousCart.filter(
          (item) =>
            item.id !==
            productId
        )
    );
  };

  /* =====================================================
     UPDATE CART QUANTITY
  ===================================================== */

  const updateCartQuantity = (
    productId,
    change
  ) => {
    setCart(
      (previousCart) =>
        previousCart
          .map((item) => {
            if (
              item.id !==
              productId
            ) {
              return item;
            }

            const newQuantity =
              item.quantity +
              change;

            return {
              ...item,
              quantity:
                newQuantity,
            };
          })
          .filter(
            (item) =>
              item.quantity > 0
          )
    );
  };

  /* =====================================================
     WISHLIST
  ===================================================== */

  const toggleWishlist = (
    productId
  ) => {
    setWishlist(
      (previous) => {
        if (
          previous.includes(
            productId
          )
        ) {
          return previous.filter(
            (id) =>
              id !== productId
          );
        }

        return [
          ...previous,
          productId,
        ];
      }
    );
  };

  /* =====================================================
     CART TOTAL
  ===================================================== */

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  const cartItemCount =
    cart.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );

  /* =====================================================
     PRODUCT DETAILS PAGE
  ===================================================== */

  function ProductDetails() {
    const { id } = useParams();

    const navigate =
      useNavigate();

    const product =
      products.find(
        (item) =>
          String(item.id) ===
          String(id)
      );

    const [quantity, setQuantity] =
      useState(1);

    const [reviews, setReviews] =
      useState([]);

    const [averageRating, setAverageRating] =
      useState(0);

    const [totalReviews, setTotalReviews] =
      useState(0);

    const [reviewsLoading, setReviewsLoading] =
      useState(true);

    const [reviewRating, setReviewRating] =
      useState(5);

    const [reviewComment, setReviewComment] =
      useState("");

    const [reviewSubmitting, setReviewSubmitting] =
      useState(false);

    const [reviewMessage, setReviewMessage] =
      useState("");

    /* ===================================================
       FETCH REVIEWS
    =================================================== */

    const fetchReviews = async () => {
      try {
        setReviewsLoading(
          true
        );

        const response =
          await fetch(
            `http://localhost:5000/api/reviews/product/${id}`
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to load reviews."
          );
        }

        setReviews(
          Array.isArray(
            data.reviews
          )
            ? data.reviews
            : []
        );

        setAverageRating(
          Number(
            data.averageRating ||
              0
          )
        );

        setTotalReviews(
          Number(
            data.totalReviews ||
              0
          )
        );
      } catch (error) {
        console.error(
          "Review Fetch Error:",
          error
        );

        setReviews([]);
        setAverageRating(0);
        setTotalReviews(0);
      } finally {
        setReviewsLoading(
          false
        );
      }
    };

    useEffect(() => {
      fetchReviews();
    }, [id]);

    /* ===================================================
       SUBMIT REVIEW
    =================================================== */

    const submitReview = async (
      event
    ) => {
      event.preventDefault();

      setReviewMessage("");

      const token =
        localStorage.getItem(
          "shopvista_token"
        );

      /* LOGIN CHECK */

      if (!token) {
        navigate("/login");
        return;
      }

      /* RATING CHECK */

      if (
        !reviewRating ||
        Number(reviewRating) <
          1 ||
        Number(reviewRating) >
          5
      ) {
        setReviewMessage(
          "Please select a rating from 1 to 5 stars."
        );
        return;
      }

      /* COMMENT CHECK */

      const comment =
        reviewComment.trim();

      if (!comment) {
        setReviewMessage(
          "Please write a comment before submitting."
        );
        return;
      }

      if (comment.length < 3) {
        setReviewMessage(
          "Review must contain at least 3 characters."
        );
        return;
      }

      try {
        setReviewSubmitting(
          true
        );

        const response =
          await fetch(
            "http://localhost:5000/api/reviews",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                product_id:
                  Number(id),

                rating:
                  Number(
                    reviewRating
                  ),

                comment:
                  comment,
              }),
            }
          );

        const data =
          await response.json();

        console.log(
          "REVIEW SUBMIT RESPONSE:",
          data
        );

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to submit review."
          );
        }

        setReviewComment("");
        setReviewRating(5);

        setReviewMessage(
          "Review added successfully."
        );

        await fetchReviews();
      } catch (error) {
        console.error(
          "Review Submit Error:",
          error
        );

        setReviewMessage(
          error.message ||
            "Unable to submit review."
        );
      } finally {
        setReviewSubmitting(
          false
        );
      }
    };

    /* ===================================================
       LOADING
    =================================================== */

    if (loading) {
      return (
        <div
          className={
            darkMode
              ? "app dark"
              : "app"
          }
        >
          <div className="product-details-loading glass">
            <RefreshCw
              size={28}
              className="loading-icon"
            />

            <h2>
              Loading Product...
            </h2>
          </div>
        </div>
      );
    }

    /* ===================================================
       PRODUCT NOT FOUND
    =================================================== */

    if (!product) {
      return (
        <div
          className={
            darkMode
              ? "app dark"
              : "app"
          }
        >
          <div className="product-not-found">
            <div className="glass product-not-found-card">
              <h2>
                Product Not Found
              </h2>

              <p>
                The requested product
                could not be found.
              </p>

              <Link
                to="/"
                className="back-store-button"
              >
                <ArrowLeft
                  size={17}
                />
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      );
    }

    const liked =
      wishlist.includes(
        product.id
      );

    const productImage =
      getProductImage(
        product.image
      );

    /* ===================================================
       PRODUCT SPECIFICATIONS
    =================================================== */

    const productSpecifications =
      (() => {
        const raw =
          product.specifications;

        if (!raw) {
          return [];
        }

        try {
          const parsed =
            typeof raw ===
            "string"
              ? JSON.parse(raw)
              : raw;

          if (
            Array.isArray(
              parsed
            )
          ) {
            return parsed
              .map((item) => {
                if (
                  item &&
                  typeof item ===
                    "object" &&
                  !Array.isArray(
                    item
                  )
                ) {
                  const entries =
                    Object.entries(
                      item
                    );

                  if (
                    entries.length ===
                    1
                  ) {
                    return {
                      label:
                        entries[0][0],
                      value:
                        entries[0][1],
                    };
                  }
                }

                return {
                  label:
                    "Specification",
                  value:
                    item,
                };
              })
              .filter(
                (item) =>
                  item.value !==
                    null &&
                  item.value !==
                    undefined &&
                  item.value !== ""
              );
          }

          if (
            parsed &&
            typeof parsed ===
              "object"
          ) {
            return Object.entries(
              parsed
            )
              .filter(
                ([, value]) =>
                  value !==
                    null &&
                  value !==
                    undefined &&
                  value !== ""
              )
              .map(
                ([
                  label,
                  value,
                ]) => ({
                  label,
                  value,
                })
              );
          }

          return [];
        } catch (error) {
          console.error(
            "Product Specification Parse Error:",
            error
          );

          return [];
        }
      })();

    const formatSpecificationValue =
      (value) => {
        if (
          Array.isArray(
            value
          )
        ) {
          return value.join(
            ", "
          );
        }

        if (
          value &&
          typeof value ===
            "object"
        ) {
          return Object.entries(
            value
          )
            .map(
              ([key, item]) =>
                `${key}: ${
                  Array.isArray(
                    item
                  )
                    ? item.join(
                        ", "
                      )
                    : item
                }`
            )
            .join(" • ");
        }

        return String(value);
      };

    return (
      <div
        className={
          darkMode
            ? "app dark"
            : "app"
        }
      >
        {/* ================= NAVBAR ================= */}

        <header className="navbar glass">
     <Link
  to="/"
  className="brand"
>
  <div className="brand-icon">
    <img
      src="/images/shopvista-logo.png"
      alt="ShopVista"
    />
  </div>

  <span>
    ShopVista
  </span>
</Link>

          <nav className="nav-links">
            <Link to="/">
              Home
            </Link>

            <a href="/#products">
              Products
            </a>

            <a href="/#categories">
              Categories
            </a>

            <a href="/#deals">
              Deals
            </a>

            <a href="/#about">
              About
            </a>

            <a href="/#contact">
              Contact
            </a>
          </nav>

          <div className="search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search for products..."
              value={
                searchTerm
              }
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

            {searchTerm && (
              <button
                className="search-clear"
                onClick={() =>
                  setSearchTerm(
                    ""
                  )
                }
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="nav-actions">
            <button
              className="icon-button"
              title="Wishlist"
            >
              <Heart size={22} />
            </button>

            <Link
              to="/"
              className="icon-button cart-button"
              title="Cart"
            >
              <ShoppingCart
                size={22}
              />

              {cartItemCount >
                0 && (
                <span className="cart-badge">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              className="icon-button"
              title="Profile"
            >
              <User size={22} />
            </Link>

            <button
              className="theme-button"
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
          </div>
        </header>

        {/* ================= PRODUCT DETAILS ================= */}

        <main className="product-details-page">
          <Link
            to="/"
            className="details-back-button"
          >
            <ArrowLeft size={18} />
            Back to Store
          </Link>

          <section className="product-details glass">
            {/* IMAGE */}

            <div className="details-image-section">
              <div className="details-image-glow"></div>

              <img
                src={productImage}
                alt={product.name}
                className="details-product-image"
                onError={(e) => {
                  e.currentTarget.src =
                    "/images/iphone15.png";
                }}
              />
            </div>

            {/* INFORMATION */}

            <div className="details-info">
              <span className="details-category">
                {product.category}
              </span>

              <h1>
                {product.name}
              </h1>

              <div
                className="details-rating"
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "10px",
                  flexWrap:
                    "wrap",
                }}
              >
                <div
                  className="stars"
                  style={{
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap: "3px",
                  }}
                >
                  <Star
                    size={17}
                    fill="currentColor"
                  />

                  <span>
                    {averageRating >
                    0
                      ? averageRating.toFixed(
                          1
                        )
                      : "No rating"}
                  </span>
                </div>

                <span className="rating-text">
                  {totalReviews >
                  0
                    ? `${totalReviews} ${
                        totalReviews ===
                        1
                          ? "Review"
                          : "Reviews"
                      }`
                    : "No reviews yet"}
                </span>
              </div>

              <div className="details-price">
                {formatBDT(
                  product.price
                )}
              </div>

              <p className="details-description">
                {
                  product.description
                }
              </p>

              <div className="product-stock-info">
                <strong>
                  Stock:
                </strong>{" "}
                {product.stock}{" "}
                available
              </div>

              {/* QUANTITY */}

              <div className="quantity-section">
                <span>
                  Quantity
                </span>

                <div className="quantity-control">
                  <button
                    onClick={() =>
                      setQuantity(
                        (prev) =>
                          Math.max(
                            1,
                            prev - 1
                          )
                      )
                    }
                  >
                    <Minus
                      size={16}
                    />
                  </button>

                  <strong>
                    {quantity}
                  </strong>

                  <button
                    onClick={() =>
                      setQuantity(
                        (prev) =>
                          Math.min(
                            Number(
                              product.stock ||
                                99
                            ),
                            prev + 1
                          )
                      )
                    }
                  >
                    <Plus
                      size={16}
                    />
                  </button>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="details-actions">
                <button
                  className="details-add-cart"
                  onClick={() => {
                    for (
                      let i = 0;
                      i < quantity;
                      i++
                    ) {
                      addToCart(
                        product
                      );
                    }
                  }}
                >
                  <ShoppingCart
                    size={18}
                  />
                  Add to Cart
                </button>

                <button
                  className="details-buy-now"
                  onClick={() => {
                    const token =
                      localStorage.getItem(
                        "shopvista_token"
                      );

                    if (!token) {
                      navigate(
                        "/login"
                      );
                      return;
                    }

                    const buyNowItem =
                      {
                        ...product,
                        quantity:
                          quantity,
                      };

                    localStorage.setItem(
                      "shopvista_cart",
                      JSON.stringify(
                        [
                          buyNowItem,
                        ]
                      )
                    );

                    navigate(
                      "/checkout"
                    );
                  }}
                >
                  <ShoppingBag
                    size={18}
                  />
                  Buy Now
                </button>

                <button
                  className={
                    liked
                      ? "details-wishlist liked"
                      : "details-wishlist"
                  }
                  onClick={() =>
                    toggleWishlist(
                      product.id
                    )
                  }
                >
                  <Heart
                    size={20}
                    fill={
                      liked
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>

              {/* FEATURES */}

              <div className="details-features">
                <div className="details-feature">
                  <ShieldCheck
                    size={20}
                  />

                  <div>
                    <strong>
                      Secure Shopping
                    </strong>

                    <span>
                      Protected checkout
                    </span>
                  </div>
                </div>

                <div className="details-feature">
                  <Truck size={20} />

                  <div>
                    <strong>
                      Fast Delivery
                    </strong>

                    <span>
                      Quick & reliable shipping
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
             PRODUCT SPECIFICATIONS
          ================================================= */}

          <section
            className="glass"
            style={{
              marginTop: "22px",
              padding: "28px",
              borderRadius: "26px",
              position:
                "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize:
                    "25px",
                }}
              >
                Product Specification
              </h2>

              <p
                style={{
                  margin:
                    "6px 0 0",
                  opacity: 0.62,
                  fontSize:
                    "13px",
                }}
              >
                Product-specific
                details and features
              </p>
            </div>

            {productSpecifications.length ===
            0 ? (
              <div
                style={{
                  padding:
                    "25px 20px",
                  textAlign:
                    "center",
                  borderRadius:
                    "18px",
                  background:
                    "rgba(255,255,255,.06)",
                  border:
                    "1px solid rgba(255,255,255,.10)",
                  opacity: 0.68,
                }}
              >
                Specification
                information is not
                available for this
                product.
              </div>
            ) : (
              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "12px",
                }}
              >
                {productSpecifications.map(
                  (
                    {
                      label,
                      value,
                    },
                    index
                  ) => (
                    <div
                      key={`${label}-${index}`}
                      style={{
                        display:
                          "grid",
                        gridTemplateColumns:
                          "minmax(120px, .75fr) minmax(0, 1.25fr)",
                        gap: "14px",
                        alignItems:
                          "center",
                        padding:
                          "15px 16px",
                        borderRadius:
                          "16px",
                        background:
                          "rgba(255,255,255,.07)",
                        border:
                          "1px solid rgba(255,255,255,.11)",
                      }}
                    >
                      <span
                        style={{
                          fontSize:
                            "12px",
                          fontWeight:
                            700,
                          opacity:
                            0.62,
                          textTransform:
                            "capitalize",
                        }}
                      >
                        {String(
                          label
                        ).replace(
                          /[\_-]+/g,
                          " "
                        )}
                      </span>

                      <strong
                        style={{
                          fontSize:
                            "13px",
                          lineHeight:
                            1.5,
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {formatSpecificationValue(
                          value
                        )}
                      </strong>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          {/* =================================================
             PRODUCT REVIEWS
          ================================================= */}

          <section
            className="glass"
            style={{
              marginTop: "22px",
              padding: "28px",
              borderRadius: "26px",

              /* IMPORTANT:
                 Keeps review controls above possible
                 glass/overlay elements.
              */
              position:
                "relative",
              zIndex: 10,
              pointerEvents:
                "auto",
            }}
          >
            {/* REVIEW HEADER */}

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                gap: "15px",
                flexWrap:
                  "wrap",
                marginBottom:
                  "22px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize:
                      "25px",
                  }}
                >
                  Customer Reviews
                </h2>

                <p
                  style={{
                    margin:
                      "6px 0 0",
                    opacity: 0.62,
                    fontSize:
                      "13px",
                  }}
                >
                  {totalReviews >
                  0
                    ? `${totalReviews} customer ${
                        totalReviews ===
                        1
                          ? "review"
                          : "reviews"
                      }`
                    : "Be the first to review this product."}
                </p>
              </div>

              {/* AVERAGE RATING */}

              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "8px",
                  padding:
                    "10px 14px",
                  borderRadius:
                    "14px",
                  background:
                    "rgba(255,255,255,.09)",
                  border:
                    "1px solid rgba(255,255,255,.12)",
                }}
              >
                <Star
                  size={19}
                  fill="currentColor"
                  style={{
                    color:
                      "#f5b301",
                  }}
                />

                <strong>
                  {averageRating >
                  0
                    ? averageRating.toFixed(
                        1
                      )
                    : "0.0"}
                </strong>

                <span
                  style={{
                    fontSize:
                      "12px",
                    opacity: 0.62,
                  }}
                >
                  / 5
                </span>
              </div>
            </div>

            {/* =================================================
               WRITE REVIEW FORM
            ================================================= */}

            <form
              onSubmit={
                submitReview
              }
              style={{
                position:
                  "relative",
                zIndex: 50,
                pointerEvents:
                  "auto",
                padding:
                  "20px",
                borderRadius:
                  "20px",
                background:
                  "rgba(255,255,255,.07)",
                border:
                  "1px solid rgba(255,255,255,.12)",
                marginBottom:
                  "22px",
              }}
            >
              <h3
                style={{
                  margin:
                    "0 0 14px",
                  fontSize:
                    "17px",
                }}
              >
                Write a Review
              </h3>

              {/* STAR RATING */}

              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "6px",
                  marginBottom:
                    "15px",
                  position:
                    "relative",
                  zIndex: 100,
                  pointerEvents:
                    "auto",
                }}
              >
                <span
                  style={{
                    fontSize:
                      "13px",
                    opacity: 0.68,
                    marginRight:
                      "6px",
                  }}
                >
                  Your Rating:
                </span>

                {Array.from(
                  { length: 5 },
                  (_, index) => {
                    const starNumber =
                      index + 1;

                    const selected =
                      starNumber <=
                      reviewRating;

                    return (
                      <button
                        key={
                          starNumber
                        }
                        type="button"
                        onClick={(
                          event
                        ) => {
                          event.preventDefault();
                          event.stopPropagation();

                          setReviewRating(
                            starNumber
                          );

                          setReviewMessage(
                            ""
                          );
                        }}
                        aria-label={`${starNumber} star rating`}
                        title={`${starNumber} star`}
                        style={{
                          border:
                            "none",
                          outline:
                            "none",
                          background:
                            "transparent",
                          padding:
                            "3px",
                          margin: 0,
                          cursor:
                            "pointer",
                          color:
                            selected
                              ? "#f5b301"
                              : "rgba(120,145,175,.55)",
                          display:
                            "grid",
                          placeItems:
                            "center",
                          position:
                            "relative",
                          zIndex: 200,
                          pointerEvents:
                            "auto",
                          appearance:
                            "none",
                        }}
                      >
                        <Star
                          size={24}
                          strokeWidth={
                            2
                          }
                          fill={
                            selected
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    );
                  }
                )}
              </div>

              {/* TEXTAREA */}

              <textarea
                value={
                  reviewComment
                }
                onChange={(
                  event
                ) => {
                  setReviewComment(
                    event.target
                      .value
                  );

                  setReviewMessage(
                    ""
                  );
                }}
                onFocus={(
                  event
                ) => {
                  event.currentTarget.style.border =
                    "1px solid rgba(40,125,242,.65)";

                  event.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(40,125,242,.10)";
                }}
                onBlur={(
                  event
                ) => {
                  event.currentTarget.style.border =
                    "1px solid rgba(255,255,255,.14)";

                  event.currentTarget.style.boxShadow =
                    "none";
                }}
                placeholder="Write your experience with this product..."
                rows={5}
                spellCheck={true}
                autoComplete="off"
                style={{
                  position:
                    "relative",
                  zIndex: 100,
                  pointerEvents:
                    "auto",
                  display:
                    "block",
                  width:
                    "100%",
                  minHeight:
                    "130px",
                  boxSizing:
                    "border-box",
                  resize:
                    "vertical",
                  border:
                    "1px solid rgba(255,255,255,.14)",
                  background:
                    "rgba(255,255,255,.07)",
                  color:
                    "inherit",
                  outline:
                    "none",
                  padding:
                    "14px",
                  fontFamily:
                    "inherit",
                  fontSize:
                    "14px",
                  lineHeight:
                    1.6,
                  marginBottom:
                    "12px",
                  cursor:
                    "text",
                  WebkitUserSelect:
                    "text",
                  userSelect:
                    "text",
                }}
              />

              {/* MESSAGE */}

              {reviewMessage && (
                <div
                  style={{
                    marginBottom:
                      "12px",
                    padding:
                      "11px 13px",
                    borderRadius:
                      "12px",
                    background:
                      reviewMessage
                        .toLowerCase()
                        .includes(
                          "success"
                        )
                        ? "rgba(60,190,120,.10)"
                        : "rgba(255,80,100,.10)",
                    border:
                      reviewMessage
                        .toLowerCase()
                        .includes(
                          "success"
                        )
                        ? "1px solid rgba(60,190,120,.18)"
                        : "1px solid rgba(255,80,100,.18)",
                    fontSize:
                      "13px",
                  }}
                >
                  {
                    reviewMessage
                  }
                </div>
              )}

              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                className="primary-button"
                disabled={
                  reviewSubmitting
                }
                style={{
                  position:
                    "relative",
                  zIndex: 100,
                  pointerEvents:
                    reviewSubmitting
                      ? "none"
                      : "auto",
                  border:
                    "none",
                  borderRadius:
                    "14px",
                  padding:
                    "11px 18px",
                  cursor:
                    reviewSubmitting
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    reviewSubmitting
                      ? 0.65
                      : 1,
                }}
              >
                {reviewSubmitting
                  ? "Submitting..."
                  : "Submit Review"}
              </button>
            </form>

            {/* =================================================
               REVIEW LIST
            ================================================= */}

            {reviewsLoading ? (
              <div
                style={{
                  padding:
                    "30px 20px",
                  textAlign:
                    "center",
                  borderRadius:
                    "18px",
                  background:
                    "rgba(255,255,255,.06)",
                  border:
                    "1px solid rgba(255,255,255,.10)",
                  opacity: 0.68,
                }}
              >
                <RefreshCw
                  size={22}
                  className="loading-icon"
                  style={{
                    marginBottom:
                      "8px",
                  }}
                />

                <div>
                  Loading reviews...
                </div>
              </div>
            ) : reviews.length ===
              0 ? (
              <div
                style={{
                  padding:
                    "30px 20px",
                  textAlign:
                    "center",
                  borderRadius:
                    "18px",
                  background:
                    "rgba(255,255,255,.06)",
                  border:
                    "1px solid rgba(255,255,255,.10)",
                  opacity: 0.68,
                }}
              >
                No reviews yet.
              </div>
            ) : (
              <div
                style={{
                  display:
                    "grid",
                  gap: "13px",
                }}
              >
                {reviews.map(
                  (review) => (
                    <div
                      key={
                        review.review_id
                      }
                      style={{
                        padding:
                          "18px",
                        borderRadius:
                          "18px",
                        background:
                          "rgba(255,255,255,.06)",
                        border:
                          "1px solid rgba(255,255,255,.10)",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "flex-start",
                          justifyContent:
                            "space-between",
                          gap: "14px",
                        }}
                      >
                        <div>
                          <strong
                            style={{
                              display:
                                "block",
                              marginBottom:
                                "6px",
                            }}
                          >
                            {review
                              .Customer
                              ?.name ||
                              "Customer"}
                          </strong>

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "3px",
                              color:
                                "#f5b301",
                            }}
                          >
                            {Array.from(
                              {
                                length: 5,
                              },
                              (
                                _,
                                index
                              ) => (
                                <Star
                                  key={
                                    index
                                  }
                                  size={
                                    15
                                  }
                                  fill={
                                    index <
                                    Number(
                                      review.rating
                                    )
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              )
                            )}
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize:
                              "11px",
                            opacity:
                              0.52,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {review.createdAt
                            ? new Date(
                                review.createdAt
                              ).toLocaleDateString(
                                "en-BD"
                              )
                            : ""}
                        </span>
                      </div>

                      <p
                        style={{
                          margin:
                            "12px 0 0",
                          lineHeight:
                            1.65,
                          fontSize:
                            "14px",
                          opacity:
                            0.82,
                          whiteSpace:
                            "pre-wrap",
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {
                          review.comment
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        </main>

        <footer className="store-footer">
          <div>
            <strong>
              ShopVista
            </strong>

            <span>
              Your modern shopping
              destination.
            </span>
          </div>

          <span>
            © 2026 ShopVista. All
            rights reserved.
          </span>
        </footer>
      </div>
    );
  }

  /* =====================================================
     HOME PAGE
  ===================================================== */

  function HomePage() {
    const navigate =
      useNavigate();

    return (
      <div
        className={
          darkMode
            ? "app dark"
            : "app"
        }
      >
        {/* NAVBAR */}

        <header className="navbar glass">
          <Link
            to="/"
            className="brand"
          >
            <div className="brand-icon">
              <img
                src="/images/shopvista-logo.png"
                alt="ShopVista"
              />
            </div>

            <span>
              ShopVista
            </span>
          </Link>

          <nav className="nav-links">
            <a
              href="#"
              className="active"
            >
              Home
            </a>

            <a href="#products">
              Products
            </a>

            <a href="#categories">
              Categories
            </a>

            <a href="#deals">
              Deals
            </a>

            <a href="#about">
              About
            </a>

            <a href="#contact">
              Contact
            </a>
          </nav>

          {/* SEARCH */}

          <div className="search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search for products..."
              value={
                searchTerm
              }
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

            {searchTerm && (
              <button
                className="search-clear"
                onClick={() =>
                  setSearchTerm(
                    ""
                  )
                }
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* ACTIONS */}

          <div className="nav-actions">
            <button
              className="icon-button"
              title="Wishlist"
            >
              <Heart size={22} />

              {wishlist.length >
                0 && (
                <span className="cart-badge">
                  {
                    wishlist.length
                  }
                </span>
              )}
            </button>

            <button
              className="icon-button cart-button"
              title="Cart"
              onClick={() =>
                document
                  .getElementById(
                    "cart"
                  )
                  ?.scrollIntoView({
                    behavior:
                      "smooth",
                  })
              }
            >
              <ShoppingCart
                size={22}
              />

              <span className="cart-badge">
                {cartItemCount}
              </span>
            </button>

            <Link
              to="/profile"
              className="icon-button"
              title="Profile"
            >
              <User size={22} />
            </Link>

            <button
              className="theme-button"
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
          </div>
        </header>

        {/* MAIN */}

        <main className="store-container">
          {/* HERO */}

          <section className="hero hero-full-image glass">
            {/* FULL-WIDTH HERO IMAGE SLIDESHOW */}
            <div className="hero-image-layer">
              {heroImages.map(
                (image, index) => (
                  <img
                    key={image}
                    src={image}
                    alt={`ShopVista Hero ${
                      index + 1
                    }`}
                    className={
                      index === heroIndex
                        ? "hero-slide active"
                        : "hero-slide"
                    }
                  />
                )
              )}
            </div>

            {/* BLUE GLASS OVERLAY FOR TEXT READABILITY */}
            <div className="hero-full-overlay"></div>

            {/* HERO CONTENT */}
            <div className="hero-content hero-full-content">
              <div className="hero-mini-label">
                <Sparkles size={16} />
                <span>Limited Time Offer</span>
              </div>

              <span className="sale-label">
                Summer Sale
              </span>

              <h1>
                50%
                <span>OFF</span>
              </h1>

              <p>
                On Selected Items
              </p>

              <button
                type="button"
                className="primary-button hero-shop-button"
                onClick={() =>
                  document
                    .getElementById(
                      "products"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                Shop Now
                <ArrowRight size={19} />
              </button>
            </div>

            {/* SLIDER DOTS */}
            <div className="hero-dots hero-full-dots">
              {heroImages.map(
                (_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to hero slide ${
                      index + 1
                    }`}
                    className={
                      index === heroIndex
                        ? "hero-dot active"
                        : "hero-dot"
                    }
                    onClick={() =>
                      setHeroIndex(index)
                    }
                  />
                )
              )}
            </div>
          </section>

          {/* CATEGORIES */}

          <section
            id="categories"
            className="categories-section glass"
          >
            <div className="section-heading">
              <h2>
                Categories
              </h2>

              <button
                onClick={() => {
                  setSelectedCategory(
                    "All"
                  );

                  document
                    .getElementById(
                      "products"
                    )
                    ?.scrollIntoView({
                      behavior:
                        "smooth",
                    });
                }}
              >
                View All
                <ArrowRight
                  size={15}
                />
              </button>
            </div>

            <div className="categories-grid">
              {productCategories
                .filter(
                  (category) =>
                    category !==
                    "Smart Watch"
                )
                .map(
                  (category) => {
                    const Icon =
                      categoryIcons[
                        category
                      ] ||
                      Smartphone;

                    const isActive =
                      selectedCategory ===
                      category;

                    return (
                      <button
                        className={
                          isActive
                            ? "category-card glass active"
                            : "category-card glass"
                        }
                        key={
                          category
                        }
                        onClick={() => {
                          setSelectedCategory(
                            category
                          );

                          document
                            .getElementById(
                              "products"
                            )
                            ?.scrollIntoView({
                              behavior:
                                "smooth",
                            });
                        }}
                      >
                        <div className="category-icon">
                          <Icon
                            size={
                              30
                            }
                            strokeWidth={
                              1.6
                            }
                          />
                        </div>

                        <span>
                          {
                            category
                          }
                        </span>
                      </button>
                    );
                  }
                )}
            </div>
          </section>

          {/* PRODUCTS */}

          <section
            id="products"
            className="products-section"
          >
            <div className="section-heading">
              <div>
                <h2>
                  Popular Products
                </h2>

                <span className="product-count">
                  {
                    filteredProducts.length
                  }{" "}
                  products
                </span>
              </div>

              <button
                onClick={
                  clearFilters
                }
              >
                View All
                <ArrowRight
                  size={15}
                />
              </button>
            </div>

            {/* FILTER STATUS */}

            {(searchTerm ||
              selectedCategory !==
                "All") && (
              <div className="filter-status glass">
                <span>
                  {searchTerm && (
                    <>
                      Search:{" "}
                      <strong>
                        "{searchTerm}"
                      </strong>
                    </>
                  )}

                  {searchTerm &&
                    selectedCategory !==
                      "All" && (
                      <>
                        {" "}
                        •{" "}
                      </>
                    )}

                  {selectedCategory !==
                    "All" && (
                    <>
                      Category:{" "}
                      <strong>
                        {
                          selectedCategory
                        }
                      </strong>
                    </>
                  )}
                </span>

                <button
                  onClick={
                    clearFilters
                  }
                >
                  Clear
                </button>
              </div>
            )}

            {/* LOADING */}

            {loading && (
              <div className="products-loading glass">
                <RefreshCw
                  size={30}
                  className="loading-icon"
                />

                <h3>
                  Loading Products...
                </h3>

                <p>
                  Getting products
                  from the server.
                </p>
              </div>
            )}

            {/* ERROR */}

            {!loading &&
              error && (
                <div className="products-error glass">
                  <h3>
                    Unable to Load
                    Products
                  </h3>

                  <p>
                    {error}
                  </p>

                  <button
                    className="primary-button"
                    onClick={
                      fetchProducts
                    }
                  >
                    <RefreshCw
                      size={16}
                    />
                    Try Again
                  </button>
                </div>
              )}

            {/* NO PRODUCTS */}

            {!loading &&
              !error &&
              filteredProducts.length ===
                0 && (
                <div className="no-products glass">
                  <Search
                    size={40}
                  />

                  <h3>
                    No products
                    found
                  </h3>

                  <p>
                    Try another
                    search or
                    category.
                  </p>

                  <button
                    className="primary-button"
                    onClick={
                      clearFilters
                    }
                  >
                    Clear Filters
                  </button>
                </div>
              )}

            {/* PRODUCT GRID */}

            {!loading &&
              !error &&
              filteredProducts.length >
                0 && (
                <div className="products-grid">
                  {filteredProducts.map(
                    (product) => {
                      const productImage =
                        getProductImage(
                          product.image
                        );

                      const liked =
                        wishlist.includes(
                          product.id
                        );

                      return (
                        <Link
                          to={`/product/${product.id}`}
                          className="product-card-link"
                          key={
                            product.id
                          }
                        >
                          <article className="product-card glass">
                            {/* WISHLIST */}

                            <button
                              className={
                                liked
                                  ? "wishlist liked"
                                  : "wishlist"
                              }
                              onClick={(
                                e
                              ) => {
                                e.preventDefault();
                                e.stopPropagation();

                                toggleWishlist(
                                  product.id
                                );
                              }}
                            >
                              <Heart
                                size={
                                  19
                                }
                                fill={
                                  liked
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>

                            {/* IMAGE */}

                            <div className="product-image">
                              <div className="product-image-glow"></div>

                              <img
                                src={
                                  productImage
                                }
                                alt={
                                  product.name
                                }
                                className="product-real-image"
                                onError={(
                                  e
                                ) => {
                                  e.currentTarget.src =
                                    "/images/iphone15.png";
                                }}
                              />
                            </div>

                            {/* INFO */}

                            <div className="product-info">
                              <h3>
                                {
                                  product.name
                                }
                              </h3>

                              <span>
                                {
                                  product.category
                                }
                              </span>

                              <div className="product-bottom">
                                <div>
                                  <strong>
                                    {formatBDT(
                                      product.price
                                    )}
                                  </strong>

                                  <div className="rating">
                                    <Star
                                      size={
                                        13
                                      }
                                      fill="currentColor"
                                    />

                                    4.8
                                  </div>
                                </div>

                                <button
                                  className="add-cart"
                                  onClick={(
                                    e
                                  ) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    addToCart(
                                      product
                                    );
                                  }}
                                >
                                  <ShoppingCart
                                    size={
                                      17
                                    }
                                  />
                                </button>
                              </div>
                            </div>
                          </article>
                        </Link>
                      );
                    }
                  )}
                </div>
              )}
          </section>

          {/* CART */}

          <aside
            id="cart"
            className="cart-panel glass"
          >
            <div className="cart-heading">
              <h2>
                Cart
              </h2>

              <span>
                {cartItemCount}{" "}
                items
              </span>
            </div>

            {/* EMPTY CART */}

            {cart.length ===
              0 && (
              <div className="empty-cart">
                <ShoppingCart
                  size={42}
                />

                <h3>
                  Your cart is
                  empty
                </h3>

                <p>
                  Add products to
                  get started
                </p>
              </div>
            )}

            {/* CART ITEMS */}

            {cart.length > 0 && (
              <>
                <div className="cart-items">
                  {cart.map(
                    (item) => (
                      <div
                        className="cart-item"
                        key={item.id}
                      >
                        <div
                          className="mini-product"
                          style={{
                            width:
                              "64px",
                            height:
                              "64px",
                            minWidth:
                              "64px",
                            maxWidth:
                              "64px",
                            flex: "0 0 64px",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            overflow:
                              "hidden",
                            borderRadius:
                              "14px",
                            background:
                              "rgba(255,255,255,.08)",
                            border:
                              "1px solid rgba(255,255,255,.10)",
                          }}
                        >
                          <img
                            src={getProductImage(
                              item.image
                            )}
                            alt={
                              item.name
                            }
                            loading="lazy"
                            style={{
                              width:
                                "52px",
                              height:
                                "52px",
                              minWidth:
                                "52px",
                              minHeight:
                                "52px",
                              maxWidth:
                                "52px",
                              maxHeight:
                                "52px",
                              objectFit:
                                "contain",
                              objectPosition:
                                "center",
                              display:
                                "block",
                            }}
                            onError={(
                              e
                            ) => {
                              e.currentTarget.src =
                                "/images/iphone15.png";
                            }}
                          />
                        </div>

                        <div>
                          <strong>
                            {
                              item.name
                            }
                          </strong>

                          <small>
                            {
                              item.category
                            }
                          </small>

                          <div className="cart-quantity">
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.id,
                                  -1
                                )
                              }
                            >
                              <Minus
                                size={
                                  11
                                }
                              />
                            </button>

                            <span>
                              {
                                item.quantity
                              }
                            </span>

                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.id,
                                  1
                                )
                              }
                            >
                              <Plus
                                size={
                                  11
                                }
                              />
                            </button>
                          </div>
                        </div>

                        <div className="cart-item-right">
                          <strong>
                            {formatBDT(
                              Number(
                                item.price
                              ) *
                                Number(
                                  item.quantity
                                )
                            )}
                          </strong>

                          <button
                            className="remove-cart-item"
                            onClick={() =>
                              removeFromCart(
                                item.id
                              )
                            }
                          >
                            <X
                              size={
                                13
                              }
                            />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="cart-total">
                  <span>
                    Total
                  </span>

                  <strong>
                    {formatBDT(
                      cartTotal
                    )}
                  </strong>
                </div>

                <button
                  className="checkout-button"
                  onClick={() => {
                    const token =
                      localStorage.getItem(
                        "shopvista_token"
                      );

                    if (!token) {
                      navigate(
                        "/login"
                      );
                      return;
                    }

                    navigate(
                      "/checkout"
                    );
                  }}
                >
                  Checkout
                </button>
              </>
            )}
          </aside>

          {/* SPECIAL OFFER */}

          <section
            id="deals"
            className="special-offer glass"
          >
            <div className="offer-content">
              <div className="offer-label">
                <Sparkles
                  size={14}
                />

                Special Offer
              </div>

              <h2>
                Up to 50% Off
              </h2>

              <p>
                On Selected Items
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  document
                    .getElementById(
                      "products"
                    )
                    ?.scrollIntoView({
                      behavior:
                        "smooth",
                    })
                }
              >
                Shop Now
                <ArrowRight
                  size={16}
                />
              </button>
            </div>

            <div className="offer-shopping-bag">
              🛍️
            </div>
          </section>
        </main>

        {/* BENEFITS */}

        <section className="store-benefits">
          <div className="benefit glass">
            <Truck size={23} />

            <div>
              <strong>
                Fast Delivery
              </strong>

              <span>
                Quick & reliable
                shipping
              </span>
            </div>
          </div>

          <div className="benefit glass">
            <ShieldCheck
              size={23}
            />

            <div>
              <strong>
                Secure Shopping
              </strong>

              <span>
                Your data stays
                protected
              </span>
            </div>
          </div>

          <div className="benefit glass">
            <CreditCard
              size={23}
            />

            <div>
              <strong>
                Secure Payment
              </strong>

              <span>
                Multiple payment
                methods
              </span>
            </div>
          </div>
        </section>

        {/* CONTACT */}

        <section
          id="contact"
          className="contact-section glass"
        >
          <div className="section-heading">
            <span>
              Contact Us
            </span>

            <h2>
              Get In Touch With Us
            </h2>

            <p>
              Have a question or
              need help? Feel free
              to contact us.
            </p>
          </div>

          <div className="contact-content">
            <div className="contact-item">
              <Mail size={22} />

              <div>
                <strong>
                  Email
                </strong>

                <span>
                  support@shopvista.com
                </span>
              </div>
            </div>

            <div className="contact-item">
              <Phone size={22} />

              <div>
                <strong>
                  Phone
                </strong>

                <span>
                  +880 1XXXXXXXXX
                </span>
              </div>
            </div>

            <div className="contact-item">
              <MapPin
                size={22}
              />

              <div>
                <strong>
                  Address
                </strong>

                <span>
                  Bangladesh
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}

        <section
          id="about"
          className="about-modern-section"
        >
          <div className="about-modern-container">
            {/* LEFT */}

            <div className="about-modern-content">
              <span className="about-modern-label">
                ABOUT SHOPVISTA
              </span>

              <h2>
                Your Trusted
                <span>
                  {" "}
                  Online Shopping{" "}
                </span>
                Destination
              </h2>

              <p className="about-modern-description">
                ShopVista is a
                modern online
                shopping platform
                designed to make
                your shopping
                experience simple,
                convenient, and
                reliable.
              </p>

              <p className="about-modern-description">
                Discover quality
                products across
                fashion,
                electronics,
                accessories,
                perfumes, shoes,
                and everyday
                essentials — all
                in one place.
              </p>

              <a
                href="/#products"
                className="about-modern-button"
              >
                Learn More
              </a>
            </div>

            {/* RIGHT */}

            <div className="about-modern-illustration">
              <div className="about-image-glow"></div>

              <img
                src="/about-illustration.png"
                alt="ShopVista online shopping"
                className="about-modern-image"
              />
            </div>
          </div>

          {/* FEATURES */}

          <div className="about-modern-features">
            <div className="about-feature">
              <div className="about-feature-icon">
                ✓
              </div>

              <div>
                <strong>
                  Quality Products
                </strong>

                <span>
                  Carefully selected
                  products
                </span>
              </div>
            </div>

            <div className="about-feature">
              <div className="about-feature-icon">
                ✓
              </div>

              <div>
                <strong>
                  Secure Shopping
                </strong>

                <span>
                  Safe and reliable
                  experience
                </span>
              </div>
            </div>

            <div className="about-feature">
              <div className="about-feature-icon">
                ✓
              </div>

              <div>
                <strong>
                  Reliable Service
                </strong>

                <span>
                  Customer
                  satisfaction first
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="store-footer">
          <div>
            <strong>
              ShopVista
            </strong>

            <span>
              Your modern shopping
              destination.
            </span>
          </div>

          <span>
            © 2026 ShopVista. All
            rights reserved.
          </span>
        </footer>
      </div>
    );
  }

  /* =====================================================
     ROUTES
  ===================================================== */

  return (
    <Routes>
      <Route
        path="/checkout"
        element={
          <CheckoutPage />
        }
      />

      <Route
        path="/order-success/:id"
        element={
          <OrderSuccessPage />
        }
      />

      <Route
        path="/profile"
        element={
          <ProfilePage />
        }
      />

      <Route
        path="/login"
        element={
          <AuthPage mode="login" />
        }
      />

      <Route
        path="/register"
        element={
          <AuthPage mode="register" />
        }
      />

      <Route
        path="/product/:id"
        element={
          <ProductDetails />
        }
      />

      <Route
        path="/admin"
        element={
          <AdminDashboard />
        }
      />

      <Route
        path="/"
        element={
          <HomePage />
        }
      />
    </Routes>
  );
}

export default App;