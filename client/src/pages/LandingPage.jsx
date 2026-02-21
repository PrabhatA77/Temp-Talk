import React from 'react';
import convo from "../assets/convo.png"
import react from "../assets/react.png"
import node from "../assets/node.png"
import mongo from "../assets/mongo.png"
import bolt from "../assets/bolt.png"
import padlock from "../assets/padlock.png"
import theme from "../assets/theme.png"

const LandingPage = () => {
  return (
    <div className='bg-linear-to-b from-[#1F5731] to-[#091615]
 min-h-screen text-white'>
        <nav className='bg-[#0d1412] flex justify-between items-center px-8 h-16 border-b border-gray-800'>

            <div className='flex items-center gap-0'>
                <div className='relative flex items-center justify-center'>
                    <div className='absolute w-14 h-14 bg-emerald-400 rounded-full blur-2xl opacity-30'></div>
                    <img src="/logo.png" className='w-10 h-10'/>
                </div>
                <strong className='text-lg tracking-wide'>Temp Talk</strong>
            </div>

            <div className='flex items-center gap-8 text-sm font-medium'>
                <div className='hover:text-emerald-400 transition cursor-pointer'>Features</div>
                <div className='hover:text-emerald-400 transition cursor-pointer'>Pricing</div>
                <div className='hover:text-emerald-400 transition cursor-pointer'>About</div>
            </div>

            <div className='flex items-center gap-4 text-sm'>
                <div className='hover:text-emerald-400 transition cursor-pointer'>Login</div>
                <div className='bg-emerald-500 px-5 py-2 rounded-md hover:bg-emerald-600 transition shadow shadow-emerald-500/30 cursor-pointer'>Get Started</div>
            </div>
        </nav>

        {/* main section */}

        <div className='flex justify-around items-center '>
            {/* left section */}
            <div className=' flex flex-col gap-6 justify-center w-2xl items-start'>
                <div>
                <h1 className='text-3xl md:text-5xl font-bold'>Connect Instantly.</h1>
                <h1 className='text-3xl md:text-5xl font-bold text-emerald-400 '>Chat Securely.</h1>
                </div>
                <p className='wrap-break-word'>Experience the next generation of real-time communication.Built with the MERN stack for speed,reliablity and security that scales with you.</p>
                <button className='bg-emerald-500 px-5 py-2 rounded-md hover:bg-emerald-600 transition shadow shadow-emerald-500/30 cursor-pointer '>Start Chatting</button>

                {/* line */}
                <div className="w-full h-px bg-gray-400"></div>

                <div className='flex flex-col gap-3'>
                    <p className='text-gray-300'>POWERED BY MODERN TECH</p>
                    <div className='flex gap-5'>
                        <div className='flex gap-2'>
                            <img src={react} alt="" className='h-6 hover:drop-shadow-[0_0_10px_rgba(16,185,129,1)]
      transition-all
      duration-500
      ease-out'/>
                            <a href="https://react.dev/"><p className='text-gray-300'>REACT</p></a>
                        </div>
                        <div className='flex gap-2'>
                            <img src={node} alt="" className='h-6 hover:drop-shadow-[0_0_10px_rgba(16,185,129,1)]
      transition-all
      duration-500
      ease-out'/>
                            <a href="https://nodejs.org/en"><p className='text-gray-300'>NODE</p></a>
                        </div>
                        <div className='flex gap-2'>
                            <img src={mongo} alt="" className='h-6 hover:drop-shadow-[0_0_10px_rgba(16,185,129,1)]
      transition-all
      duration-500
      ease-out'/>
                            <a href="https://www.mongodb.com/"><p className='text-gray-300'>MONGO</p></a>
                        </div>
                    </div>
                </div>

            </div>

            {/* right section */}
            <div className=''>
                <img src={convo} alt="" className="
      h-120
      rotate-0
      drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]
      hover:rotate-3
      hover:drop-shadow-[0_0_35px_rgba(16,185,129,1)]
      transition-all
      duration-500
      ease-out
    "/>
            </div>
        </div>

        {/* mid footer */}
        <div className='p-3 flex gap-3 justify-around items-center mt-10'>

            <div className='p-3 flex flex-col h-40 rounded-2xl gap-3 bg-[#0d1412] hover:drop-shadow-[0_0_5px_rgba(16,185,129,1)]
      transition-all
      duration-500
      ease-out'>
                <div className='flex gap-2'>
                    <img src={bolt} alt="bolt" className='p-1 h-8 rounded-full bg-emerald-200'/>
                    <p className='font-semibold text-2xl'>Real-Time Sync</p>
                </div>
                <div className='text-gray-400'>Instant message delivery across all your devices without delay using WebSockets.</div>
            </div>

            <div className='p-3 flex flex-col h-40 rounded-2xl gap-3 bg-[#0d1412] hover:drop-shadow-[0_0_5px_rgba(16,185,129,1)]
      transition-all
      duration-500
      ease-out'>
                <div className='flex gap-2'>
                    <img src={padlock} alt="padlock"  className='p-1 h-8 rounded-full bg-emerald-200'/>
                    <h3 className='font-semibold text-2xl'>End-To-End Encryption</h3>
                </div>
                <div className='text-gray-400'>Your conversations are private and secure by default.We can't read your messages.</div>
            </div>

            <div className='p-3 flex flex-col h-40 rounded-2xl gap-3 bg-[#0d1412] hover:drop-shadow-[0_0_5px_rgba(16,185,129,1)]
      transition-all
      duration-500
      ease-out'>
                <div className='flex gap-2'>
                    <img src={theme} alt="theme" className='p-1 h-8 rounded-full bg-emerald-200' />
                    <h3 className='font-semibold text-2xl'>Custom Themes</h3>
                </div>
                <div className='text-gray-400'>Personlize your chat experience with deep dark mode and vibrant emerald accent colors.</div>
            </div>

        </div>
    </div>
  )
}

export default LandingPage