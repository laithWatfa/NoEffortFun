import React from 'react'
import { ImInstagram } from 'react-icons/im'

const Footer = () => {
  return (
    <div className='flex justify-between items-center
                    px-8 py-4 border-t border-t-ink-soft 
                    text-ink-soft font-bold'>
            By Laith Watfa 
            <a><ImInstagram/></a>
    </div>
  )
}

export default Footer