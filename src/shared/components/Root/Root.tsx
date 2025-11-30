'use client'

import { type PropsWithChildren } from 'react'

import { useDidMount } from '@/shared/hooks/useDidMount'

import { ErrorBoundary } from '../ErrorBoundary'
import { ErrorPage } from '../ErrorPage'
import { Loading } from '../Loading'

export function Root(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of
  // the Server Side Rendering. That's why we are showing loader on the server
  // side.
  const didMount = useDidMount()

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>{props.children}</ErrorBoundary>
  ) : (
    <Loading />
  )
}
