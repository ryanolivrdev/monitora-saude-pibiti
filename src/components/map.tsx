import GoogleMapReact from 'google-map-react'
import { ClipboardPen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Loading } from './loading'
import { ReportSymptoms } from './report-symptoms'
import { Button } from './ui/button'
import { Dialog, DialogTrigger } from './ui/dialog'

const defaultProps = {
  center: {
    lat: -1.4572894,
    lng: -48.482959,
  },
  zoom: 18,
}

const UserPin = () => (
  <div className="rounded-full bg-blue-500 p-2 text-white shadow"></div>
)

export function Map() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast(
            'Esse app precisa da sua localização para funcionar corretamente.',
          )

          const { latitude, longitude } = position.coords

          setUserLocation({ latitude, longitude })
        },

        () => {
          setTimeout(() => {
            toast(
              'Esse app precisa da sua localização para funcionar corretamente.',
            )
            getUserLocation()
          }, 5000)
        },
      )
    } else {
      toast.error('Geolocation não é suportado por este navegador', {
        description: 'Por favor, utilize outro navegador',
      })
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getUserLocation()
    }, 5000)

    return () => {
      clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return userLocation ? (
    <div style={{ height: '93.2vh', width: '100%' }} className="absolute">
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
        defaultCenter={{
          lat: userLocation.latitude,
          lng: userLocation.longitude,
        }}
        defaultZoom={defaultProps.zoom}
      >
        <UserPin lat={userLocation.latitude} lng={userLocation.longitude} />
      </GoogleMapReact>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="absolute bottom-10 right-16 gap-1"
            onClick={getUserLocation}
          >
            <ClipboardPen className="h-5 w-5" />
            Reportar sintomas
          </Button>
        </DialogTrigger>
        <ReportSymptoms />
      </Dialog>
    </div>
  ) : (
    <Loading fullScreen={false} />
  )
}
