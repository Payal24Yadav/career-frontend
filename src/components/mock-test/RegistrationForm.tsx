"use client";

import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { MapPin, Mail, Phone, Send, User } from "lucide-react";
import toast from "react-hot-toast";
import { createMockTestRegistrationAPI } from "@/services/api";

type RegistrationFormProps = {
  examTitle: string;
  examSlug: string;
};

export default function RegistrationForm({ examTitle, examSlug }: RegistrationFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading("Submitting registration...");

    try {
      await createMockTestRegistrationAPI({ ...formData, examTitle, examSlug });
      toast.success("Registration received! Our team will contact you soon.", { id: toastId });
      setFormData({ fullName: "", email: "", phone: "", location: "" });
      if (typeof window !== "undefined") {
        sessionStorage.setItem("mockTestUser", JSON.stringify({
          userName: formData.fullName,
          email: formData.email,
          examSlug,
        }));
      }
      router.push(`/mock-tests/start/${examSlug}`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Failed to submit registration", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="mock-test-registration" className="bg-white border border-gray-100 rounded-[2rem] shadow-sm mb-8 overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-primary/10 via-white to-accent/10">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-white/80 border border-primary/10 rounded-full px-3 py-1">
          Exam Registration
        </span>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-navy">Register for {examTitle}</h2>
        <p className="mt-2 text-sm text-gray-600 max-w-2xl">
          Share your details to receive mock test access, prep updates, and guidance for this exam.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field icon={User} label="Full Name">
          <input
            required
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy"
            placeholder="Your full name"
          />
        </Field>

        <Field icon={Mail} label="Email">
          <input
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy"
            placeholder="you@example.com"
          />
        </Field>

        <Field icon={Phone} label="Phone">
          <input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy"
            placeholder="+91 98765 43210"
          />
        </Field>

        <Field icon={MapPin} label="Location">
          <input
            required
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy"
            placeholder="City, State"
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="md:col-span-2 mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-70 text-white rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all shadow-md shadow-primary/20"
        >
          {submitting ? "Submitting..." : "Submit Registration"}
          {!submitting && <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") return "";
  const response = "response" in error ? error.response : undefined;
  if (!response || typeof response !== "object") return "";
  const data = "data" in response ? response.data : undefined;
  if (!data || typeof data !== "object") return "";
  const message = "message" in data ? data.message : undefined;
  return typeof message === "string" ? message : "";
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{label}</span>
      <span className="relative block">
        <Icon className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        {children}
      </span>
    </label>
  );
}
