import axios from 'axios'
import { env } from '@/shared/config/env'

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
