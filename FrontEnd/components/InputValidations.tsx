import * as yup from 'yup';

// Define the schema for email and password validation
const validationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Invalid email format.'
    ),
  password: yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Password must be at least 8 characters long, include uppercase and lowercase letters, one number, and one special character.'
    ),
});

// Function to validate email and password
export const validateCredentials = async (email: string, password: string) => {
  try {
    await validationSchema.validate({ email, password }, { abortEarly: false });
    return { isValid: true, messages: [] }; // No errors, validation passed
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const messages = error.inner.map(err => ({ path: err.path, message: err.message }));
      return { isValid: false, messages }; // Return all validation errors
    }
    return { isValid: false, messages: ['An unexpected error occurred.'] }; // Handle unexpected errors
  }
};
