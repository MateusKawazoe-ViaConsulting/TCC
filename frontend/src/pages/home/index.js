import React from 'react'
import Loading from '../../components/loading'
import './styles.scss'

export default function Home() {
    return (
        <div className="container">
            <Loading/>
            <div class="container1">

                <div class="line1">

                    <div class="leaf1"></div>
                    <div class="leaf2"></div>
                    <div class="leaf3"></div>
                </div>
                <div class="line">
                </div>
                <div class="pot1"> <div class="shadow"></div></div>


            </div>
            <div class="container2">

                <div class="line1">
                    <div class="leaf1"></div>
                    <div class="leaf2"></div>
                    <div class="leaf3"></div>
                    <div class="leaf6"></div>
                    <div class="leaf7"></div>
                </div>

                <div class="pot2">
                    <div class="line3"></div>
                    <div class="line2"></div>
                </div>


            </div>

            <div class="container3">
                <div class="line1">

                    <div class="leaf4"></div>
                    <div class="leaf5"></div>
                    <div class="root"></div>
                </div>

                <div class="line">
                </div>
                <div class="pot3">
                    <div class="shadow"></div>

                </div>
            </div>
        </div>
    )
}