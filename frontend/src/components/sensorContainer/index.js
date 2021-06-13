import React, { useState, useEffect } from 'react'
import MyButton from '../../common/button'
import MyLineChart from '../myLineChart'
import BarChart from '../barChart'
import alerts from '../../functions/alertController'
import api from '../../service/index'
import dateFormat from 'dateformat'

export default function SensorContainer() {
  const [sensores, setSensores] = useState(null)
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState([])
  const [color, setColor] = useState("")
  const [clicked, setClicked] = useState("")
  const [loadContent, setLoadContent] = useState(false)
  // const calendar = ["Jan", "Fev", "Mar", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

  async function dataGen() {
    if (clicked && !data[0]) {
      try {
        const sensorData = await api.get('/sensor/show/one', {
          headers: {
            dono: localStorage.getItem('urbanVG-user'),
            nome: clicked
          }
        })

        if (sensorData.data) {
          setColor(sensorData.data.cor)

          sensorData.data.feed.map((values) => {
            setData(prev => [
              ...prev,
              {
                name: `${(new Date(values.data).getDate()) > 9 ? (new Date(values.data).getDate()) : "0" + (new Date(values.data).getDay())}/${(new Date(values.data).getMonth() + 1) > 9 ? (new Date(values.data).getMonth()) : "0" + (new Date(values.data).getMonth() + 1)}`,
                valor: values.valor
              }
            ])
          })
        }
      } catch (error) {
        alerts.showAlert('Problema na conexão com o servidor!', 'Error', 'singup-alert')
      }
    }
  }

  function setListItem(e, chart = false) {
    console.log()
    while (document.getElementsByClassName('active')[0]) {
      document.getElementsByClassName('active')[0].classList.remove("active")
    }

    if (chart) {
      document.getElementById(e.currentTarget.childNodes[2].childNodes[2].textContent).classList.add("active")
    } else {
      e.currentTarget.classList.add("active")
    }
  }

  useEffect(() => {
    document.getElementsByClassName("loading")[0].style.display = "flex"

    setTimeout(async () => {
      try {
        new Promise((resolve) => {
          resolve(api.get('/sensor/show/all', {
            headers: {
              user: localStorage.getItem('urbanVG-user')
            }
          }))
        }).then((result) => {
          setSensores(result)

          if (!clicked)
            setClicked(result.data[2].nome)
        })
      } catch (error) {
        alerts.showAlert('Problema na conexão com o servidor!', 'Error', 'singup-alert')
      }
      document.getElementsByClassName("loading")[0].style.display = "none"
      setVisible(true)
    }, 800)
  }, [])

  useEffect(() => {
    dataGen()
  }, [clicked])

  useEffect(() => {
    if (document.getElementsByClassName('sensor-list-item-container')[0] && !loadContent) {
      document.getElementsByClassName('sensor-list-item-container')[0].classList.add("active")
      setLoadContent(true)
    }
  }, [document.getElementsByClassName('sensor-list-item-container')[0]])

  return (
    <>
      <div className="sensor-container row-center" style={{ opacity: visible ? 1 : 0 }}>
        <div className='middle-container column-center'>
          {sensores && sensores.data ? (
            <div className="middle-content row-center">
              {sensores.data.map((element, index) => {
                if (index < 3) {
                  return (
                    <div
                      className="chart-container row-center"
                      key={`chart-item${index}`}
                      onClick={e => {
                        if (document.getElementsByClassName('active')[0].id !== e.currentTarget.childNodes[2].childNodes[2].textContent) {
                          setData([])
                          setListItem(e, true)
                          setClicked(e.currentTarget.childNodes[2].childNodes[2].textContent)
                        }
                      }}
                    >
                      <div className="background-transparent" />
                      <BarChart
                        key={element.nome}
                        value={element.feed[(element.ultimo_feed_id - 1)].valor}
                        name={element.nome}
                        percentage={Math.ceil((element.feed[(element.ultimo_feed_id - 1)].valor / Math.max.apply(Math, element.feed.map((obj) => obj.valor))) * 100)}
                        color={element.cor}
                      />
                    </div>
                  )
                }
                return <></>
              }
              )}
            </div>
          ) : (
            <></>
          )}
          <MyButton>
            Cadastre seu sensor
          </MyButton>
        </div>

        <ul className="right-container column-center">
          <li className="top-container column-center">
            <div className="sensor-list-container column-center">
              {sensores && sensores.data ? (
                <>
                  <input type="text" className="text-small search-bar" placeholder="Buscar sensor pelo nome ou tipo..." />
                  <div className="sensor-list">
                    {sensores.data.map((element, index) => (
                      <ul
                        className="text-regular column-center sensor-list-item-container"
                        key={`sensor-list-item${index}`}
                        onClick={e => {
                          if (document.getElementsByClassName('active')[0].id !== e.currentTarget.childNodes[0].childNodes[1].textContent) {
                            setData([])
                            setListItem(e)
                            setClicked(e.currentTarget.childNodes[0].childNodes[1].textContent)
                          }
                        }}
                        id={element.nome}
                      >
                        <li className="item-container">
                          <p>Nome: </p>
                          <p>{element.nome}</p>
                        </li>
                        <li className="item-container">
                          <p>Tipo: </p>
                          <p>{element.tipo}</p>
                        </li>
                        <li className="item-container">
                          <p>Valor Atual: </p>
                          <p>{element.feed[element.ultimo_feed_id - 1].valor}</p>
                        </li>
                        <li className="item-container">
                          <p>Ultima atualização: </p>
                          <p>{dateFormat(element.feed[element.ultimo_feed_id - 1].data, "dd/mm/yyyy  - HH:MM")}</p>
                        </li>
                      </ul>
                    ))}
                  </div>
                </>
              ) : (
                <p>Você não tem nenhum sensor cadastrado {":("}</p>
              )}
            </div>
          </li>
          {sensores && data && (
            <li className="bottom-container column-center">
              <MyLineChart data={data} color={color} keyName={"valor"} />
            </li>
          )}
        </ul>
      </div>
    </>
  )
}