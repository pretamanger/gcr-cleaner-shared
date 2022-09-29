import styles from './EndpointSummary.module.css'
import { Loader } from '../Loader'

function EndpointSummary({ endpointUrl, response, isLoading, errorMessage }) {
  return (
    <div className={styles.container}>
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}

      <ul className={styles.summaryList}>
        <li>
          <strong>Request endpoint url:</strong> {endpointUrl}
        </li>
        <li>
          <strong>Response message:</strong> {response}
          {isLoading && <Loader />}
        </li>
      </ul>
    </div>
  )
}

export { EndpointSummary }
