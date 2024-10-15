import React from 'react'

type Props = {
  label: string
  isChecked: boolean
  onClick?: () => void
}

const CheckBox = ({ label, isChecked = false, onClick }: Props) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <input type="checkbox" checked={isChecked} className="checkbox checkbox-primary" onClick={onClick} />
        <span className="label-text mx-2 text-slate-400">{label}</span>
      </label>
    </div>
  )
}

export default CheckBox