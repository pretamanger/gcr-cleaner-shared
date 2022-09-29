import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './NavLink.module.css'

function NavLink({ href, children }) {
  const router = useRouter()
  const classList = [styles.navLink]

  if (router.pathname === href) {
    classList.push(styles.navLinkActive)
  }

  return (
    <Link href={href}>
      <a className={classList.join(' ')}>{children}</a>
    </Link>
  )
}

export { NavLink }
