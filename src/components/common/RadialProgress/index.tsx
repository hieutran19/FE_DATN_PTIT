import React from 'react'

type Props = {
  value: number
}

interface CustomCSSProperties {
  '--value'?: number;
}


export const RadialProgress = ({ value }: Props) => {
  const customStyle: CustomCSSProperties = { '--value': value };

  return (
    <div className="radial-progress text-primary-400" style={customStyle as any} role="progressbar">{value}%</div>
  )
}
