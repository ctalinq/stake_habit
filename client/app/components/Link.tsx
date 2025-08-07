import { Link as RouterLink } from "react-router";

interface IProps {
  className?: string;
  to: string;
  viewTransition?: boolean;
  children?: React.ReactNode;
}

const Link = ({ className, to, viewTransition, children }: IProps) => {
  const baseClassName =
    "px-2 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 shadow-md";

  return (
    <RouterLink
      className={`${baseClassName} ${className}`}
      viewTransition={viewTransition}
      to={to}
    >
      {children}
    </RouterLink>
  );
};

export default Link;
