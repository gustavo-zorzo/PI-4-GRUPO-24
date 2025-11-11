function Card({ className = "", ...props }) { return <div className={`rounded border p-4 ${className}`} {...props} />; }
function CardHeader({ className = "", ...props }) { return <div className={`mb-2 ${className}`} {...props} />; }
function CardTitle({ className = "", ...props }) { return <h3 className={`font-semibold text-lg ${className}`} {...props} />; }
function CardContent({ className = "", ...props }) { return <div className={`${className}`} {...props} />; }
function CardFooter({ className = "", ...props }) { return <div className={`mt-2 ${className}`} {...props} />; }
export { Card, CardHeader, CardTitle, CardContent, CardFooter }; export default Card;
