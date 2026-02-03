import { useState } from 'react'
import button from '@assets/buttons/02-Home.png'

export default function ButtonHome({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="relative focus:outline-none"
        >
            <img
                src={button}
                alt="Menu Button"
                className={`
                    h-20 md:h-30 w-auto
                    active:scale-90
                `}
            />
        </button>
    )
}
