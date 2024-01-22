import { Helmet } from 'react-helmet-async'

import { Map } from '@/components/map'

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />

      <div>
        <Map />
      </div>
    </>
  )
}
