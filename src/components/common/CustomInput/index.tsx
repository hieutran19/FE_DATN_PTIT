import { memo } from "react"

type Props = {
  type?: string
  name?: string
  label?: string
  placeholder?: string
  id?: string
  value?: string | number
  isError?: boolean
  isDisable?: boolean
  customClassName?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomInput = ({
  type = "text",
  label,
  placeholder,
  id,
  value,
  isError,
  isDisable,
  customClassName,
  onChange,
  name,
}: Props) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={`mb-2 block text-sm font-medium ${isError ? "text-red-600" : "text-slate-400"}`}>
          {label}
        </label>
      )}
      <input
        name={name}
        type={type}
        id={id}
        className={`${isError ? "border border-red-500 text-red-400 focus:outline-red-700" : " border border-slate-500 focus:border-primary-400"} block w-full rounded-lg bg-theme p-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus-visible:outline-none ${customClassName}`}
        placeholder={placeholder}
        disabled={isDisable}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  )
}

export default memo(CustomInput)
