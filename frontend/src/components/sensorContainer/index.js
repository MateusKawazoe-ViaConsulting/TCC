import React, { useState, useEffect } from 'react'
import MyButton from '../../common/button'
import MyLineChart from '../myLineChart'
import BarChart from '../barChart'
import alerts from '../../functions/alertController'
import api from '../../service/index'
import dateFormat from 'dateformat'

export default function SensorContainer({ setForm, setImportForm, newSensor, setFullData, setFullChart, socket }) {
  const [sensores, setSensores] = useState([])
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState([])
  const [color, setColor] = useState("")
  const [clicked, setClicked] = useState("")
  const [loadContent, setLoadContent] = useState(false)
  const [request, setRequest] = useState(false)
  // const calendar = ["Jan", "Fev", "Mar", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

  async function dataGen() {
    if ((clicked || request) && !data[0]) {
      setRequest(false)

      try {
        const sensorData = await api.get('/sensor/show/one', {
          params: {
            dono: localStorage.getItem('urbanVG-user'),
            nome: clicked
          }
        })

        if (sensorData.data) {
          setColor(sensorData.data.cor)
          setFullData(sensorData.data)

          if (sensorData.data.feed[0]) {
            if (sensorData.data.feed.length > 5) {
              for (let i = 0; i < 5; i++) {
                let feedAux = sensorData.data.feed[(sensorData.data.feed.length - 5) + i];
                setData(prev => [
                  ...prev,
                  {
                    name: `${(new Date(feedAux.data).getDate()) > 9 ? (new Date(feedAux.data).getDate()) : "0" + (new Date(feedAux.data).getDate())}/${(new Date(feedAux.data).getMonth() + 1) > 9 ? (new Date(feedAux.data).getMonth()) : "0" + (new Date(feedAux.data).getMonth() + 1)}`,
                    valor: feedAux.valor
                  }
                ])
              }
            } else {
              sensorData.data.feed.map(element => {
                setData(prev => [
                  ...prev,
                  {
                    name: `${(new Date(element.data).getDate()) > 9 ? (new Date(element.data).getDate()) : "0" + (new Date(element.data).getDate())}/${(new Date(element.data).getMonth() + 1) > 9 ? (new Date(element.data).getMonth()) : "0" + (new Date(element.data).getMonth() + 1)}`,
                    valor: element.valor
                  }
                ])
              })
            }
          }
        }
      } catch (error) {
        alerts.showAlert('Problema na conexão com o servidor!', 'Error', 'singup-alert')
      }
      setTimeout(async () => {
        document.getElementsByClassName("loading")[0].style.display = "none"
        setVisible(true)
      }, 1300)
    }
  }

  function setListItem(e, chart = false) {
    while (document.getElementsByClassName('active')[0]) {
      document.getElementsByClassName('active')[0].classList.remove("active")
    }

    if (chart) {
      document.getElementById(e.currentTarget.childNodes[2].childNodes[2].textContent).classList.add("active")
    } else {
      e.currentTarget.classList.add("active")
    }
  }

  function generateBarChartData() {
    try {
      new Promise((resolve) => {
        resolve(api.get('/sensor/show/all', {
          headers: {
            user: localStorage.getItem('urbanVG-user')
          }
        }))
      }).then((result) => {
        if (!result.data[0])
          return

        setSensores(result.data)

        if (!clicked && result.data[0])
          setClicked(result.data[0].nome)


      }).catch(err => {
        console.log(err)
      })

    } catch (error) {
      alerts.showAlert('Problema na conexão com o servidor!', 'Error', 'singup-alert')
    }
  }

  useEffect(() => {
    document.getElementsByClassName("loading")[0].style.display = "flex"
    generateBarChartData()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("dataUpdate", req => {
        setData([])
        setRequest(true)
        dataGen()
        generateBarChartData()
      })

      return () => socket.disconnect()
    }
  }, [socket])

  useEffect(() => {
    if (clicked) {
      dataGen()
    }
  }, [clicked])

  useEffect(() => {
    if (document.getElementsByClassName('sensor-list-item-container')[0] && !loadContent) {
      document.getElementsByClassName('sensor-list-item-container')[0].classList.add("active")
      setLoadContent(true)
    }
  }, [document.getElementsByClassName('sensor-list-item-container')[0]])

  useEffect(() => {
    if (newSensor) {
      setSensores([
        ...sensores,
        newSensor
      ])
      generateBarChartData()
    }
  }, [newSensor])

  return (
    <>
      <div className="sensor-container row-center" style={{ opacity: visible ? 1 : 0 }}>
        <div className='middle-container column-center'>
          {sensores && sensores[0] ? (
            <div className="middle-content row-center">
              {sensores.map((element, index) => {
                if (index > 2) {
                  return <></>
                }

                return (
                  <div
                    className="chart-container row-center"
                    key={`chart-item${index}`}
                    onClick={e => {
                      if (document.getElementsByClassName('active')[0] && document.getElementsByClassName('active')[0].id !== e.currentTarget.childNodes[2].childNodes[2].textContent) {
                        setData([])
                        setListItem(e, true)
                        setClicked(e.currentTarget.childNodes[2].childNodes[2].textContent)
                      }
                    }}
                  >
                    <div className="background-transparent" />
                    <BarChart
                      key={element.nome}
                      value={element.feed[0] ? element.feed[(element.feed.length - 1)].valor : 0}
                      name={element.nome}
                      percentage={element.feed[0] ? Math.ceil((element.feed[(element.feed.length - 1)].valor / Math.max.apply(Math, element.feed.map((obj) => obj.valor))) * 100) : 0}
                      color={element.cor}
                    />
                  </div>
                )
              }
              )}
            </div>
          ) : (
            <></>
          )}
          <div className="row-center">
            <MyButton onClick={() => { setForm(true) }}>
              New Sensor
            </MyButton>
            <MyButton onClick={() => { setImportForm(true) }}>
              Import a sensor
            </MyButton>
          </div>
        </div>

        <ul className="right-container column-center">
          <li className="top-container column-center">
            <div className="sensor-list-container column-center">
              {sensores && sensores[0] ? (
                <>
                  <input type="text" className="text-small search-bar" placeholder={"Search sensor by name or type..."} />
                  <div className="sensor-list">
                    {sensores.map((element, index) => (
                      <ul
                        className="text-regular column-center sensor-list-item-container"
                        key={`sensor-list-item${index}`}
                        onClick={e => {
                          if (document.getElementsByClassName('active')[0] && document.getElementsByClassName('active')[0].id && document.getElementsByClassName('active')[0].id !== e.currentTarget.childNodes[0].childNodes[0].childNodes[1].textContent) {
                            setData([])
                            setListItem(e)
                            setClicked(e.currentTarget.childNodes[0].childNodes[0].childNodes[1].textContent)
                          }
                        }}
                        id={element.nome}
                      >
                        <li className="item-container">
                          <p>
                            <span>Name: </span>
                            {element.nome}
                          </p>
                        </li>
                        <li className="item-container">
                          <p>
                            <span>Type: </span>
                            {element.tipo}
                          </p>
                        </li>
                        {element.feed[0] && (
                          <>
                            <li className="item-container">
                              <p>Current value: {element.feed[(element.feed.length - 1)].valor}</p>
                            </li>
                            <li className="item-container">
                              <p>Last update: {dateFormat(element.feed[(element.feed.length - 1)].data, "dd/mm/yyyy  - HH:MM")}</p>
                            </li>
                          </>
                        )}
                      </ul>
                    ))}
                  </div>
                </>
              ) : (
                <p>You don't have registered sensors {":("}</p>
              )}
            </div>
          </li>
          {sensores && sensores[0] && (
            <li className="bottom-container column-center">
              <MyLineChart data={data} setDisplay={setFullChart} color={color} keyName={"valor"} className={"my-chart"} clicable width={350} height={320} />
            </li>
          )}
        </ul>
      </div>
    </>
  )
}