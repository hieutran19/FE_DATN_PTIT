import React, { useId } from 'react'

type Props = {
  isChecked: boolean
  handleSelectRadio?: () => void
}

const Radio = ({ isChecked, handleSelectRadio }: Props) => {
  const radioId = useId()
  return (
    <input type="radio" name={`radio-${radioId}`} className="radio radio-primary" checked={isChecked} onClick={handleSelectRadio} />
  )
}

export default Radio