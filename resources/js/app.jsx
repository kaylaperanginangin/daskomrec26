import './bootstrap';
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { SoundProvider } from '@components/SoundProvider'
import MuteButton from '@components/MuteButton'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        return pages[`./Pages/${name}.jsx`]
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <SoundProvider>
                <App {...props} />
                <MuteButton/>
            </SoundProvider>
        )
    },
    title: (title) => title ? `${title} - DLOR 2026` : 'DLOR 2026',
})
