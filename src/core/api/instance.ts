import axios from 'axios'
import { axiosHeaders, axiosTimeout, baseURL } from './config'
import { retrieveRawInitData } from '@telegram-apps/sdk-react'

const initDataRaw: string | undefined = retrieveRawInitData()

export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    ...axiosHeaders,
    // Authorization: initDataRaw,
    Authorization: process.env.MOCK_INIT_AUTH
      ? process.env.MOCK_INIT_AUTH
      : initDataRaw,
  },
  timeout: axiosTimeout,
})
