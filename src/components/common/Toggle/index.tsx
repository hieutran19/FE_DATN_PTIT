import React from 'react'

type Props = {
  title: string
  isToggled: boolean
  onToggle: () => void
}

const Toggle = ({ title, isToggled, onToggle }: Props) => {
  return (
    <div className="form-control">
      <label className="cursor-pointer label">
        <input type="checkbox" className="toggle toggle-primary" checked={isToggled} onClick={onToggle} />
        <span className="label-text ml-4">{title}</span>
      </label>
    </div>
  )
}

export default Toggle