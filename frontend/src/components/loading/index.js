import React from 'react'
import './styles.scss'

export default function Loading() {
    return (
        <div className="loading">
            <div className="loading-background" />
            <div className="loading-container">
                <div className="loading-image-container">
                    <ol class="loading-plant-container">
                        <ul class="leafs">
                            <li />
                            <li />
                            <div className="stalk" />
                        </ul>
                        <li class="vase-top" />
                        <li class="vase">
                            <div />
                        </li>
                    </ol>
                    <ol class="loading-plant-container">
                        <li class="leafs">
                            <span />
                            <span />
                            <span />
                        </li>
                        <li class="vase-top" />
                        <li class="vase">
                            <div />
                        </li>
                    </ol>
                    <ol class="loading-plant-container">
                        <li class="leafs">
                            <b />
                            <b />
                            <b />
                            <p />
                            <p />
                        </li>
                        <li class="vase">
                            <span />
                            <span />
                        </li>
                    </ol>
                    <div />
                    <div />
                    <div />
                </div>
                <h1 className="loading-text">
                    loading
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </h1>
            </div>
        </div>
    )
}

