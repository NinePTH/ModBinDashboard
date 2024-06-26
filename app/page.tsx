import Navbar from '@/app/components/navigation/navbar'
import MapboxMap from './components/map'

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center bg-white ">
      <Navbar/>
      <div className="h-screen w-screen">
        <MapboxMap />
      </div>


    </main>
  )
}
