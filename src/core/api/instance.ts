import axios from 'axios'
import { axiosHeaders, axiosTimeout, baseURL } from './config'

export const apiClient = axios.create({
  baseURL: baseURL,
  headers: axiosHeaders,
  timeout: axiosTimeout,
})
