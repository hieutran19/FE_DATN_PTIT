import React from 'react'

type Props = {
  title: string
  content: string
}

const Collapse = ({ title, content }: Props) => {
  return (
    <div className="collapse collapse-arrow border bg-primary-400 text-slate-300">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        {title}
      </div>
      <div className="collapse-content">
        <p>{content}</p>
      </div>
    </div>
  )
}

export default Collapse