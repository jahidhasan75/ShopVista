import React, { useEffect, useMemo, useState } from "react";

import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  ClipboardList,
  CreditCard,
  FileText,
  MessageSquare,
  ShieldCheck,
  Settings,
  LogOut,
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Menu,
  X,
  Eye,
  MoreHorizontal,
  CheckCircle2,
  Clock3,
  XCircle,
  Truck,
  Star,
  RefreshCw,
  Edit3,
  Trash2,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  Printer,
} from "lucide-react";

import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api";

// =====================================================
// CREATE PRODUCT PAGE
// =====================================================

const CreateProductPage = ({ onBack }) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [specifications, setSpecifications] = useState([
  {
    name: "",
    value: "",
  },
]);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const addSpecification = () => {
  setSpecifications((prev) => [
    ...prev,
    {
      name: "",
      value: "",
    },
  ]);
};

const removeSpecification = (index) => {
  setSpecifications((prev) =>
    prev.filter((_, i) => i !== index)
  );
};

const updateSpecification = (index, field, value) => {
  setSpecifications((prev) =>
    prev.map((spec, i) =>
      i === index
        ? {
            ...spec,
            [field]: value,
          }
        : spec
    )
  );
};

  // =====================================================
  // IMAGE SELECT
  // =====================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Please select JPG, JPEG, PNG or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");

      event.target.value = "";
      return;
    }

    // Remove old preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");

    const input =
      document.getElementById(
        "product-image-input"
      );

    if (input) {
      input.value = "";
    }

    const changeInput =
      document.getElementById(
        "product-image-change"
      );

    if (changeInput) {
      changeInput.value = "";
    }
  };

  // =====================================================
  // CREATE PRODUCT
  // =====================================================

const handleCreateProduct = async (
  event
) => {
  event.preventDefault();

  const cleanName =
    productName.trim();

  const cleanDescription =
    description.trim();

  // =================================================
  // VALIDATION
  // =================================================

  if (!cleanName) {
    alert(
      "Please enter product name."
    );
    return;
  }

  if (!cleanDescription) {
    alert(
      "Please enter product description."
    );
    return;
  }

  if (!category) {
    alert(
      "Please select a category."
    );
    return;
  }

  if (
    price === "" ||
    !Number.isFinite(
      Number(price)
    ) ||
    Number(price) <= 0
  ) {
    alert(
      "Please enter a valid price."
    );
    return;
  }

  if (
    stock === "" ||
    !Number.isInteger(
      Number(stock)
    ) ||
    Number(stock) < 0
  ) {
    alert(
      "Please enter a valid stock."
    );
    return;
  }

  if (!image) {
    alert(
      "Please select a product image."
    );
    return;
  }

  // =================================================
  // FORM DATA
  // =================================================

  const formData =
    new FormData();

  formData.append(
    "name",
    cleanName
  );

  formData.append(
    "description",
    cleanDescription
  );

  formData.append(
    "price",
    Number(price)
  );

  formData.append(
    "stock",
    Number(stock)
  );

  formData.append(
    "category",
    category
  );
const cleanedSpecifications = specifications
  .filter(
    (spec) =>
      spec.name.trim() &&
      spec.value.trim()
  )
  .reduce((acc, spec) => {
    acc[spec.name.trim()] =
      spec.value.trim();

    return acc;
  }, {});

formData.append(
  "specifications",
  JSON.stringify(cleanedSpecifications)
);
  
  formData.append(
    "image",
    image
  );

  // =================================================
  // API REQUEST
  // =================================================

  try {
    const token =
  localStorage.getItem(
    "shopvista_admin_token"
  );

    if (!token) {
      alert(
        "Admin authentication token not found. Please login again."
      );
      return;
    }

    const response =
      await fetch(
        `${API_URL}/products`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: formData,
        }
      );

    const data =
      await response.json();

    // =================================================
    // ERROR
    // =================================================

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Failed to create product."
      );
    }

    // =================================================
    // SUCCESS
    // =================================================

    console.log(
      "Product Created:",
      data.product
    );

    alert(
      "Product created successfully!"
    );

    // Clear form

    setProductName("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategory("");
    setImage(null);

    setSpecifications([
  {
    name: "",
    value: "",
  },
]);

    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImagePreview("");

    // Return to Products page

    onBack();

  } catch (error) {
    console.error(
      "Create Product Error:",
      error
    );

    alert(
      error.message ||
      "Failed to create product."
    );
  }
};

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        paddingBottom: "50px",
      }}
    >

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "28px",
        }}
      >

        <div>
          <div
            style={{
              color: "#7186a5",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            Products &nbsp;›&nbsp; Add Product
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: "700",
              color: "#132b52",
            }}
          >
            Add New Product
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#7186a5",
              fontSize: "15px",
            }}
          >
            Fill in the product details and upload
            product image
          </p>
        </div>

        {/* TOP BUTTONS */}

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >

          <button
            type="button"
            onClick={onBack}
            style={{
              padding: "12px 20px",
              border: "1px solid #d5e2f2",
              borderRadius: "12px",
              background: "#ffffff",
              color: "#29466f",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="create-product-form"
            style={{
              padding: "12px 22px",
              border: "none",
              borderRadius: "12px",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow:
                "0 5px 15px rgba(37, 99, 235, 0.20)",
            }}
          >
            Create Product
          </button>

        </div>
      </div>

      {/* =================================================
          MAIN FORM
      ================================================= */}

      <form
        id="create-product-form"
        onSubmit={handleCreateProduct}
      >

        {/* =================================================
            PRODUCT PHOTOS
        ================================================= */}

        <div
          style={{
            background: "#f7fbff",
            border: "1px solid #dce9f7",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "22px",
            boxShadow:
              "0 8px 25px rgba(47, 91, 140, 0.06)",
          }}
        >

          <h2
            style={{
              margin: "0 0 18px",
              fontSize: "20px",
              color: "#142f59",
            }}
          >
            Product Photos
          </h2>

          {/* NO IMAGE */}

          {!imagePreview ? (

            <div
              style={{
                minHeight: "240px",
                border: "2px dashed #bfd2e8",
                borderRadius: "16px",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "20px",
              }}
            >

              <div
                style={{
                  fontSize: "44px",
                  marginBottom: "12px",
                }}
              >
                🖼️
              </div>

              <div
                style={{
                  fontSize: "17px",
                  fontWeight: "600",
                  color: "#18365f",
                  marginBottom: "8px",
                }}
              >
                Choose a product image
              </div>

              <div
                style={{
                  color: "#7b8faa",
                  fontSize: "14px",
                  marginBottom: "18px",
                }}
              >
                JPG, PNG or WEBP up to 5MB
              </div>

              {/* DIRECT FILE INPUT */}

              <input
                id="product-image-input"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: "420px",
                  padding: "12px",
                  border:
                    "1px solid #d3e1f0",
                  borderRadius: "10px",
                  background: "#ffffff",
                  cursor: "pointer",
                  color: "#29466f",
                  fontSize: "14px",
                }}
              />

            </div>

          ) : (

            /* IMAGE PREVIEW */

            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "16px",
                border:
                  "1px solid #dce9f7",
              }}
            >

              <img
                src={imagePreview}
                alt="Product Preview"
                style={{
                  display: "block",
                  width: "100%",
                  height: "300px",
                  objectFit: "contain",
                  borderRadius: "12px",
                  background: "#eef6ff",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  gap: "15px",
                  marginTop: "15px",
                  flexWrap: "wrap",
                }}
              >

                <div>
                  <strong
                    style={{
                      color: "#18365f",
                      fontSize: "14px",
                    }}
                  >
                    {image.name}
                  </strong>

                  <div
                    style={{
                      marginTop: "4px",
                      color: "#7b8faa",
                      fontSize: "13px",
                    }}
                  >
                    {(
                      image.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >

                  {/* CHANGE IMAGE */}

                  <label
                    htmlFor="product-image-change"
                    style={{
                      padding:
                        "10px 16px",
                      borderRadius: "10px",
                      background:
                        "#eaf3ff",
                      color: "#2563eb",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Change Image
                  </label>

                  <input
                    id="product-image-change"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    style={{
                      display: "none",
                    }}
                  />

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      padding:
                        "10px 16px",
                      borderRadius: "10px",
                      border: "none",
                      background:
                        "#feecec",
                      color: "#dc3545",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>

                </div>
              </div>
            </div>
          )}

        </div>

        {/* =================================================
            BASIC INFORMATION
        ================================================= */}

        <div
          style={{
            background: "#f7fbff",
            border:
              "1px solid #dce9f7",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "22px",
          }}
        >

          <h2
            style={{
              margin: "0 0 22px",
              fontSize: "20px",
              color: "#142f59",
            }}
          >
            Basic Information
          </h2>

          {/* PRODUCT NAME */}

          <label
            htmlFor="product-name"
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#203b63",
              fontWeight: "600",
            }}
          >
            Product Name *
          </label>

          <input
            id="product-name"
            type="text"
            autoComplete="off"
            placeholder="Enter product name..."
            value={productName}
            onChange={(event) => {
              setProductName(
                event.target.value
              );
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 16px",
              border:
                "1px solid #d3e1f0",
              borderRadius: "12px",
              outline: "none",
              fontSize: "15px",
              background: "#ffffff",
              marginBottom: "20px",
            }}
          />

          {/* CATEGORY + PRICE */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "18px",
            }}
          >

            {/* CATEGORY */}

            <div>

              <label
                htmlFor="product-category"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#203b63",
                  fontWeight: "600",
                }}
              >
                Category *
              </label>

              <select
                id="product-category"
                value={category}
                onChange={(event) => {
                  setCategory(
                    event.target.value
                  );
                }}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px 16px",
                  border:
                    "1px solid #d3e1f0",
                  borderRadius: "12px",
                  outline: "none",
                  fontSize: "15px",
                  background:
                    "#ffffff",
                  color: category
                    ? "#203b63"
                    : "#8a9bb2",
                }}
              >

                <option value="">
                  Select category...
                </option>

                <option value="Shoes">
                  Shoes
                </option>

                <option value="Perfume">
                  Perfume
                </option>

                <option value="Fashion">
                  Fashion
                </option>

                <option value="Accessories">
                  Accessories
                </option>

                <option value="Mobile">
                  Mobile
                </option>

                <option value="Laptop">
                  Laptop
                </option>

                <option value="Earbuds">
                  Earbuds
                </option>

                <option value="Headphones">
                  Headphones
                </option>

                <option value="Camera">
                  Camera
                </option>

                <option value="Gaming">
                  Gaming
                </option>

              </select>
            </div>

            {/* PRICE */}

            <div>

              <label
                htmlFor="product-price"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#203b63",
                  fontWeight: "600",
                }}
              >
                Price (BDT) *
              </label>

              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                autoComplete="off"
                placeholder="Enter price..."
                value={price}
                onChange={(event) => {
                  setPrice(
                    event.target.value
                  );
                }}
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  padding: "14px 16px",
                  border:
                    "1px solid #d3e1f0",
                  borderRadius: "12px",
                  outline: "none",
                  fontSize: "15px",
                  background:
                    "#ffffff",
                }}
              />

            </div>
          </div>

          {/* STOCK */}

          <div
            style={{
              marginTop: "18px",
            }}
          >

            <label
              htmlFor="product-stock"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#203b63",
                fontWeight: "600",
              }}
            >
              Stock *
            </label>

            <input
              id="product-stock"
              type="number"
              min="0"
              step="1"
              autoComplete="off"
              placeholder="Enter stock quantity..."
              value={stock}
              onChange={(event) => {
                setStock(
                  event.target.value
                );
              }}
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                padding: "14px 16px",
                border:
                  "1px solid #d3e1f0",
                borderRadius: "12px",
                outline: "none",
                fontSize: "15px",
                background:
                  "#ffffff",
              }}
            />

          </div>
        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div
          style={{
            background: "#f7fbff",
            border:
              "1px solid #dce9f7",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "22px",
          }}
        >

          <h2
            style={{
              margin: "0 0 18px",
              fontSize: "20px",
              color: "#142f59",
            }}
          >
            Product Description
          </h2>

          <textarea
            id="product-description"
            rows="7"
            autoComplete="off"
            placeholder="Write a detailed description about the product..."
            value={description}
            onChange={(event) => {
              setDescription(
                event.target.value
              );
            }}
            style={{
              width: "100%",
              boxSizing:
                "border-box",
              padding: "14px 16px",
              border:
                "1px solid #d3e1f0",
              borderRadius: "12px",
              outline: "none",
              resize: "vertical",
              fontSize: "15px",
              background:
                "#ffffff",
              fontFamily:
                "inherit",
            }}
          />

        </div>

