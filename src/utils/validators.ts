import { boolean, number, string } from "yup"

export const usernameValidator = string()
  .min(3, "Username must be at least 3 characters long")
  .required("Username is required")

export const emailValidator = string()
  .email("Invalid email format")
  .required("Email is required")

export const passwordValidator = string()
  .min(10, "Password must be at least 10 characters long")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  )
  .required("Password is required")

export const userIdValidator = number()
  .positive("User ID must be a positive number")
  .integer("User ID must be an integer")
  .required("User ID is required")

export const statusValidator = boolean().required("Status is required")

export const idValidator = number()
  .positive("ID must be positive")
  .integer("ID must be an integer")
  .min(1, "ID must be at least 1")
  .required("ID is required")

export const pageValidator = number()
  .positive("Page must be positive")
  .integer("Page must be an integer")
  .min(1, "Page must be at least 1")
  .default(1)

export const postTitleValidator = string()
  .min(3, "Title must be at least 3 characters long")
  .required("Title is required")

export const postContentValidator = string()
  .min(10, "Content must be at least 10 characters long")
  .required("Content is required")
