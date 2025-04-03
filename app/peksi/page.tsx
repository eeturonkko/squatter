"use client";

import Confetti from "react-confetti";
import Image from "next/image";

export default function SecretPeksipage() {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Confetti */}
      <Confetti width={2000} height={1000} />

      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 space-y-6">
        <h2 className="text-3xl font-bold text-center">
          You just found Peksi! Lucky you.
        </h2>
        <Image
          src="/squatbear.png"
          alt="Peksi"
          width={500}
          height={500}
          className="rounded-xl shadow-lg"
          priority
        />
      </div>
    </div>
  );
}
