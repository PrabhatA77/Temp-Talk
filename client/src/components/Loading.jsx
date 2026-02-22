import React from 'react'

const Loading = ({text="Loading..."}) => {
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-[#091615]/90 backdrop-blur-sm z-50'>
        {/* spinner */}
        <div className='w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin'></div>

        {/* loading text */}
        <p className='mt-4 text-emerald-400 text-lg font-medium animate-pulse'>{text}</p>
    </div>
  )
}

export default Loading;