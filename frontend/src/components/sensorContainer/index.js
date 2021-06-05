import React, { useState, useEffect } from 'react'
import MyButton from '../../common/button'
import MyLineChart from '../myLineChart'
import BarChart from '../barChart'
import alerts from '../../functions/alertController'
import api from '../../service/index'
import ColorPicker from '../../common/colorPicker'

export default function SensorContainer() {
  const [sensores, setSensores] = useState(null)
  const data = [
    { name: 'Jan', uv: 400, pv: 2000 },
    { name: 'Fev', uv: 600, pv: 2400 },
    { name: 'Mar', uv: 600, pv: 200 },
    { name: 'Apr', pv: 400 }
  ]
  const colors = ['blue', 'green']

  useEffect(() => {
    document.getElementsByClassName("loading")[0].style.display = "flex"
    setTimeout(async () => {
      try {
        const result = await api.get('/sensor/show/all', {
          headers: {
            user: localStorage.getItem('urbanVG-user')
          }
        })
        setSensores(result)
        document.getElementsByClassName("loading")[0].style.display = "none"
      } catch (error) {
        document.getElementsByClassName("loading")[0].style.display = "none"
        alerts.showAlert('Problema na conexão com o servidor!', 'Error', 'singup-alert')
      }
    }, 1000)
  }, [])

  return (
    <>
      <div className="sensor-container row-center">
        {/* <ColorPicker /> */}
        <div className='middle-container column-center'>
          {/* <MyLineChart data={data} colors={colors} /> */}
          <div className="sensor-background" />
          {sensores && sensores.data ? (
            <div className="chart-container row-center">
              {sensores.data.map((element, index) => {
                if (index < 3)
                  return <BarChart
                    key={element.nome}
                    value={element.feed[(element.ultimo_feed_id - 1)].valor}
                    name={element.nome}
                    percentage={((element.feed[(element.ultimo_feed_id - 1)].valor / Math.max.apply(Math, element.feed.map((obj) => obj.valor))) * 100).toFixed(2)}
                  />
                return <></>
              }
              )}
            </div>
          ) : (
            <h2 className="row-center">
              Você não tem nenhum sensor cadastrado {":("}
            </h2>
          )}

          <MyButton>
            Cadastre seu sensor
        </MyButton>
        </div>
        {sensores && sensores.data && (
          <div className="right-container">

          </div>
        )}
      </div>
    </>
  )
}