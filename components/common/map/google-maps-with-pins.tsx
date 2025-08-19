'use client'

import { useEffect, useRef } from 'react'
import { useGoogleMaps } from './GoogleMapsLoader'

type Property = {
	lat: number
	lng: number
	title: string
}

const GoogleMapWithPins = ({ properties }: { properties: Property[] }) => {
	const { isLoaded } = useGoogleMaps()
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<google.maps.Map | null>(null)
	const markersRef = useRef<google.maps.Marker[]>([])

	useEffect(() => {
		if (!isLoaded || !mapRef.current) return

		// Clear existing markers
		markersRef.current.forEach(marker => marker.setMap(null))
		markersRef.current = []

		const center = { lat: 23.2599, lng: 77.4126 }

		// Create map if it doesn't exist
		if (!mapInstanceRef.current) {
			mapInstanceRef.current = new google.maps.Map(mapRef.current, {
				zoom: 3,
				center,
			})
		}

		// Add markers for each property
		properties.forEach(property => {
			const marker = new google.maps.Marker({
				position: { lat: property.lat, lng: property.lng },
				map: mapInstanceRef.current,
				title: property.title,
			})
			markersRef.current.push(marker)
		})

		// Auto-fit bounds if there are properties
		if (properties.length > 0) {
			const bounds = new google.maps.LatLngBounds()
			properties.forEach(property => {
				bounds.extend({ lat: property.lat, lng: property.lng })
			})
			mapInstanceRef.current?.fitBounds(bounds)
		}

		// Cleanup function
		return () => {
			markersRef.current.forEach(marker => marker.setMap(null))
			markersRef.current = []
		}
	}, [isLoaded, properties])

	if (!isLoaded) {
		return <div style={{ height: '500px', width: '100%' }}>Loading map...</div>
	}

	return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />
}

export default GoogleMapWithPins
