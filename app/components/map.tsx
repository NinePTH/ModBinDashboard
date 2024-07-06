"use client"

import * as React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import binMarker from "../../public/binMarker.png";
import truckMarker from "../../public/truckMarker.png";

interface BinStat {
  id: number;
  name: string;
  recycle: number;
  general: number;
  wet: number;
  danger: number;
  latitude: number;
  longitude: number;
  empty: boolean;
  status: boolean;
}

function MapboxMap() {
  const mapNode = React.useRef<HTMLDivElement>(null);
  const [bins, setBins] = React.useState<BinStat[]>([]);

  React.useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await fetch("https://bodmin-exrtqap6lq-uc.a.run.app/api/home");
        const result = await response.json();
        setBins(result.data);
        console.log(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBins();

    const node = mapNode.current;
    if (typeof window === "undefined" || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [100.61125277141514, 13.685317408394551],
      zoom: 14,
    });

    return () => {
      mapboxMap.remove();
    };
  }, []);

  React.useEffect(() => {
    if (bins.length === 0) return;

    const node = mapNode.current;
    if (typeof window === "undefined" || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [100.61125277141514, 13.685317408394551],
      zoom: 14,
    });

    bins.forEach((bin: BinStat) => {
      const popupContent = `
        <div class='w-64 h-fit bg-white rounded-xl shadow-2xl text-center p-5'>
          <h1 class='text-[#fd8d14] font-bold text-lg'>${bin.name}</h1>
            <div class='flex flex-col gap-2 my-3 px-6'>
              <div class='flex justify-between'>
                <p class='text-sm'>ขยะรีไซเคิล</p>
                <div class='text-sm font-bold bg-[#ffde00] w-10 rounded-2xl'>${bin.recycle}</div>
              </div>
              <div class='flex justify-between'>
                <p class='text-sm'>ขยะทั่วไป</p>
                <div class='text-sm font-bold bg-[#155bec] w-10 rounded-2xl'>${bin.general}</div>
              </div>
              <div class='flex justify-between'>
                <p class='text-sm'>ขยะเปียก</p>
                <div class='text-sm font-bold bg-[#5b9e57] w-10 rounded-2xl'>${bin.wet}</div>
              </div>
              <div class='flex justify-between'>
                <p class='text-sm'>ขยะอันตราย</p>
                <div class='text-sm font-bold bg-[#ec4d5a] w-10 rounded-2xl'>${bin.danger}</div>
              </div>
            </div>
          <div class='text-sm font-bold'>
            สถานะถังขยะ:
            ${!bin.status && bin.empty ? `<span class='text-red-500'>ถังยังไม่เต็ม (ยังไม่ถูกเก็บ)</span>` : 
              bin.status && bin.empty ? `<span class='text-green-500'>ยังไม่เต็ม (ถูกเก็บแล้ว)</span>` : 
              `<span class='text-red-500'>ถังขยะเต็ม</span>`
            }
          </div>
        </div>
      `;

      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.width = '40px';
      markerElement.style.height = '40px';
      markerElement.style.backgroundImage = `url(${binMarker.src})`;
      markerElement.style.backgroundSize = 'cover';

      new mapboxgl.Marker({ element: markerElement })
        .setLngLat([bin.longitude, bin.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(mapboxMap);
    });

    return () => {
      mapboxMap.remove();
    };
  }, [bins]);

  return <div ref={mapNode} style={{ width: "100%", height: "100%" }} />;
}

export default MapboxMap;
