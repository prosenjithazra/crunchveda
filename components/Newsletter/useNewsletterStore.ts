import { create } from "zustand";

interface NewsletterState {
  isSubmitting: boolean;
  isSuccess: boolean;
  errorMessage: string | null;
  setSubmitting: (submitting: boolean) => void;
  setSuccess: (success: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  reset: () => void;
}

export const useNewsletterStore = create<NewsletterState>((set) => ({
  isSubmitting: false,
  isSuccess: false,
  errorMessage: null,
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
  setSuccess: (success) => set({ isSuccess: success }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  reset: () => set({ isSubmitting: false, isSuccess: false, errorMessage: null }),
}));
