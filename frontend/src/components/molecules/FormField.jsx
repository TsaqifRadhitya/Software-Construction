import React from 'react';
import Input from '../atoms/Input';

const FormField = React.forwardRef(({
    label,
    error,
    type = 'text',
    className = '',
    icon,
    required,
    ...props
}, ref) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-300">
                    {label} {required && <span className="text-rose-500">*</span>}
                </label>
            )}
            <Input
                type={type}
                ref={ref}
                icon={icon}
                required={required}
                {...props}
            />
            {error && (
                <p className="text-xs text-rose-400 mt-1">{error}</p>
            )}
        </div>
    );
});

FormField.displayName = 'FormField';

export default FormField;
