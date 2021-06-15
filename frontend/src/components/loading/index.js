import React from 'react'


export default function Loading() {
    return (
        <div className="loading row-center">
            <div className="dark-background" />
            <div className="loading-container column-center">
                <div className="loading-image-container">
                    <ol className="loading-plant-container">
                        <ul className="leafs">
                            <li />
                            <li />
                            <div className="stalk" />
                        </ul>
                        <li className="vase-top" />
                        <li className="vase">
                            <div />
                        </li>
                    </ol>
                    <ol className="loading-plant-container">
                        <li className="leafs">
                            <span />
                            <span />
                            <span />
                        </li>
                        <li className="vase-top" />
                        <li className="vase">
                            <div className="shadow"/>
                        </li>
                    </ol>
                    <ol className="loading-plant-container">
                        <li className="leafs">
                            <b />
                            <b />
                            <b />
                            <p />
                            <p />
                        </li>
                        <li className="vase">
                            <span />
                            <span />
                        </li>
                    </ol>
                    <div />
                    <div />
                    <div />
                </div>
                <h1 className="text loading-text">
                    loading
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </h1>
            </div>
        </div>
    )
}

