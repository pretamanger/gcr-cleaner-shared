import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { NavLink } from '../NavLink'

import styles from './Layout.module.scss'

function Layout({ pageTitle, pageHeading, subHeading, children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{pageTitle} | Hello World UI sample application</title>
        <meta name="description" content="Hello World UI sample application" />
        <link rel="icon" type="image/png" href="/favicon.svg" />
      </Head>
      <header className={styles.header}>
        <Link href="/">
          <a>
            <Image
              src="/pret-a-manger-logo.png"
              alt="Pret A Manger logo"
              width={357}
              height={120}
            />
          </a>
        </Link>
        <nav>
          <ul className={styles.navigation}>
            <li className={styles.navigationItem}>
              <NavLink href="/">Home</NavLink>
            </li>
            <li className={styles.navigationItem}>
              <NavLink href="/frontend-api-call">Frontend API call</NavLink>
            </li>
            <li className={styles.navigationItem}>
              <NavLink href="/server-api-call">Server API call</NavLink>
            </li>
            <li className={styles.navigationItem}>
              <NavLink href="/sentry">Sentry</NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <h1>{pageHeading}</h1>
        <h3>{subHeading}</h3>
        {children}
      </main>
    </div>
  )
}

export { Layout }
