import React from 'react'
import './styles.scss'

export default function Fotter() {
    return (
        <div className="footer-container row-center">
            <ol className="text-small footer-information row-center">
                <li>©UrbanVG</li>
                |
                <li>Todos os direitos reservados</li>
                |
                <li>Termos de uso</li>
                |
                <li>Política de Privacidade</li>
            </ol>
        </div>
    )
}