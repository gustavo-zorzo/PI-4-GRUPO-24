function Button({ asChild, className = "", ...props }) {
  const Comp = asChild ? "span" : "button";
  return <Comp className={`px-4 py-2 rounded border ${className}`} {...props} />;
}
export { Button }; export default Button;