{/* =================================================
    PRODUCT SPECIFICATIONS
================================================= */}

<div
  style={{
    background: "#f7fbff",
    border: "1px solid #dce9f7",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "22px",
  }}
>
  <h2
    style={{
      margin: "0 0 8px",
      fontSize: "20px",
      color: "#142f59",
    }}
  >
    Product Specifications
  </h2>

  <p
    style={{
      margin: "0 0 20px",
      color: "#7186a5",
      fontSize: "14px",
    }}
  >
    Add product-specific details and features
  </p>

  {specifications.map((spec, index) => (
    <div
      key={index}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr auto",
        gap: "12px",
        marginBottom: "12px",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        placeholder="Specification name"
        value={spec.name}
        onChange={(event) =>
          updateSpecification(
            index,
            "name",
            event.target.value
          )
        }
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "13px 15px",
          border: "1px solid #d3e1f0",
          borderRadius: "12px",
          outline: "none",
          fontSize: "15px",
          background: "#ffffff",
        }}
      />

      <input
        type="text"
        placeholder="Specification value"
        value={spec.value}
        onChange={(event) =>
          updateSpecification(
            index,
            "value",
            event.target.value
          )
        }
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "13px 15px",
          border: "1px solid #d3e1f0",
          borderRadius: "12px",
          outline: "none",
          fontSize: "15px",
          background: "#ffffff",
        }}
      />

      <button
        type="button"
        onClick={() =>
          removeSpecification(index)
        }
        disabled={specifications.length === 1}
        style={{
          width: "42px",
          height: "42px",
          border: "none",
          borderRadius: "10px",
          background:
            specifications.length === 1
              ? "#eef2f7"
              : "#feecec",
          color:
            specifications.length === 1
              ? "#9aa8ba"
              : "#dc3545",
          cursor:
            specifications.length === 1
              ? "not-allowed"
              : "pointer",
          fontSize: "18px",
          fontWeight: "700",
        }}
      >
        ×
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={addSpecification}
    style={{
      marginTop: "8px",
      padding: "11px 18px",
      border: "1px solid #bfdbfe",
      borderRadius: "10px",
      background: "#eaf3ff",
      color: "#2563eb",
      fontWeight: "600",
      cursor: "pointer",
    }}
  >
    + Add Specification
  </button>
