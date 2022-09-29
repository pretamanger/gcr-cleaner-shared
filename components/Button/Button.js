import styles from './Button.module.scss'

function Button({ onClick, children }) {
  return (
    <button className={styles.button} type="button" onClick={onClick}>
      {children}
    </button>
  )
}
export { Button }
