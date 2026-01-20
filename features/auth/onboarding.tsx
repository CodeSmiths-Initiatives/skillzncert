"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/toast/ToastContext";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BiSolidImageAdd } from "react-icons/bi";
import { submitEnrollmentAction } from "@/actions/enrollment/create-enrollment.actions";

export default function Onboarding() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [passport, setPassport] = useState<File | null>(null);
  const [schoolId, setSchoolId] = useState<File | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    state: "",
    country: "",
    preferredLanguage: "",
    currentEducationLevel: "",
    previousCertification: "",
    universityAttending: "",
    hasNetacadAccount: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!passport || !schoolId) {
      showToast({
        type: "error",
        title: "Documents required",
        description: "Please upload passport and school ID.",
      });
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) =>
      data.append(`data[${k}]`, String(v))
    );
    data.append("files.passport", passport);
    data.append("files.schoolIdCard", schoolId);

    startTransition(async () => {
      console.log(data);
      
      const res = await submitEnrollmentAction(data);

      if (!res.success) {
        showToast({
          type: "error",
          title: "Submission failed",
          description: res.message,
        });
        return;
      }

      router.push("/payment");
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f5fbfc]">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-[#51A8B1] to-[#3b8f97] text-white">
        <h1 className="text-4xl font-bold mb-4">
          Enrollment Application
        </h1>
        <p className="text-lg text-white/90 max-w-md">
          Complete your enrollment to begin your certification journey.
          This process takes only a few minutes.
        </p>

        <div className="mt-10 space-y-4 text-sm text-white/80">
          <p>✔ Secure & confidential</p>
          <p>✔ Reviewed by our team</p>
          <p>✔ One-time submission</p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Personal & Academic Details
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Fields marked * are required
          </p>

          <form onSubmit={submit} className="space-y-8">
            <TwoCol>
              <Input name="firstName" placeholder="First Name *" onChange={handleChange} />
              <Input name="lastName" placeholder="Last Name *" onChange={handleChange} />
              <Input name="phoneNumber" placeholder="Phone Number *" onChange={handleChange} />
              <Input name="address" placeholder="Address *" onChange={handleChange} />
            </TwoCol>

            <TwoCol>
              <select name="state" className="input-field" onChange={handleChange}>
                <option value="">Select State *</option>
                <option value="Delhi">Delhi</option>
                <option value="Lagos">Lagos</option>
              </select>
              <select name="country" className="input-field" onChange={handleChange}>
                <option value="">Select Country *</option>
                <option value="India">India</option>
                <option value="Nigeria">Nigeria</option>
              </select>
            </TwoCol>

            <TwoCol>
              <Input name="preferredLanguage" placeholder="Preferred Language" onChange={handleChange} />
              <Input name="currentEducationLevel" placeholder="Education Level" onChange={handleChange} />
              <Input name="previousCertification" placeholder="Previous Certification" onChange={handleChange} />
              <Input name="universityAttending" placeholder="University" onChange={handleChange} />
            </TwoCol>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload label="Passport *" onSelect={setPassport} />
              <FileUpload label="School ID Card *" onSelect={setSchoolId} />
            </div>

            <Button
              disabled={isPending}
              className="w-full bg-[#51A8B1] py-6 text-base font-semibold hover:bg-teal-600"
            >
              {isPending ? "Submitting..." : "Continue to Payment"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function TwoCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  );
}

function FileUpload({
  label,
  onSelect,
}: {
  label: string;
  onSelect: (file: File) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="border-2 border-dashed rounded-xl p-6 text-center mt-2 hover:border-[#51A8B1] transition">
        <BiSolidImageAdd className="text-5xl text-gray-300 mx-auto mb-3" />
        <Input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => {
            if (e.target.files?.[0]) onSelect(e.target.files[0]);
          }}
        />
        <p className="text-xs text-gray-500 mt-2">
          JPG / PNG • Max 50KB
        </p>
      </div>
    </div>
  );
}