</div>

        {/* =================================================
            BOTTOM BUTTONS
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "flex-end",
            gap: "12px",
          }}
        >

          <button
            type="button"
            onClick={onBack}
            style={{
              padding:
                "12px 22px",
              borderRadius:
                "12px",
              border:
                "1px solid #d3e1f0",
              background:
                "#ffffff",
              color:
                "#29466f",
              fontWeight:
                "600",
              cursor:
                "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            style={{
              padding:
                "12px 24px",
              border: "none",
              borderRadius:
                "12px",
              background:
                "#2563eb",
              color:
                "#ffffff",
              fontWeight:
                "600",
              cursor:
                "pointer",
              boxShadow:
                "0 5px 15px rgba(37, 99, 235, 0.20)",
            }}
          >
            Create Product
          </button>

        </div>

      </form>
    </div>
  );
};

// =====================================================
// ADMIN DASHBOARD
// =====================================================

function AdminDashboard() {
  // =====================================================
  // BASIC STATE
  // =====================================================

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // =====================================================
  // DARK MODE
  // =====================================================

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem(
        "shopvista_admin_dark_mode"
      ) === "true"
    );
  });
  // =====================================================
// HEADER SEARCH + DROPDOWNS
// =====================================================

const [headerSearch, setHeaderSearch] = useState("");

const [showNotifications, setShowNotifications] =
  useState(false);

const [showProfileMenu, setShowProfileMenu] =
  useState(false);

const [notificationsRead, setNotificationsRead] =
  useState(false);

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // SEARCH
  // =====================================================

  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");

  // =====================================================
  // CUSTOMER EDIT
  // =====================================================

  const [editingCustomer, setEditingCustomer] = useState(null);

  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [customerMessage, setCustomerMessage] = useState("");
  const [customerActionLoading, setCustomerActionLoading] =
    useState(false);

  // =====================================================
  // ORDER UPDATE
  // =====================================================

  const [orderActionLoading, setOrderActionLoading] =
    useState(false);

  const [orderMessage, setOrderMessage] = useState("");

  // =====================================================
  // SETTINGS
  // =====================================================

  const [settings, setSettings] = useState({
    storeName: "ShopVista",
    currency: "BDT",
    emailNotifications: true,
    orderNotifications: true,
    lowStockNotifications: true,
  });

  // =====================================================
  // ADMIN TOKEN
  // =====================================================

  const token = localStorage.getItem(
    "shopvista_admin_token"
  );

  const adminData = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("shopvista_admin") || "{}"
      );
    } catch {
      return {};
    }
  }, []);
  // =====================================================
// HEADER GLOBAL SEARCH RESULTS
// =====================================================

const headerSearchResults = useMemo(() => {
  const query = headerSearch
    .trim()
    .toLowerCase();

  if (!query) {
    return [];
  }

  const results = [];

  // ---------------------------------------------------
  // PRODUCTS
  // ---------------------------------------------------

  products.forEach((product) => {
    const searchableText = [
      product.id,
      product.name,
      product.category,
      product.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (searchableText.includes(query)) {
      results.push({
        type: "Products",
        title:
          product.name ||
          `Product #${product.id}`,
        subtitle:
          product.category ||
          "Product",
        searchValue:
          product.name ||
          String(product.id || ""),
      });
    }
  });

  // ---------------------------------------------------
  // CUSTOMERS
  // ---------------------------------------------------

  customers.forEach((customer) => {
    const searchableText = [
      customer.id,
      customer.name,
      customer.email,
      customer.phone,
      customer.address,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (searchableText.includes(query)) {
      results.push({
        type: "Customers",
        title:
          customer.name ||
          `Customer #${customer.id}`,
        subtitle:
          customer.email ||
          customer.phone ||
          "Customer",
        searchValue:
          customer.name ||
          String(customer.id || ""),
      });
    }
  });

  // ---------------------------------------------------
  // ORDERS
  // ---------------------------------------------------

  orders.forEach((order) => {
    const customerName =
      order.Customer?.name ||
      order.customer?.name ||
      order.customer_name ||
      "";

    const orderId =
      order.order_id ||
      order.id ||
      "";

    const searchableText = [
      orderId,
      customerName,
      order.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (searchableText.includes(query)) {
      results.push({
        type: "Orders",
        title: `Order #${orderId}`,
        subtitle:
          customerName ||
          order.status ||
          "Order",
        searchValue:
          orderId ||
          customerName,
      });
    }
  });

  return results.slice(0, 8);
}, [
  headerSearch,
  products,
  customers,
  orders,
]);
// =====================================================
// HEADER SEARCH HANDLER
// =====================================================

const handleHeaderSearchSelect = (result) => {
  if (!result) {
    return;
  }

  // Open corresponding page
  setActiveMenu(result.type);

  // Put selected value into that page's search
  if (result.type === "Products") {
    setProductSearch(result.searchValue);
  }

  if (result.type === "Customers") {
    setCustomerSearch(result.searchValue);
  }

  if (result.type === "Orders") {
    setOrderSearch(result.searchValue);
  }

  // Clear header search
  setHeaderSearch("");

  // Close dropdowns
  setShowNotifications(false);
  setShowProfileMenu(false);
};


// =====================================================
// ENTER KEY SEARCH
// =====================================================

const handleHeaderSearchKeyDown = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    handleHeaderSearchSelect(
      headerSearchResults[0]
    );
  }

  if (event.key === "Escape") {
    setHeaderSearch("");
  }
};

// =====================================================
// ADMIN NOTIFICATIONS
// =====================================================

const adminNotifications = useMemo(() => {
  const notifications = [];

  // Low stock products
  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock) <= 5
  );

  if (
    settings.lowStockNotifications &&
    lowStockProducts.length > 0
  ) {
    notifications.push({
      id: "low-stock",
      type: "Products",
      icon: Package,
      title: "Low stock alert",
      message: `${lowStockProducts.length} product${
        lowStockProducts.length > 1
          ? "s"
          : ""
      } running low`,
      searchValue: "",
    });
  }

  // Orders
  if (
    settings.orderNotifications &&
    orders.length > 0
  ) {
    notifications.push({
      id: "orders",
      type: "Orders",
      icon: ShoppingBag,
      title: "Order activity",
      message: `${orders.length} order${
        orders.length > 1
          ? "s"
          : ""
      } available`,
      searchValue: "",
    });
  }

  return notifications;
}, [
  products,
  orders,
  settings,
]);


// =====================================================
// NOTIFICATION CLICK
// =====================================================

const handleNotificationClick = (
  notification
) => {
  if (!notification) {
    return;
  }

  setActiveMenu(notification.type);

  setShowNotifications(false);

  setShowProfileMenu(false);

  setNotificationsRead(true);
};

  // =====================================================
  // FETCH HELPER
  // =====================================================

  const fetchJSON = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: token
          ? `Bearer ${token}`
          : "",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const contentType =
      response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();

      if (!response.ok) {
        throw new Error(
          `Request failed (${response.status}): ${
            text.slice(0, 150) ||
            response.statusText
          }`
        );
      }

      throw new Error(
        "Server returned a non-JSON response."
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          `Request failed (${response.status})`
      );
    }

    return data;
  };

  // =====================================================
  // LOAD ALL DASHBOARD DATA
  // =====================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // ---------------------------------------------------
      // PRODUCTS
      // ---------------------------------------------------

      try {
        const data = await fetchJSON(
          `${API_URL}/products`
        );

        setProducts(
          Array.isArray(data)
            ? data
            : data.products || []
        );
      } catch (err) {
        console.warn(
          "Products could not be loaded:",
          err.message
        );
      }

      // ---------------------------------------------------
      // CUSTOMERS
      // ---------------------------------------------------

      try {
        const data = await fetchJSON(
          `${API_URL}/admin/customers`
        );

        setCustomers(
          Array.isArray(data)
            ? data
            : data.customers || []
        );
      } catch (err) {
        console.warn(
          "Customers could not be loaded:",
          err.message
        );
      }

      // ---------------------------------------------------
      // ORDERS
      // ---------------------------------------------------

      try {
        const data = await fetchJSON(
          `${API_URL}/admin/orders`
        );

        setOrders(
          Array.isArray(data)
            ? data
            : data.orders || []
        );
      } catch (err) {
        console.warn(
          "Orders could not be loaded:",
          err.message
        );
      }

      // ---------------------------------------------------
      // PAYMENTS
      // ---------------------------------------------------

      try {
        const data = await fetchJSON(
          `${API_URL}/payments`
        );

        setPayments(
          Array.isArray(data)
            ? data
            : data.payments || []
        );
      } catch (err) {
        console.warn(
          "Payments could not be loaded:",
          err.message
        );
      }
    } catch (err) {
      console.error(
        "Dashboard Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem(
      "shopvista_admin_dark_mode",
      String(darkMode)
    );
  }, [darkMode]);

  useEffect(() => {
    loadDashboard();
  }, []);

  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (amount) => {
    return `BDT ${Number(
      amount || 0
    ).toLocaleString("en-BD")}`;
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
      case "Confirmed":
      case "Paid":
      case "Completed":
        return <CheckCircle2 size={15} />;

      case "Cancelled":
        return <XCircle size={15} />;

      case "Processing":
      case "Shipped":
        return <Truck size={15} />;

      default:
        return <Clock3 size={15} />;
    }
  };

  // =====================================================
  // ORDER STATUS
  // =====================================================

  const orderStatus = useMemo(() => {
    const result = {
      Confirmed: 0,
      Pending: 0,
      Delivered: 0,
      Cancelled: 0,
      Processing: 0,
      Shipped: 0,
    };

    orders.forEach((order) => {
      const status =
        order.status || "Pending";

      if (
        Object.prototype.hasOwnProperty.call(
          result,
          status
        )
      ) {
        result[status]++;
      }
    });

    return result;
  }, [orders]);

  // =====================================================
  // DASHBOARD STATISTICS
  // =====================================================

  const totalProducts = products.length;

  const totalCustomers = customers.length;

  const totalOrders = orders.length;

  const totalRevenue = useMemo(() => {
    return payments
      .filter(
        (payment) =>
          payment.payment_status === "Paid" ||
          payment.payment_status === "Completed"
      )
      .reduce(
        (total, payment) =>
          total +
          Number(payment.amount || 0),
        0
      );
  }, [payments]);

  // =====================================================
  // RECENT ORDERS
  // =====================================================

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt ||
              b.order_date ||
              0
          ) -
          new Date(
            a.createdAt ||
              a.order_date ||
              0
          )
      )
      .slice(0, 5);
  }, [orders]);

  // =====================================================
  // RECENT PAYMENTS
  // =====================================================

  const recentPayments = useMemo(() => {
    return [...payments]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt ||
              b.payment_date ||
              0
          ) -
          new Date(
            a.createdAt ||
              a.payment_date ||
              0
          )
      )
      .slice(0, 5);
  }, [payments]);

  // =====================================================
  // CUSTOMER EDIT
  // =====================================================

  const startEditCustomer = (customer) => {
    setEditingCustomer(customer);

    setCustomerForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });

    setCustomerMessage("");
  };

  const cancelEditCustomer = () => {
    setEditingCustomer(null);

    setCustomerForm({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    setCustomerMessage("");
  };

  // =====================================================
  // UPDATE CUSTOMER
  // =====================================================

  const updateCustomer = async () => {
    if (!editingCustomer) return;

    if (
      !customerForm.name.trim() ||
      !customerForm.email.trim() ||
      !customerForm.phone.trim() ||
      !customerForm.address.trim()
    ) {
      setCustomerMessage(
        "Please fill in all customer fields."
      );
      return;
    }

    try {
      setCustomerActionLoading(true);
      setCustomerMessage("");

      const data = await fetchJSON(
        `${API_URL}/admin/customers/${editingCustomer.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: customerForm.name.trim(),
            email:
              customerForm.email
                .trim()
                .toLowerCase(),
            phone: customerForm.phone.trim(),
            address:
              customerForm.address.trim(),
          }),
        }
      );

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id ===
          editingCustomer.id
            ? {
                ...customer,
                ...(data.customer || {}),
                ...customerForm,
              }
            : customer
        )
      );

      setCustomerMessage(
        "Customer updated successfully."
      );

      setEditingCustomer(null);
    } catch (error) {
      console.error(
        "Update Customer Error:",
        error
      );

      setCustomerMessage(
        error.message ||
          "Unable to update customer."
      );
    } finally {
      setCustomerActionLoading(false);
    }
  };

  // =====================================================
  // DEACTIVATE CUSTOMER
  // =====================================================

  const deactivateCustomer = async (
    customerId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this customer?"
    );

    if (!confirmed) return;

    try {
      setCustomerActionLoading(true);
      setCustomerMessage("");

      await fetchJSON(
        `${API_URL}/admin/customers/${customerId}`,
        {
          method: "DELETE",
        }
      );

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === customerId
            ? {
                ...customer,
                is_active: false,
              }
            : customer
        )
      );

      setSelectedCustomer((current) =>
        current &&
        current.id === customerId
          ? {
              ...current,
              is_active: false,
            }
          : current
      );

      setCustomerMessage(
        "Customer account deactivated successfully."
      );
    } catch (error) {
      console.error(
        "Deactivate Customer Error:",
        error
      );

      setCustomerMessage(
        error.message ||
          "Unable to deactivate customer."
      );
    } finally {
      setCustomerActionLoading(false);
    }
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      setOrderActionLoading(true);
      setOrderMessage("");

      const data = await fetchJSON(
        `${API_URL}/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          body: JSON.stringify({
            status,
          }),
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          String(
            order.order_id || order.id
          ) === String(orderId)
            ? {
                ...order,
                status:
                  data?.order?.status ||
                  status,
              }
            : order
        )
      );

      setSelectedOrder((current) =>
        current &&
        String(
          current.order_id || current.id
        ) === String(orderId)
          ? {
              ...current,
              status:
                data?.order?.status ||
                status,
            }
          : current
      );

      setOrderMessage(
        "Order status updated successfully."
      );
    } catch (error) {
      console.error(
        "Update Order Status Error:",
        error
      );

      setOrderMessage(
        error.message ||
          "Unable to update order status."
      );
    } finally {
      setOrderActionLoading(false);
    }
  };

  // =====================================================
  // DELETE ORDER
  // =====================================================

  const deleteOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      setOrderActionLoading(true);

      await fetchJSON(
        `${API_URL}/admin/orders/${orderId}`,
        {
          method: "DELETE",
        }
      );

      setOrders((prev) =>
        prev.filter(
          (order) =>
            String(
              order.order_id || order.id
            ) !== String(orderId)
        )
      );

      setSelectedOrder(null);

      setOrderMessage(
        "Order deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete Order Error:",
        error
      );

      setOrderMessage(
        error.message ||
          "Unable to delete order."
      );
    } finally {
      setOrderActionLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "shopvista_admin_token"
    );

    localStorage.removeItem(
      "shopvista_admin"
    );

    localStorage.removeItem(
      "shopvista_token"
    );

    localStorage.removeItem("token");

    localStorage.removeItem(
      "shopvista_customer"
    );

    window.location.href = "/login";
  };

  // =====================================================
  // MENU
  // =====================================================

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Customers",
      icon: Users,
    },
    {
      name: "Products",
      icon: Package,
    },
    {
      name: "Orders",
      icon: ShoppingBag,
    },
    {
      name: "Order Details",
      icon: ClipboardList,
    },
    {
      name: "Payments",
      icon: CreditCard,
    },
    {
      name: "Invoices",
      icon: FileText,
    },
    {
      name: "Feedback",
      icon: MessageSquare,
    },
    {
      name: "Admins",
      icon: ShieldCheck,
    },
    {
      name: "Settings",
      icon: Settings,
    },
  ];

  // =====================================================
  // SIDEBAR
  // =====================================================

  const Sidebar = () => (
    <aside
      className={`admin-sidebar ${
        sidebarOpen
          ? "sidebar-open"
          : ""
      }`}
    >
      <div className="admin-logo">
        <div className="admin-logo-icon">
          <LayoutDashboard size={20} />
        </div>

        <div>
          <h2>AdminPanel</h2>
          <span>ShopVista</span>
        </div>

        <button
          className="mobile-close"
          onClick={() =>
            setSidebarOpen(false)
          }
        >
          <X size={20} />
        </button>
      </div>

      <div className="sidebar-section-title">
        MAIN MENU
      </div>

      <nav className="admin-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`admin-nav-item ${
                activeMenu === item.name
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setActiveMenu(item.name);
                setSidebarOpen(false);
                setOrderMessage("");
                setCustomerMessage("");
              }}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button
          className="admin-nav-item logout-item"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  // =====================================================
  // STAT CARD
  // =====================================================

  const StatCard = ({
    title,
    value,
    icon,
    change,
    positive = true,
  }) => {
    const Icon = icon;

    return (
      <div className="stat-card">
        <div className="stat-card-top">
          <div className="stat-icon">
            <Icon size={21} />
          </div>

          <button className="stat-menu">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="stat-title">
          {title}
        </div>

        <div className="stat-value">
          {value}
        </div>

        <div
          className={`stat-change ${
            positive
              ? "positive"
              : "negative"
          }`}
        >
          {positive ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}

          <span>{change}</span>

          <small>
            from last month
          </small>
        </div>
      </div>
    );
  };

  // =====================================================
  // DASHBOARD - SALES OVERVIEW
  // =====================================================

  const SalesOverview = () => {
    const chartValues = [
      35, 48, 42, 62, 51, 74,
      60, 82, 69, 88, 73, 94,
    ];

    const points = chartValues
      .map((value, index) => {
        const x =
          (index /
            (chartValues.length - 1)) *
          100;

        const y = 100 - value;

        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="dashboard-card sales-card">
        <div className="dashboard-card-header">
          <div>
            <h3>Sales Overview</h3>

            <p>
              Revenue performance
              over time
            </p>
          </div>

          <select className="chart-select">
            <option>
              This Month
            </option>
            <option>
              Last Month
            </option>
            <option>
              This Year
            </option>
          </select>
        </div>

        <div className="chart-wrapper">
          <div className="chart-y-labels">
            <span>BDT 100K</span>
            <span>BDT 75K</span>
            <span>BDT 50K</span>
            <span>BDT 25K</span>
            <span>BDT 0</span>
          </div>

          <div className="chart-area">
            <div className="chart-grid">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="sales-svg"
            >
              <polyline
                points={points}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className="chart-x-labels">
              <span>01</span>
              <span>05</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span>25</span>
              <span>30</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =====================================================
  // ORDER STATUS
  // =====================================================

  const OrderStatusCard = () => {
    const total =
      orders.length || 1;

    const delivered =
      orderStatus.Delivered;

    const processing =
      orderStatus.Processing;

    const pending =
      orderStatus.Pending;

    const cancelled =
      orderStatus.Cancelled;

    const confirmed =
      orderStatus.Confirmed;

    const shipped =
      orderStatus.Shipped;

    return (
      <div className="dashboard-card order-status-card">
        <div className="dashboard-card-header">
          <div>
            <h3>Order Status</h3>

            <p>
              Current order
              distribution
            </p>
          </div>

          <button className="icon-small-button">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="donut-container">
          <div
            className="donut"
            style={{
              background: `conic-gradient(
                #3478f6 0% ${
                  (delivered / total) *
                  100
                }%,
                #58c5a5 ${
                  (delivered / total) *
                  100
                }% ${
                  ((delivered +
                    processing) /
                    total) *
                  100
                }%,
                #f2b84b ${
                  ((delivered +
                    processing) /
                    total) *
                  100
                }% ${
                  ((delivered +
                    processing +
                    pending) /
                    total) *
                  100
                }%,
                #ef6b73 ${
                  ((delivered +
                    processing +
                    pending) /
                    total) *
                  100
                }% ${
                  ((delivered +
                    processing +
                    pending +
                    cancelled) /
                    total) *
                  100
                }%,
                #8b7cf6 ${
                  ((delivered +
                    processing +
                    pending +
                    cancelled) /
                    total) *
                  100
                }% 100%
              )`,
            }}
          >
            <div className="donut-inner">
              <strong>
                {orders.length}
              </strong>

              <span>Orders</span>
            </div>
          </div>
        </div>

        <div className="status-list">
          <div>
            <span className="status-dot delivered" />
            <span>Delivered</span>
            <strong>{delivered}</strong>
          </div>

          <div>
            <span className="status-dot processing" />
            <span>Processing</span>
            <strong>{processing}</strong>
          </div>

          <div>
            <span className="status-dot pending" />
            <span>Pending</span>
            <strong>{pending}</strong>
          </div>

          <div>
            <span className="status-dot cancelled" />
            <span>Cancelled</span>
            <strong>{cancelled}</strong>
          </div>

          <div>
            <span className="status-dot confirmed" />
            <span>Confirmed</span>
            <strong>{confirmed}</strong>
          </div>

          <div>
            <span className="status-dot shipped" />
            <span>Shipped</span>
            <strong>{shipped}</strong>
          </div>
        </div>
      </div>
    );
  };

  // =====================================================
  // RECENT ORDERS
  // =====================================================

  const RecentOrders = () => (
    <div className="dashboard-card table-card">
      <div className="dashboard-card-header">
        <div>
          <h3>Recent Orders</h3>

          <p>
            Latest customer
            orders
          </p>
        </div>

        <button
          className="view-all-button"
          onClick={() =>
            setActiveMenu("Orders")
          }
        >
          View All →
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="empty-table"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              recentOrders.map(
                (order) => (
                  <tr
                    key={
                      order.order_id ||
                      order.id
                    }
                  >
                    <td>
                      <strong>
                        #
                        {order.order_id ||
                          order.id}
                      </strong>
                    </td>

                    <td>
                      {order.Customer
                        ?.name ||
                        order.customer
                          ?.name ||
                        `Customer ${
                          order.customer_id ||
                          ""
                        }`}
                    </td>

                    <td>
                      {formatMoney(
                        order.total_amount
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${String(
                          order.status ||
                            "Pending"
                        )
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}`}
                      >
                        {getStatusIcon(
                          order.status
                        )}

                        {order.status ||
                          "Pending"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="table-action"
                        onClick={() =>
                          setSelectedOrder(
                            order
                          )
                        }
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // =====================================================
  // RECENT PAYMENTS
  // =====================================================

  const RecentPayments = () => (
    <div className="dashboard-card table-card">
      <div className="dashboard-card-header">
        <div>
          <h3>Recent Payments</h3>

          <p>
            Latest payment
            activity
          </p>
        </div>

        <button
          className="view-all-button"
          onClick={() =>
            setActiveMenu("Payments")
          }
        >
          View All →
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Payment</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentPayments.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="empty-table"
                >
                  No payments found
                </td>
              </tr>
            ) : (
              recentPayments.map(
                (payment) => (
                  <tr
                    key={
                      payment.payment_id
                    }
                  >
                    <td>
                      #
                      {
                        payment.payment_id
                      }
                    </td>

                    <td>
                      #
                      {
                        payment.order_id
                      }
                    </td>

                    <td>
                      {formatMoney(
                        payment.amount
                      )}
                    </td>

                    <td>
                      {
                        payment.payment_method
                      }
                    </td>

                    <td>
                      <span
                        className={`status-badge ${String(
                          payment.payment_status ||
                            "Pending"
                        )
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}`}
                      >
                        {getStatusIcon(
                          payment.payment_status
                        )}

                        {
                          payment.payment_status
                        }
                      </span>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // =====================================================
  // TOP PRODUCTS
  // =====================================================

  const TopProducts = () => {
    const topProducts =
      products.slice(0, 5);

    return (
      <div className="dashboard-card small-table-card">
        <div className="dashboard-card-header">
          <div>
            <h3>
              Top Selling Products
            </h3>

            <p>
              Best performing
              products
            </p>
          </div>

          <button
            className="view-all-button"
            onClick={() =>
              setActiveMenu("Products")
            }
          >
            View All →
          </button>
        </div>

        <div className="top-product-list">
          {topProducts.length === 0 ? (
            <div className="empty-state">
              No products found
            </div>
          ) : (
            topProducts.map(
              (product, index) => (
                <div
                  className="top-product"
                  key={product.id}
                >
                  <div className="product-rank">
                    {index + 1}
                  </div>

                  <div className="product-mini-image">
                    {product.image ? (
                      <img
                        src={
                          product.image.startsWith(
                            "http"
                          )
                            ? product.image
                            : `http://localhost:5000/${product.image.replace(
                                /^\/+/,
                                ""
                              )}`
                        }
                        alt={
                          product.name
                        }
                      />
                    ) : (
                      <Package size={20} />
                    )}
                  </div>

                  <div className="top-product-info">
                    <strong>
                      {
                        product.name
                      }
                    </strong>

                    <span>
                      {
                        product.category ||
                        "Product"
                      }
                    </span>
                  </div>

                  <strong className="top-product-price">
                    {formatMoney(
                      product.price
                    )}
                  </strong>
                </div>
              )
            )
          )}
        </div>
      </div>
    );
  };

  // =====================================================
  // CUSTOMERS PAGE
  // =====================================================

  const renderCustomersPage = () => {
    const filteredCustomers = customers.filter(
  (customer) => {
    const search = customerSearch
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

    if (!search) {
      return true;
    }

    const id = String(
      customer.id ?? ""
    ).toLowerCase();

    const name = String(
      customer.name ?? ""
    ).toLowerCase();

    const email = String(
      customer.email ?? ""
    ).toLowerCase();

    const phone = String(
      customer.phone ?? ""
    ).toLowerCase();

    const address = String(
      customer.address ?? ""
    ).toLowerCase();

    const status = String(
      customer.is_active === false
        ? "inactive"
        : "active"
    ).toLowerCase();

    const idWithHash = `#${id}`;

    return (
      id.includes(search) ||
      idWithHash.includes(search) ||
      name.includes(search) ||
      email.includes(search) ||
      phone.includes(search) ||
      address.includes(search) ||
      status.includes(search)
    );
  }
);

    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <h3>Customers</h3>
            <p>
              Manage your
              ShopVista customers
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Search customers..."
              value={customerSearch}
              onChange={(e) =>
                setCustomerSearch(
                  e.target.value
                )
              }
              style={{
                padding:
                  "10px 14px",
                borderRadius: "10px",
                border:
                  "1px solid #dbe7f5",
                outline: "none",
                minWidth: "230px",
              }}
            />

            <span>
              {filteredCustomers.length}{" "}
              customers
            </span>
          </div>
        </div>

        {customerMessage && (
          <div
            style={{
              marginBottom: "15px",
              padding: "12px 15px",
              borderRadius: "10px",
              background:
                "rgba(37,99,235,0.08)",
              color: "#1d4ed8",
              fontWeight: "600",
            }}
          >
            {customerMessage}
          </div>
        )}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="empty-table"
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(
                  (customer) => (
                    <tr
                      key={customer.id}
                    >
                      <td>
                        #{customer.id}
                      </td>

                      <td>
                        <strong>
                          {
                            customer.name
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          customer.email
                        }
                      </td>

                      <td>
                        {
                          customer.phone
                        }
                      </td>

                      <td>
                        {
                          customer.address
                        }
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            customer.is_active
                              ? "confirmed"
                              : "cancelled"
                          }`}
                        >
                          {customer.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div
                          style={{
                            display:
                              "flex",
                            gap: "8px",
                          }}
                        >
                          <button
                            className="table-action"
                            title="View"
                            onClick={() =>
                              setSelectedCustomer(
                                customer
                              )
                            }
                          >
                            <Eye
                              size={16}
                            />
                          </button>

                          <button
                            className="table-action"
                            title="Edit"
                            onClick={() =>
                              startEditCustomer(
                                customer
                              )
                            }
                          >
                            <Edit3
                              size={16}
                            />
                          </button>

                          {customer.is_active && (
                            <button
                              className="table-action"
                              title="Deactivate"
                              onClick={() =>
                                deactivateCustomer(
                                  customer.id
                                )
                              }
                            >
                              <X
                                size={16}
                              />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {editingCustomer && (
          <div
            style={{
              marginTop: "25px",
              padding: "25px",
              borderRadius: "16px",
              background:
                "rgba(255,255,255,0.6)",
              border:
                "1px solid #e2e8f0",
            }}
          >
            <div className="dashboard-card-header">
              <div>
                <h3>
                  Edit Customer #
                  {
                    editingCustomer.id
                  }
                </h3>

                <p>
                  Update customer
                  information
                </p>
              </div>

              <button
                className="table-action"
                onClick={
                  cancelEditCustomer
                }
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2,minmax(0,1fr))",
                gap: "15px",
              }}
            >
              <input
                value={
                  customerForm.name
                }
                placeholder="Customer Name"
                onChange={(e) =>
                  setCustomerForm({
                    ...customerForm,
                    name: e.target.value,
                  })
                }
              />

              <input
                value={
                  customerForm.email
                }
                placeholder="Email"
                onChange={(e) =>
                  setCustomerForm({
                    ...customerForm,
                    email:
                      e.target.value,
                  })
                }
              />

              <input
                value={
                  customerForm.phone
                }
                placeholder="Phone"
                onChange={(e) =>
                  setCustomerForm({
                    ...customerForm,
                    phone:
                      e.target.value,
                  })
                }
              />

              <input
                value={
                  customerForm.address
                }
                placeholder="Address"
                onChange={(e) =>
                  setCustomerForm({
                    ...customerForm,
                    address:
                      e.target.value,
                  })
                }
              />
            </div>

            <div
              style={{
                marginTop: "18px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                className="view-all-button"
                onClick={
                  updateCustomer
                }
                disabled={
                  customerActionLoading
                }
              >
                <Save size={16} />

                {customerActionLoading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                className="view-all-button"
                onClick={
                  cancelEditCustomer
                }
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {selectedCustomer && (
          <CustomerModal
            customer={
              selectedCustomer
            }
            onClose={() =>
              setSelectedCustomer(
                null
              )
            }
          />
        )}
      </div>
    );
  };

  // =====================================================
  // CUSTOMER MODAL
  // =====================================================

  const CustomerModal = ({
    customer,
    onClose,
  }) => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(15,23,42,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#fff",
          borderRadius: "20px",
          padding: "28px",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#142c52",
              }}
            >
              Customer Details
            </h2>

            <p
              style={{
                color: "#64748b",
              }}
            >
              Customer #{customer.id}
            </p>
          </div>

          <button
            className="table-action"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2,minmax(0,1fr))",
            gap: "15px",
          }}
        >
          <InfoBox
            icon={<User size={17} />}
            label="Name"
            value={customer.name}
          />

          <InfoBox
            icon={<Mail size={17} />}
            label="Email"
            value={customer.email}
          />

          <InfoBox
            icon={<Phone size={17} />}
            label="Phone"
            value={customer.phone}
          />

          <InfoBox
            icon={<MapPin size={17} />}
            label="Address"
            value={customer.address}
          />

          <InfoBox
            label="Status"
            value={
              customer.is_active
                ? "Active"
                : "Inactive"
            }
          />
        </div>

        <button
          className="view-all-button"
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: "22px",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  // =====================================================
  // INFO BOX
  // =====================================================

  const InfoBox = ({
    icon,
    label,
    value,
  }) => (
    <div
      style={{
        padding: "16px",
        background: "#f8fafc",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "7px",
          alignItems: "center",
          color: "#64748b",
        }}
      >
        {icon}
        <small>{label}</small>
      </div>

      <strong
        style={{
          display: "block",
          marginTop: "7px",
          color: "#142c52",
          wordBreak: "break-word",
        }}
      >
        {value || "—"}
      </strong>
    </div>
  );


  // =====================================================
  // PRODUCTS PAGE
  // =====================================================

const ProductsPage = () => {
  const filteredProducts =
    products.filter((product) => {
      const search =
        productSearch
          .trim()
          .toLowerCase();

      if (!search) return true;

      return (
        String(product.id)
          .toLowerCase()
          .includes(search) ||
        String(product.name || "")
          .toLowerCase()
          .includes(search) ||
        String(product.category || "")
          .toLowerCase()
          .includes(search)
      );
    });

  // =====================================================
  // VIEW PRODUCT
  // =====================================================

  const handleViewProduct = (product) => {
    alert(
      `Product Details\n\n` +
      `ID: #${product.id}\n` +
      `Name: ${product.name || "—"}\n` +
      `Category: ${product.category || "—"}\n` +
      `Price: ${formatMoney(product.price)}\n` +
      `Stock: ${product.stock ?? 0}\n` +
      `Status: ${
        Number(product.stock || 0) > 0
          ? "In Stock"
          : "Out of Stock"
      }\n\n` +
      `Description:\n${
        product.description || "No description"
      }`
    );
  };

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const handleEditProduct = async (product) => {
    try {
      const name = window.prompt(
        "Product Name:",
        product.name || ""
      );

      if (name === null) {
        return;
      }

      const category = window.prompt(
        "Category:",
        product.category || ""
      );

      if (category === null) {
        return;
      }

      const price = window.prompt(
        "Price (BDT):",
        product.price ?? ""
      );

      if (price === null) {
        return;
      }

      const stock = window.prompt(
        "Stock:",
        product.stock ?? 0
      );

      if (stock === null) {
        return;
      }

      const description =
        window.prompt(
          "Description:",
          product.description || ""
        );

      if (description === null) {
        return;
      }

      // =================================================
      // VALIDATION
      // =================================================

      if (!name.trim()) {
        alert("Product name is required.");
        return;
      }

      if (!category.trim()) {
        alert("Category is required.");
        return;
      }

      const numericPrice =
        Number(price);

      const numericStock =
        Number(stock);

      if (
        !Number.isFinite(
          numericPrice
        ) ||
        numericPrice <= 0
      ) {
        alert(
          "Price must be greater than 0."
        );
        return;
      }

      if (
        !Number.isInteger(
          numericStock
        ) ||
        numericStock < 0
      ) {
        alert(
          "Stock must be a non-negative integer."
        );
        return;
      }

      // =================================================
      // ADMIN TOKEN
      // =================================================

      const token =
        localStorage.getItem(
          "shopvista_admin_token"
        );

      if (!token) {
        alert(
          "Admin session expired. Please login again."
        );
        return;
      }

      // =================================================
      // UPDATE PRODUCT
      // =================================================

      const response =
        await fetch(
          `${API_URL}/products/${product.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              name: name.trim(),

              description:
                description.trim(),

              price:
                numericPrice,

              stock:
                numericStock,

              category:
                category.trim(),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          "Failed to update product"
        );
      }

      // =================================================
      // UPDATE FRONTEND LIST
      // =================================================

      setProducts((prevProducts) =>
        prevProducts.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  ...data.product,
                }
              : item
        )
      );

      alert(
        "Product updated successfully."
      );
    } catch (error) {
      console.error(
        "Edit Product Error:",
        error
      );

      alert(
        error.message ||
        "Failed to update product."
      );
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDeleteProduct = async (
    product
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        localStorage.getItem(
          "shopvista_admin_token"
        );

      if (!token) {
        alert(
          "Admin session expired. Please login again."
        );
        return;
      }

      // =================================================
      // DELETE FROM DATABASE
      // =================================================

      const response =
        await fetch(
          `${API_URL}/products/delete/${product.id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          "Failed to delete product"
        );
      }

      // =================================================
      // REMOVE FROM FRONTEND
      // =================================================

      setProducts((prevProducts) =>
        prevProducts.filter(
          (item) =>
            item.id !== product.id
        )
      );

      alert(
        "Product deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete Product Error:",
        error
      );

      alert(
        error.message ||
        "Failed to delete product."
      );
    }
  };

  // =====================================================
  // PRODUCTS PAGE UI
  // =====================================================

  return (
    <div className="dashboard-card">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="dashboard-card-header">

        <div>
          <h3>
            Products
          </h3>

          <p>
            Manage ShopVista products
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >

          {/* CREATE ITEM */}

          <button
            type="button"
            onClick={() =>
              setActiveMenu(
                "Create Product"
              )
            }
            style={{
              padding:
                "10px 18px",

              border: "none",

              borderRadius:
                "10px",

              background:
                "#2563eb",

              color:
                "#ffffff",

              fontWeight:
                "600",

              fontSize:
                "14px",

              cursor:
                "pointer",

              whiteSpace:
                "nowrap",

              boxShadow:
                "0 4px 12px rgba(37, 99, 235, 0.20)",
            }}
          >
            + Create Item
          </button>

          {/* SEARCH */}

          <input
            placeholder="Search products..."
            value={
              productSearch
            }
            onChange={(e) =>
              setProductSearch(
                e.target.value
              )
            }
            style={{
              padding:
                "10px 14px",

              border:
                "1px solid #dbe7f5",

              borderRadius:
                "10px",

              outline:
                "none",
            }}
          />

          <strong>
            {
              filteredProducts.length
            }
          </strong>

        </div>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="table-wrapper">

        <table>

          <thead>
            <tr>

              <th>
                ID
              </th>

              <th>
                Product
              </th>

              <th>
                Category
              </th>

              <th>
                Price
              </th>

              <th>
                Stock
              </th>

              <th>
                Status
              </th>

              <th>
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {filteredProducts.length ===
            0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="empty-table"
                >
                  No products found
                </td>

              </tr>

            ) : (

              filteredProducts.map(
                (product) => (

                  <tr
                    key={
                      product.id
                    }
                  >

                    {/* ID */}

                    <td>
                      #
                      {
                        product.id
                      }
                    </td>

                    {/* PRODUCT */}

                    <td>
                      <strong>
                        {
                          product.name
                        }
                      </strong>
                    </td>

                    {/* CATEGORY */}

                    <td>
                      {
                        product.category ||
                        "—"
                      }
                    </td>

                    {/* PRICE */}

                    <td>
                      {formatMoney(
                        product.price
                      )}
                    </td>

                    {/* STOCK */}

                    <td>
                      {
                        product.stock ??
                        0
                      }
                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`status-badge ${
                          Number(
                            product.stock ||
                              0
                          ) > 0
                            ? "confirmed"
                            : "cancelled"
                        }`}
                      >

                        {Number(
                          product.stock ||
                            0
                        ) > 0
                          ? "In Stock"
                          : "Out of Stock"}

                      </span>

                    </td>

                    {/* ACTION */}

                    <td>

                      <div
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap:
                            "8px",
                        }}
                      >

                        {/* VIEW */}

                        <button
                          type="button"
                          title="View Product"
                          onClick={() =>
                            handleViewProduct(
                              product
                            )
                          }
                          style={{
                            width:
                              "42px",

                            height:
                              "42px",

                            border:
                              "none",

                            borderRadius:
                              "10px",

                            background:
                              "#ffffff",

                            color:
                              "#2563eb",

                            cursor:
                              "pointer",

                            fontSize:
                              "20px",

                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "center",

                            boxShadow:
                              "0 2px 8px rgba(37, 99, 235, 0.08)",
                          }}
                        >
                          👁
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          title="Edit Product"
                          onClick={() =>
                            handleEditProduct(
                              product
                            )
                          }
                          style={{
                            width:
                              "42px",

                            height:
                              "42px",

                            border:
                              "none",

                            borderRadius:
                              "10px",

                            background:
                              "#ffffff",

                            color:
                              "#2563eb",

                            cursor:
                              "pointer",

                            fontSize:
                              "20px",

                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "center",

                            boxShadow:
                              "0 2px 8px rgba(37, 99, 235, 0.08)",
                          }}
                        >
                          ✎
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          title="Delete Product"
                          onClick={() =>
                            handleDeleteProduct(
                              product
                            )
                          }
                          style={{
                            width:
                              "42px",

                            height:
                              "42px",

                            border:
                              "none",

                            borderRadius:
                              "10px",

                            background:
                              "#ffffff",

                            color:
                              "#2563eb",

                            cursor:
                              "pointer",

                            fontSize:
                              "22px",

                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "center",

                            boxShadow:
                              "0 2px 8px rgba(37, 99, 235, 0.08)",
                          }}
                        >
                          ×
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

  // =====================================================
  // ORDERS PAGE
  // =====================================================

  const OrdersPage = () => {
    const filteredOrders =
      orders.filter((order) => {
        const search =
          orderSearch
            .trim()
            .toLowerCase();

        if (!search) return true;

        const customerName =
          order.Customer?.name ||
          order.customer?.name ||
          order.customer_name ||
          "";

        return (
          String(
            order.order_id ||
              order.id ||
              ""
          )
            .toLowerCase()
            .includes(search) ||
          String(customerName)
            .toLowerCase()
            .includes(search) ||
          String(
            order.status || ""
          )
            .toLowerCase()
            .includes(search)
        );
      });

    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <h3>Orders</h3>
            <p>
              Manage all customer
              orders
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <input
              placeholder="Search orders..."
              value={orderSearch}
              onChange={(e) =>
                setOrderSearch(
                  e.target.value
                )
              }
              style={{
                padding:
                  "10px 14px",
                border:
                  "1px solid #dbe7f5",
                borderRadius: "10px",
                outline: "none",
              }}
            />

            <strong>
              {filteredOrders.length}
            </strong>
          </div>
        </div>

        {orderMessage && (
          <div
            style={{
              padding: "12px",
              marginBottom: "15px",
              background:
                "rgba(37,99,235,0.08)",
              color: "#1d4ed8",
              borderRadius: "10px",
            }}
          >
            {orderMessage}
          </div>
        )}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-table"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map(
                  (order) => {
                    const status =
                      order.status ||
                      "Pending";

                    const customerName =
                      order.Customer
                        ?.name ||
                      order.customer
                        ?.name ||
                      order.customer_name ||
                      "Unknown";

                    return (
                      <tr
                        key={
                          order.order_id ||
                          order.id
                        }
                      >
                        <td>
                          <strong>
                            #
                            {
                              order.order_id ||
                              order.id
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            customerName
                          }
                        </td>

                        <td>
                          {formatMoney(
                            order.total_amount ??
                              order.total ??
                              order.amount
                          )}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${String(
                              status
                            )
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >
                            {getStatusIcon(
                              status
                            )}

                            {status}
                          </span>
                        </td>

                        <td>
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString(
                                "en-BD"
                              )
                            : "—"}
                        </td>

                        <td>
                          <button
                            className="table-action"
                            title="View"
                            onClick={() =>
                              setSelectedOrder(
                                order
                              )
                            }
                          >
                            <Eye
                              size={16}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <OrderModal
            order={selectedOrder}
            onClose={() =>
              setSelectedOrder(
                null
              )
            }
            onStatusChange={
              updateOrderStatus
            }
            onDelete={
              deleteOrder
            }
            loading={
              orderActionLoading
            }
          />
        )}
      </div>
    );
  };

  // =====================================================
  // ORDER MODAL
  // =====================================================

  const OrderModal = ({
    order,
    onClose,
    onStatusChange,
    onDelete,
    loading,
  }) => {
    const orderId =
      order.order_id || order.id;

    const customer =
      order.Customer ||
      order.customer ||
      {};

    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "rgba(15,23,42,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px",
        }}
        onClick={onClose}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "760px",
            maxHeight: "90vh",
            overflowY: "auto",
            background: "#fff",
            borderRadius: "20px",
            padding: "30px",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.2)",
          }}
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#142c52",
                }}
              >
                Order Details
              </h2>

              <p
                style={{
                  color: "#64748b",
                }}
              >
                Order #{orderId}
              </p>
            </div>

            <button
              className="table-action"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2,minmax(0,1fr))",
              gap: "15px",
            }}
          >
            <InfoBox
              label="Customer"
              value={
                customer.name ||
                `Customer ${
                  order.customer_id ||
                  ""
                }`
              }
            />

            <InfoBox
              label="Customer Email"
              value={
                customer.email ||
                "—"
              }
            />

            <InfoBox
              label="Phone"
              value={
                customer.phone ||
                "—"
              }
            />

            <InfoBox
              label="Total Amount"
              value={formatMoney(
                order.total_amount ??
                  order.total ??
                  order.amount
              )}
            />

            <InfoBox
              label="Payment Method"
              value={
                order.payment_method ||
                order.paymentMethod ||
                "—"
              }
            />

            <InfoBox
              label="Payment Status"
              value={
                order.payment_status ||
                order.paymentStatus ||
                "—"
              }
            />
          </div>

          {/* STATUS UPDATE */}

          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "14px",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "#142c52",
              }}
            >
              Update Order Status
            </h3>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {[
                "Pending",
                "Confirmed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
              ].map((status) => (
                <button
                  key={status}
                  disabled={loading}
                  className="view-all-button"
                  onClick={() =>
                    onStatusChange(
                      orderId,
                      status
                    )
                  }
                  style={{
                    opacity:
                      order.status ===
                      status
                        ? 0.55
                        : 1,
                  }}
                >
                  {status}
                </button>
              ))}
            </div>

            <p
              style={{
                marginBottom: 0,
                color: "#64748b",
              }}
            >
              Current status:{" "}
              <strong>
                {order.status ||
                  "Pending"}
              </strong>
            </p>
          </div>

          {/* ORDER ITEMS */}

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <h3
              style={{
                color: "#142c52",
              }}
            >
              Order Items
            </h3>

            {(
              order.OrderDetails ||
              order.orderDetails ||
              []
            ).length === 0 ? (
              <div
                style={{
                  padding: "18px",
                  background:
                    "#f8fafc",
                  borderRadius:
                    "12px",
                }}
              >
                No order details
                available.
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(
                      order.OrderDetails ||
                      order.orderDetails ||
                      []
                    ).map(
                      (
                        detail,
                        index
                      ) => (
                        <tr
                          key={
                            detail.id ||
                            index
                          }
                        >
                          <td>
                            {
                              detail
                                .Product
                                ?.name
                            ||
                              detail.product
                                ?.name ||
                              `Product ${
                                detail.product_id ||
                                ""
                              }`}
                          </td>

                          <td>
                            {
                              detail.quantity
                            }
                          </td>

                          <td>
                            {formatMoney(
                              detail.price ||
                                detail.unit_price ||
                                0
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* DELETE */}

          <button
            onClick={() =>
              onDelete(orderId)
            }
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "13px",
              border: "none",
              borderRadius: "10px",
              background: "#ef4444",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <Trash2
              size={16}
              style={{
                verticalAlign:
                  "middle",
                marginRight: "6px",
              }}
            />

            Delete Order
          </button>
        </div>
      </div>
    );
  };

  // =====================================================
  // ORDER DETAILS PAGE
  // =====================================================

  const OrderDetailsPage = () => {
    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <h3>Order Details</h3>

            <p>
              Detailed view of all
              orders
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-table"
                  >
                    No order details
                    found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={
                      order.order_id ||
                      order.id
                    }
                  >
                    <td>
                      #
                      {
                        order.order_id ||
                        order.id
                      }
                    </td>

                    <td>
                      {order.Customer
                        ?.name ||
                        order.customer
                          ?.name ||
                        "Unknown"}
                    </td>

                    <td>
                      {formatMoney(
                        order.total_amount
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${String(
                          order.status ||
                            "Pending"
                        )
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}`}
                      >
                        {order.status ||
                          "Pending"}
                      </span>
                    </td>

                    <td>
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString(
                            "en-BD"
                          )
                        : "—"}
                    </td>

                    <td>
                      <button
                        className="table-action"
                        onClick={() =>
                          setSelectedOrder(
                            order
                          )
                        }
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <OrderModal
            order={selectedOrder}
            onClose={() =>
              setSelectedOrder(null)
            }
            onStatusChange={
              updateOrderStatus
            }
            onDelete={deleteOrder}
            loading={
              orderActionLoading
            }
          />
        )}
      </div>
    );
  };

  // =====================================================
  // PAYMENTS PAGE
  // =====================================================

  const PaymentsPage = () => {
    const filteredPayments =
      payments.filter(
        (payment) => {
          const search =
            paymentSearch
              .trim()
              .toLowerCase();

          if (!search) return true;

          return (
            String(
              payment.payment_id ||
                ""
            )
              .toLowerCase()
              .includes(search) ||
            String(
              payment.order_id || ""
            )
              .toLowerCase()
              .includes(search) ||
            String(
              payment.payment_method ||
                ""
            )
              .toLowerCase()
              .includes(search) ||
            String(
              payment.payment_status ||
                ""
            )
              .toLowerCase()
              .includes(search)
          );
        }
      );

    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <h3>Payments</h3>

            <p>
              Manage all payment
              transactions
            </p>
          </div>

          <input
            placeholder="Search payments..."
            value={paymentSearch}
            onChange={(e) =>
              setPaymentSearch(
                e.target.value
              )
            }
            style={{
              padding:
                "10px 14px",
              border:
                "1px solid #dbe7f5",
              borderRadius: "10px",
              outline: "none",
            }}
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Method</th>
                <th>Transaction</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="empty-table"
                  >
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map(
                  (payment) => (
                    <tr
                      key={
                        payment.payment_id
                      }
                    >
                      <td>
                        #
                        {
                          payment.payment_id
                        }
                      </td>

                      <td>
                        #
                        {
                          payment.order_id
                        }
                      </td>

                      <td>
                        {
                          payment.payment_method
                        }
                      </td>

                      <td>
                        {
                          payment.transaction_id ||
                          "—"
                        }
                      </td>

                      <td>
                        {formatMoney(
                          payment.amount
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${String(
                            payment.payment_status ||
                              "Pending"
                          )
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                        >
                          {getStatusIcon(
                            payment.payment_status
                          )}

                          {
                            payment.payment_status
                          }
                        </span>
                      </td>

                      <td>
                        {payment.payment_date
                          ? new Date(
                              payment.payment_date
                            ).toLocaleDateString(
                              "en-BD"
                            )
                          : "—"}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // =====================================================
  // INVOICES PAGE
  // =====================================================

  const InvoicesPage = () => {
    const printInvoice = (order) => {
      const orderId =
        order.order_id ||
        order.id;

      const customer =
        order.Customer ||
        order.customer ||
        {};

      const invoiceWindow =
        window.open(
          "",
          "_blank",
          "width=900,height=700"
        );

      if (!invoiceWindow) {
        alert(
          "Please allow popups to print invoice."
        );
        return;
      }

      invoiceWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${orderId}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 40px;
                color: #142c52;
              }

              h1 {
                margin-bottom: 5px;
              }

              .header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 40px;
              }

              .box {
                padding: 20px;
                background: #f8fafc;
                border-radius: 10px;
                margin-bottom: 20px;
              }

              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 30px;
              }

              th, td {
                border-bottom: 1px solid #ddd;
                padding: 12px;
                text-align: left;
              }

              .total {
                text-align: right;
                margin-top: 30px;
                font-size: 20px;
                font-weight: bold;
              }
            </style>
          </head>

          <body>
            <div class="header">
              <div>
                <h1>ShopVista</h1>
                <p>Customer Invoice</p>
              </div>

              <div>
                <strong>Invoice #${orderId}</strong>
              </div>
            </div>

            <div class="box">
              <strong>Customer</strong>
              <p>
                ${customer.name || "Unknown"}
              </p>
              <p>
                ${customer.email || ""}
              </p>
              <p>
                ${customer.phone || ""}
              </p>
              <p>
                ${customer.address || ""}
              </p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>#${orderId}</td>
                  <td>${order.status || "Pending"}</td>
                  <td>
                    ${formatMoney(
                      order.total_amount
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="total">
              Total:
              ${formatMoney(
                order.total_amount
              )}
            </div>

            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);

      invoiceWindow.document.close();
    };

    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <h3>Invoices</h3>

            <p>
              Generate and print
              customer invoices
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Order</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-table"
                  >
                    No invoices
                    available
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={
                      order.order_id ||
                      order.id
                    }
                  >
                    <td>
                      INV-
                      {
                        order.order_id ||
                        order.id
                      }
                    </td>

                    <td>
                      {order.Customer
                        ?.name ||
                        order.customer
                          ?.name ||
                        "Unknown"}
                    </td>

                    <td>
                      #
                      {
                        order.order_id ||
                        order.id
                      }
                    </td>

                    <td>
                      {formatMoney(
                        order.total_amount
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${String(
                          order.status ||
                            "Pending"
                        )
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}`}
                      >
                        {order.status ||
                          "Pending"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-all-button"
                        onClick={() =>
                          printInvoice(
                            order
                          )
                        }
                      >
                        <Printer
                          size={15}
                        />

                        Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // =====================================================
  // FEEDBACK PAGE
  // =====================================================

  const FeedbackPage = () => {
    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <h3>Feedback</h3>

            <p>
              Customer reviews and
              feedback
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "15px",
          }}
        >
          {[
            {
              name: "Customer",
              rating: 5,
              message:
                "Great product and fast delivery!",
            },
            {
              name: "Customer",
              rating: 5,
              message:
                "Very good shopping experience.",
            },
            {
              name: "Customer",
              rating: 4,
              message:
                "Product quality was excellent.",
            },
          ].map(
            (feedback, index) => (
              <div
                key={index}
                style={{
                  padding: "20px",
                  background:
                    "#f8fafc",
                  borderRadius:
                    "14px",
                  display: "flex",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius:
                      "50%",
                    background:
                      "#3b82f6",
                    color: "#fff",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    fontWeight:
                      "700",
                  }}
                >
                  {feedback.name.charAt(
                    0
                  )}
                </div>

                <div>
                  <strong>
                    {feedback.name}
                  </strong>

                  <div
                    style={{
                      display: "flex",
                      gap: "2px",
                      margin:
                        "5px 0",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          size={14}
                          fill={
                            star <=
                            feedback.rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      )
                    )}
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color:
                        "#64748b",
                    }}
                  >
                    {
                      feedback.message
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  // =====================================================
  // ADMINS PAGE
  // =====================================================

  const AdminsPage = () => {
    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <h3>Admins</h3>

            <p>
              Current ShopVista
              administrator
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  #{adminData.id || "1"}
                </td>

                <td>
                  <strong>
                    {adminData.name ||
                      "ShopVista Admin"}
                  </strong>
                </td>

                <td>
                  {adminData.email ||
                    "—"}
                </td>

                <td>
                  {adminData.role ||
                    "admin"}
                </td>

                <td>
                  <span className="status-badge confirmed">
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // =====================================================
  // SETTINGS PAGE
  // =====================================================

  const SettingsPage = () => {
    const updateSetting = (
      key,
      value
    ) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <h3>Settings</h3>

            <p>
              Manage ShopVista
              dashboard settings
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "20px",
            maxWidth: "700px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom:
                  "8px",
              }}
            >
              Store Name
            </label>

            <input
              value={
                settings.storeName
              }
              onChange={(e) =>
                updateSetting(
                  "storeName",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "12px",
                border:
                  "1px solid #dbe7f5",
                borderRadius: "10px",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom:
                  "8px",
              }}
            >
              Currency
            </label>

            <select
              value={
                settings.currency
              }
              onChange={(e) =>
                updateSetting(
                  "currency",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "12px",
                border:
                  "1px solid #dbe7f5",
                borderRadius: "10px",
              }}
            >
              <option value="BDT">
                BDT
              </option>

              <option value="USD">
                USD
              </option>
            </select>
          </div>

          <SettingToggle
            label="Email Notifications"
            checked={
              settings.emailNotifications
            }
            onChange={(value) =>
              updateSetting(
                "emailNotifications",
                value
              )
            }
          />

          <SettingToggle
            label="Order Notifications"
            checked={
              settings.orderNotifications
            }
            onChange={(value) =>
              updateSetting(
                "orderNotifications",
                value
              )
            }
          />

          <SettingToggle
            label="Low Stock Notifications"
            checked={
              settings.lowStockNotifications
            }
            onChange={(value) =>
              updateSetting(
                "lowStockNotifications",
                value
              )
            }
          />

          <button
            className="view-all-button"
            onClick={() =>
              alert(
                "Settings saved successfully."
              )
            }
          >
            <Save size={16} />
            Save Settings
          </button>
        </div>
      </div>
    );
  };

  // =====================================================
  // SETTING TOGGLE
  // =====================================================

  const SettingToggle = ({
    label,
    checked,
    onChange,
  }) => (
<div
  className="setting-toggle"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 22px",
    background: "var(--setting-item-bg)",
    border: "1px solid var(--setting-item-border)",
    borderRadius: "16px",
    color: "var(--text-primary)",
    transition: "all 0.25s ease",
  }}
>
    
      <strong>{label}</strong>

      <button
        onClick={() =>
          onChange(!checked)
        }
        style={{
          border: "none",
          borderRadius: "20px",
          padding: "9px 16px",
          cursor: "pointer",
          background: checked
  ? "#2563eb"
  : "#64748b",
          color: "#fff",
          fontWeight: "600",
        }}
      >
        {checked
          ? "ON"
          : "OFF"}
      </button>
    </div>
  );

  // =====================================================
  // DASHBOARD PAGE
  // =====================================================

  const DashboardPage = () => (
    <>
      <section className="stats-grid">
        <StatCard
          title="Total Products"
          value={totalProducts.toLocaleString()}
          icon={Package}
          change="+12%"
        />

        <StatCard
          title="Total Customers"
          value={totalCustomers.toLocaleString()}
          icon={Users}
          change="+18%"
        />

        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={ShoppingBag}
          change="+22%"
        />

        <StatCard
          title="Total Revenue"
          value={formatMoney(
            totalRevenue
          )}
          icon={DollarSign}
          change="+25%"
        />
      </section>

      <section className="dashboard-grid-two">
        <SalesOverview />
        <OrderStatusCard />
      </section>

      <RecentOrders />

      <section className="dashboard-grid-two">
        <TopProducts />

        <div className="dashboard-card small-table-card">
          <div className="dashboard-card-header">
            <div>
              <h3>
                Store Summary
              </h3>

              <p>
                Current store
                information
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            <InfoBox
              label="Products"
              value={totalProducts}
            />

            <InfoBox
              label="Customers"
              value={totalCustomers}
            />

            <InfoBox
              label="Orders"
              value={totalOrders}
            />

            <InfoBox
              label="Revenue"
              value={formatMoney(
                totalRevenue
              )}
            />
          </div>
        </div>
      </section>

      <RecentPayments />
    </>
  );

  // =====================================================
  // PAGE RENDERER
  // =====================================================

const renderPage = () => {
  switch (activeMenu) {
    case "Dashboard":
      return <DashboardPage />;

    case "Customers":
      return renderCustomersPage();

    case "Products":
      return <ProductsPage />;

    case "Create Product":
      return (
        <CreateProductPage
          onBack={() => setActiveMenu("Products")}
        />
      );

    case "Orders":
      return <OrdersPage />;

    case "Order Details":
      return (
        <OrderDetailsPage />
      );

    case "Payments":
      return <PaymentsPage />;

    case "Invoices":
      return <InvoicesPage />;

    case "Feedback":
      return <FeedbackPage />;

    case "Admins":
      return <AdminsPage />;

    case "Settings":
      return <SettingsPage />;

    default:
      return <DashboardPage />;
  }
};
  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <div
      className={`admin-dashboard ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      <Sidebar />

      <main className="admin-main">
        {/* =============================================
            TOP BAR
        ============================================= */}

        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-button"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <Menu size={21} />
            </button>

            <div>
              <h1>
                {activeMenu}
              </h1>

              <p>
                Here's what's
                happening with your
                store today.
              </p>
            </div>
          </div>

          <div className="topbar-right">
           <div className="topbar-right">

  {/* =================================================
      GLOBAL SEARCH
  ================================================= */}

  <div className="admin-search header-search-wrap">

    <Search size={17} />

    <input
      type="text"
      placeholder="Search products, customers, orders..."
      value={headerSearch}
      onChange={(event) =>
        setHeaderSearch(
          event.target.value
        )
      }
      onKeyDown={
        handleHeaderSearchKeyDown
      }
    />

    {headerSearch.trim() && (
      <div className="header-search-results">

        {headerSearchResults.length === 0 ? (

          <div className="header-search-empty">
            No matching results
          </div>

        ) : (

          headerSearchResults.map(
            (result, index) => {

              const ResultIcon =
                result.type === "Products"
                  ? Package
                  : result.type === "Customers"
                  ? Users
                  : ShoppingBag;

              return (
                <button
                  key={`${result.type}-${index}`}
                  className="header-search-result"
                  onClick={() =>
                    handleHeaderSearchSelect(
                      result
                    )
                  }
                >

                  <span className="search-result-icon">
                    <ResultIcon size={17} />
                  </span>

                  <span className="search-result-content">

                    <strong>
                      {result.title}
                    </strong>

                    <small>
                      {result.type}
                      {" • "}
                      {result.subtitle}
                    </small>

                  </span>

                </button>
              );
            }
          )

        )}

      </div>
    )}

  </div>


  {/* =================================================
      DARK MODE
  ================================================= */}

  <button
    className="topbar-icon theme-toggle"
    title={
      darkMode
        ? "Switch to Light Mode"
        : "Switch to Dark Mode"
    }
    aria-label={
      darkMode
        ? "Switch to Light Mode"
        : "Switch to Dark Mode"
    }
    onClick={() =>
      setDarkMode(
        (current) => !current
      )
    }
  >
    {darkMode ? (
      <Sun size={19} />
    ) : (
      <Moon size={19} />
    )}
  </button>


  {/* =================================================
      NOTIFICATION
  ================================================= */}

  <div className="notification-wrap">

    <button
      className="topbar-icon notification-button"
      title="Notifications"
      onClick={() => {
        setShowNotifications(
          (current) => !current
        );

        setShowProfileMenu(false);
      }}
    >

      <Bell size={19} />

      {!notificationsRead &&
        adminNotifications.length > 0 && (
          <span className="notification-dot">
            {adminNotifications.length}
          </span>
        )}

    </button>


    {showNotifications && (

      <div className="notification-dropdown">

        <div className="notification-header">

          <div>
            <strong>
              Notifications
            </strong>

            <span>
              {adminNotifications.length} notification
              {adminNotifications.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          {adminNotifications.length > 0 && (
            <button
              className="notification-mark-read"
              onClick={() =>
                setNotificationsRead(true)
              }
            >
              Mark all as read
            </button>
          )}

        </div>


        <div className="notification-list">

          {adminNotifications.length === 0 ? (

            <div className="notification-empty">
              <Bell size={25} />
              <strong>
                No new notifications
              </strong>
              <span>
                You're all caught up.
              </span>
            </div>

          ) : (

            adminNotifications.map(
              (notification) => {

                const NotificationIcon =
                  notification.icon;

                return (
                  <button
                    key={notification.id}
                    className="notification-item"
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                  >

                    <span className="notification-item-icon">
                      <NotificationIcon
                        size={18}
                      />
                    </span>

                    <span className="notification-item-content">

                      <strong>
                        {notification.title}
                      </strong>

                      <small>
                        {notification.message}
                      </small>

                    </span>

                  </button>
                );
              }
            )

          )}

        </div>


        <button
          className="notification-footer"
          onClick={() => {
            setActiveMenu("Orders");
            setShowNotifications(false);
          }}
        >
          View Orders
        </button>

      </div>

    )}

  </div>


  {/* =================================================
      SETTINGS
  ================================================= */}

  <button
    className="topbar-icon"
    title="Settings"
    onClick={() => {
      setActiveMenu("Settings");
      setShowNotifications(false);
      setShowProfileMenu(false);
    }}
  >
    <Settings size={19} />
  </button>


  {/* =================================================
      ADMIN PROFILE
  ================================================= */}

  <div className="admin-profile-wrap">

    <div
      className="admin-profile"
      role="button"
      tabIndex={0}
      onClick={() => {
        setShowProfileMenu(
          (current) => !current
        );

        setShowNotifications(false);
      }}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();

          setShowProfileMenu(
            (current) => !current
          );

          setShowNotifications(false);
        }
      }}
    >

      <div className="profile-avatar">

        {(
          adminData.name ||
          "Admin"
        )
          .charAt(0)
          .toUpperCase()}

      </div>


      <div className="profile-info">

        <strong>
          {adminData.name ||
            "ShopVista Admin"}
        </strong>

        <span>
          {adminData.role ||
            "admin"}
        </span>

      </div>


      <ChevronDown
        size={16}
        className={
          showProfileMenu
            ? "profile-chevron-open"
            : ""
        }
      />

    </div>


    {showProfileMenu && (

      <div className="profile-dropdown">

        <div className="profile-dropdown-header">

          <div className="profile-dropdown-avatar">
            {(
              adminData.name ||
              "Admin"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <strong>
              {adminData.name ||
                "ShopVista Admin"}
            </strong>

            <span>
              {adminData.email ||
                "Administrator"}
            </span>

          </div>

        </div>


        <div className="profile-dropdown-divider" />


        <button
          className="profile-dropdown-item"
          onClick={() => {
            setActiveMenu("Admins");
            setShowProfileMenu(false);
          }}
        >
          <User size={18} />
          <span>
            My Profile
          </span>
        </button>


        <button
          className="profile-dropdown-item"
          onClick={() => {
            setActiveMenu("Settings");
            setShowProfileMenu(false);
          }}
        >
          <Settings size={18} />
          <span>
            Settings
          </span>
        </button>


        <div className="profile-dropdown-divider" />


        <button
          className="profile-dropdown-item logout-item"
          onClick={() => {
            setShowProfileMenu(false);
            handleLogout();
          }}
        >
          <LogOut size={18} />
          <span>
            Logout
          </span>
        </button>

      </div>

    )}

  </div>

</div>
          </div>
        </header>

        {/* =============================================
            LOADING
        ============================================= */}

        {loading && (
          <div className="dashboard-loading">
            <RefreshCw
              size={20}
              className="spin"
            />

            <span>
              Loading dashboard...
            </span>
          </div>
        )}

        {/* =============================================
            ERROR
        ============================================= */}

        {error && !loading && (
          <div className="dashboard-error">
            <strong>
              Dashboard data warning
            </strong>

            <span>{error}</span>

            <button
              onClick={
                loadDashboard
              }
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {/* =============================================
            PAGE CONTENT
        ============================================= */}

        {renderPage()}

        {/* =============================================
            FOOTER
        ============================================= */}

        <footer className="admin-footer">
          <span>
            © 2026 ShopVista.
            All rights reserved.
          </span>

          <span>
            {activeMenu}
          </span>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;