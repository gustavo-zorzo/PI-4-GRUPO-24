function Badge({ className = "", ...props }) {
  return <span className={`inline-block text-xs px-2 py-1 rounded bg-gray-200 ${className}`} {...props} />;
}
export { Badge }; export default Badge;
