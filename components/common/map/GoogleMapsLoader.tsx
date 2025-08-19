'use client'

import Script from 'next/script'
import { createContext, useContext, ReactNode, useState } from 'react'

interface GoogleMapsContextType {
	isLoaded: boolean
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({ isLoaded: false })

export const useGoogleMaps = () => useContext(GoogleMapsContext)

interface GoogleMapsProviderProps {
	children: ReactNode
}

export const GoogleMapsProvider = ({ children }: GoogleMapsProviderProps) => {
	const [isLoaded, setIsLoaded] = useState(false)

	return (
		<GoogleMapsContext.Provider value={{ isLoaded }}>
			<Script
				src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAQReifXIyF27pAqVclaTJDkboN1NCwZvI"
				strategy="lazyOnload"
				onLoad={() => setIsLoaded(true)}
				onError={() => console.error('Failed to load Google Maps API')}
			/>
			{children}
		</GoogleMapsContext.Provider>
	)
}
