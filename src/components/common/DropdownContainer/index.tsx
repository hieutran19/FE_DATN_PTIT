import ChevronIcon from '@components/icons/ChevronIcon'
import clsx from 'clsx'
import React, { useState } from 'react'
import CustomButton from '../CustomButton'

type Props = {
  contents: string[]
  label: string
  isHover?: boolean
}

const DropdownContainer = ({ contents, label, isHover = false }: Props) => {
  return (
    <div className={clsx('dropdown', isHover ? 'dropdown-hover' : 'dropdown-start')}>
      <CustomButton label="Dropdown" />
      <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        {contents?.map(content => (
          <li><a>{content}</a></li>
        ))}
      </ul>
    </div>
  )
}

export default DropdownContainer