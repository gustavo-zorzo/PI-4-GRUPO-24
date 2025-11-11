import { useState } from "react";

function Switch({ checked, onCheckedChange, className = "", ...props }) {
  const [on, setOn] = useState(!!checked);
  const toggle = () => {
    const v = !on;
    setOn(v);
    onCheckedChange?.(v);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center w-12 h-6 rounded-full border px-1 ${className}`}
      {...props}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white transition-transform ${
          on ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export { Switch };
export default Switch;
