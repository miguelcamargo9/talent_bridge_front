import React, { useState, useEffect } from "react";
import styles from "./CreateUser.module.scss";
import layoutStyles from "../../Layout/Layout.module.scss";
import { User } from "../../../models/User";
import { Errors } from "../../../models/Error";
import { createUser } from "../../../services/usersService";
import Alert from "../../Alert/Alert";
import { useNavigate } from "react-router-dom";

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Errors>({
    name: "",
    email: "",
    phone: "",
  });
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (shouldRedirect) {
      timer = setTimeout(() => {
        navigate(-1);
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [shouldRedirect, navigate]);

  const validateField = (name: keyof User, value: string) => {
    if (!value) {
      const fieldName =
        name.charAt(0).toUpperCase() + name.slice(1).replace("_", " ");
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `The field ${fieldName} is required`,
      }));
      return false;
    }
    if (name === "email" && !validateEmail(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Please enter a valid email address",
      }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    return true;
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof User; value: string };
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;

    // Validate all fields
    (Object.keys(user) as Array<keyof User>).forEach((key) => {
      const stringValue = user[key]?.toString() ?? "";
      isValid = validateField(key, stringValue) && isValid;
    });

    if (!isValid) {
      // Prevent form submission if validation fails
      return;
    }

    // Submit form if all validations pass
    try {
      await createUser(user);
      setAlertInfo({ message: "User successfully created", type: "success" });
      setShouldRedirect(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      setAlertInfo({
        message: `The user couldn't be created: ${error.message}`,
        type: "error",
      });
    }
  };

  const getInputClassName = (fieldName: string) => {
    return errors[fieldName] ? `${styles.input} ${styles.error}` : styles.input;
  };

  const clearForm = () => {
    setUser({
      name: "",
      email: "",
      phone: "",
    });
    setErrors({
      name: "",
      email: "",
      phone: "",
    });
  };

  const isFormDirtyOrInvalid = () => {
    const fieldsNotEmpty = Object.values(user).some((value) => value !== "");
    const errorsPresent = Object.values(errors).some((error) => error !== "");
    return fieldsNotEmpty || errorsPresent;
  };

  const handleCloseAlert = () => {
    setAlertInfo({ message: "", type: null });
  };

  return (
    <div className={styles.formContainer}>
      {alertInfo.type && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          onClose={handleCloseAlert}
        />
      )}
      <h2>Create User</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className={getInputClassName("name")}
          />
          {errors.name && <div className={styles.errorMsg}>{errors.name}</div>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className={getInputClassName("email")}
          />
          {errors.email && (
            <div className={styles.errorMsg}>{errors.email}</div>
          )}
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input
            id="phone"
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className={getInputClassName("phone")}
          />
          {errors.phone && (
            <div className={styles.errorMsg}>{errors.phone}</div>
          )}
        </div>
      </form>
      <div className={styles.buttonContainer}>
        {isFormDirtyOrInvalid() && (
          <button
            onClick={clearForm}
            className={`${layoutStyles.button} ${layoutStyles.secondary}`}
          >
            Clear
          </button>
        )}
        {!isFormDirtyOrInvalid() && (
          <button
            onClick={() => navigate(-1)}
            className={`${layoutStyles.button} ${layoutStyles.secondary}`}
          >
            Cancel
          </button>
        )}
        <button onClick={handleSubmit}>Create</button>
      </div>
    </div>
  );
};

export default CreateUser;
