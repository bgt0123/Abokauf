import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="page">
            <h1 className="page__title">Ihr Zeitungsabo – einfach & flexibel</h1>
            <p className="page__subtitle">Wähle das Abo, das zu dir passt, und konfiguriere es nach deinen Wünschen.</p>
            <Link to="/login" className="btn btn--primary">Jetzt abonnieren</Link>
        </div>
    )
}
