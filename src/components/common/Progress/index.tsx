import React from 'react'

type Props = {
  value: number
}

const Progress = ({ value }: Props) => {
  return (
    <progress className="progress progress-primary w-56" value={value} max="100"></progress>
  )
}

export default Progress