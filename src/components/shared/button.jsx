import React from "react";
import PropTypes from "prop-types";

const Button = ({
    label,
    onClick,
    onChange,
    variant = "solid",
    size = "md",
    disabled = false,
    icon: Icon,
    loading = false,
    type = "button",
}) => {
    const baseClass = `flex items-center justify-center rounded-md font-[600] text-xs transition duration-200 ease-in-out`;
    const sizeClass = {
        sm: "px-3 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-6 py-3 text-lg",
    }[size];

    const variantClass = {
        solid: "bg-[#0f5D30] text-white hover:bg-[#0a3e20]",
        delete: "bg-red text-white hover:bg-red",

        outline: "text-[#0f5D30] border border-[#0f5D30] hover:bg-[#f0f0f0]",
        transparent: "bg-transparent text-[#0f5D30] border border-green-600 hover:bg-green-50 hover:text-green-700",
    }[variant];

    return (
        <button
            onClick={onClick}
            onChange={onChange}
            disabled={disabled || loading}
            type={type}
            className={`${baseClass} ${sizeClass} ${variantClass} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {loading ? (
                <div className="flex gap-2">
                    <svg
                        className="animate-spin h-5 w-5 text-white mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                        ></path>
                    </svg>
                    <h3>Processing</h3>
                </div>

            ) : (
                <>
                    {Icon && <Icon className="mr-2" />}
                    {label}
                </>
            )}
        </button>
    );
};

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(["solid", "outline", "transparent", "delete"]),
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    disabled: PropTypes.bool,
    icon: PropTypes.elementType,
    loading: PropTypes.bool,  // Added loading prop validation
    type: PropTypes.oneOf(["button", "submit", "reset"]),  // Added type prop to specify form behavior
};

export default Button;
