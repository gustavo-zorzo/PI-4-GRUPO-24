function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`border rounded px-3 py-2 w-full ${className}`}
      {...props}
    />
  );
}

export { Textarea };
export default Textarea;
