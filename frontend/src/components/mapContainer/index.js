import React, { useState, useEffect, Component } from 'react'
import GoogleMapReact from 'google-map-react'
import crop from '../../lib/assets/header/crop.png'
import api from '../../service/index'

const Marker = () => {
  return (
    <div className= "marker"> <img src={crop} alt="crop" /></div>
  )
}

export default function MapContainer(history) {
  const [allCrops, setAllCrops] = useState(null)
  const [localization, setLocalization] = useState({
    lat: '',
    lng: ''
  })

  async function dataGen() {
		try {
			var result = await api.get('/user/show/one', {
				headers: {
					usuario: localStorage.getItem('urbanVG-user')
				}
			})
      setLocalization({lat: result.data.localizacao.latitude, lng: result.data.localizacao.longitude})
      result = await api.get('/crop/show/all')
			setAllCrops(result.data)
		} catch (error) {

		}
	}

  useEffect(() => {
		dataGen()
	}, [])

  function onMarkerClicked(key) {
    console.log(key)
  }

  return (
    <div className = "column-center map-container">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_KEY }}
        center={localization}
        defaultZoom={15}
        onChildClick={onMarkerClicked}
      >
      { allCrops && allCrops[0] ? (
        allCrops.map((element, index) => {
          return (
            <Marker
                lat={allCrops[index].localizacao.latitude}
                lng={allCrops[index].localizacao.longitude}
                key={allCrops[index]._id}
            />
          )
        })): (<> </>)
    }
      </GoogleMapReact>
    </div>
  )
}
