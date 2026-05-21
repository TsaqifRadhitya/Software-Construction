import React from 'react';

const Input = React.forwardRef(({
    type = 'text',
    className = '',
    icon: Icon,
    ...props
}, ref) => {
    return (
        <div className="relative">
            {Icon && (
                <div className="absolute left-3.5 top-3.5 text-slate-400">
                    <Icon size={20} />
                </div>
            )}
            <input
                type={type}
                ref={ref}
                className={`w-full bg-slate-900/50 border border-slate-700 text-white ${Icon ? 'pl-11' : 'px-4'} py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-500 ${className}`}
                {...props}
            />
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
