interface APIError {
  status: string;
  message: string;
  errors?: Record<string, string>;
}

export const handleAPIError = (error: any): APIError => {
  if (error.response?.data) {
    return {
      status: error.response.data.status || "error",
      message: error.response.data.message || "Something went wrong",
      errors: error.response.data.errors,
    };
  }

  if (error.request) {
    return {
      status: "error",
      message:
        "No response from server. Please check your internet connection.",
    };
  }

  return {
    status: "error",
    message: error.message || "An unexpected error occurred",
  };
};

export const getErrorMessage = (error: APIError, field?: string): string => {
  if (field && error.errors?.[field]) {
    return error.errors[field];
  }
  return error.message;
};
