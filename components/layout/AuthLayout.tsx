import Image from "next/image";

type AuthLayoutProps = {
  children: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
};

export function AuthLayout({
  children,
  imageSrc,
  imageAlt = "Auth illustration",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* LEFT: FORM */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* RIGHT: IMAGE */}
      <div className="relative hidden md:block">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
