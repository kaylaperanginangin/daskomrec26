import { useState } from 'react'
import button from '@assets/buttons/01-Button.png'

export default function ButtonSidebar({ onClick }) {
    const [pressed, setPressed] = useState(false)

    return (
        <button
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            onClick={onClick}
            className="relative focus:outline-none"
        >
            <img
                src={button}
                alt="Menu Button"
                className={`
                    h-20 md:h-30 w-auto
                    ${pressed ? 'scale-90 brightness-110' : 'scale-100'}
                `}
                style={{
                    filter: pressed
                        ? 'drop-shadow(0 0 14px rgba(0,180,255,.9))'
                        : 'drop-shadow(0 0 8px rgba(0,120,200,.6))',
                }}
            />
        </button>
    )
}