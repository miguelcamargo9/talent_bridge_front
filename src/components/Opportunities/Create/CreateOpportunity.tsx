import React, { useState, useEffect } from "react";
import styles from "./CreateOpportunity.module.scss";
import layoutStyles from "../../Layout/Layout.module.scss";
import { Opportunity } from "../../../models/Opportunity";
import { Errors } from "../../../models/Error";
import { createOpportunity } from "../../../services/opportunitiesService";
import Alert from "../../Alert/Alert";
import { useNavigate } from "react-router-dom";

const CreateOpportunity: React.FC = () => {
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [opportunity, setOpportunity] = useState<Opportunity>({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState<Errors>({
    title: "",
    description: "",
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

  const validateField = (name: keyof Opportunity, value: string) => {
    if (!value) {
      const fieldName =
        name.charAt(0).toUpperCase() + name.slice(1).replace("_", " ");
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `The field ${fieldName} is required`,
      }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof Opportunity; value: string };
    setOpportunity((prevOpportunity) => ({
      ...prevOpportunity,
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
    (Object.keys(opportunity) as Array<keyof Opportunity>).forEach((key) => {
      const stringValue = opportunity[key]?.toString() ?? "";
      isValid = validateField(key, stringValue) && isValid;
    });

    if (!isValid) {
      // Prevent form submission if validation fails
      return;
    }

    // Submit form if all validations pass
    try {
      await createOpportunity(opportunity);
      setAlertInfo({ message: "Opportunity successfully created", type: "success" });
      setShouldRedirect(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      setAlertInfo({
        message: `The opportunity couldn't be created: ${error.message}`,
        type: "error",
      });
    }
  };

  const getInputClassName = (fieldName: string) => {
    return errors[fieldName] ? `${styles.input} ${styles.error}` : styles.input;
  };

  const clearForm = () => {
    setOpportunity({
      title: "",
      description: "",
    });
    setErrors({
      title: "",
      description: "",
    });
  };

  const isFormDirtyOrInvalid = () => {
    const fieldsNotEmpty = Object.values(opportunity).some((value) => value !== "");
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
      <h2>Create Opportunity</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            name="title"
            value={opportunity.title}
            onChange={handleChange}
            className={getInputClassName("title")}
          />
          {errors.title && (
            <div className={styles.errorMsg}>{errors.title}</div>
          )}
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            type="text"
            name="description"
            value={opportunity.description}
            onChange={handleChange}
            className={getInputClassName("description")}
          />
          {errors.description && (
            <div className={styles.errorMsg}>{errors.description}</div>
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

export default CreateOpportunity;
