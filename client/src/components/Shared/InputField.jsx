const InputField = ({ label, type = 'text', value, onChange, placeholder, required }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-blue-800">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          w-full px-4 py-2.5
          border-2 border-blue-100
          rounded-xl text-sm
          text-blue-900
          placeholder-blue-300
          bg-blue-50
          focus:outline-none
          focus:border-blue-400
          focus:bg-white
          transition-all duration-200
        "
      />
    </div>
  );
};

export default InputField;