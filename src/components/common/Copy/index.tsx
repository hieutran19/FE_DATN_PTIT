import copy from 'copy-to-clipboard';
import React, { memo, useState } from 'react'
import Icon from '@components/icons';

type Props = {
  text: string
}

const Copy = ({ text }: Props) => {
  const [isCopy, setIsCopy] = useState<boolean>(false)

  const handleCopy = () => {
    copy(text)
    setIsCopy(true)
  }

  return (
    <div className="flex gap-1 cursor-pointer text-gray-400 hover:text-white" onClick={handleCopy}>
      <span>{text}</span>
      <Icon name="copy-check" className={`${isCopy ? 'block' : 'hidden'}`} />
      <Icon name="copy" className={`${isCopy ? 'hidden' : 'block'}`} />
    </div>
  )
}

export default memo(Copy)