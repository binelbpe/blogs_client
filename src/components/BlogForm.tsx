import { handleAPIError, getErrorMessage } from "@/utils/errorHandler";

// ... other imports

export default function BlogForm({ initialData, onSubmit }) {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    try {
      await onSubmit(formData);
    } catch (error) {
      const apiError = handleAPIError(error);
      if (apiError.errors) {
        setFormErrors(apiError.errors);
      } else {
        toast.error(apiError.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`form-input ${formErrors.title ? "border-red-500" : ""}`}
        />
        {formErrors.title && (
          <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
        )}
      </div>
      {/* ... rest of the form */}
    </form>
  );
}
