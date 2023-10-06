import { initQueryClient } from '@ts-rest/react-query'
import { contract } from '../contract'
const baseUrl = `${window.location.protocol}//${window.location.host}`

export const client = initQueryClient(contract, {
  baseUrl,
  baseHeaders: {},
})
