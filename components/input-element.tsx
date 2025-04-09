import React from "react";

export function InputElement({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <label className="w-full text-lg" htmlFor={name}>
        {label}
      </label>
      <input
        className="border col-span-3 w-full border-black-100 rounded-sm p-1 "
        type={type}
        id={name}
        name={name}
        required={required}
      />
    </div>
  );
}
