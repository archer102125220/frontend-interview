import type { NitroFetchOptions } from 'nitropack'

import type { ApiResponse } from '~/types/examples/common'

type Method = 'get' | 'post' | 'put' | 'delete'

const replaceUrlParams = (url: string, params: Record<string, unknown>) =>
  url.replace(/:(\w+)/g, (_, key) => String(params[key]))

const fetch = async <T> (url: string, options: NitroFetchOptions<Method> = {}) => {
  const newURL = options?.params ? replaceUrlParams(url, options.params) : url

  const newOptions: NitroFetchOptions<Method> = {
    ...options,
    params: {}
  }

  const response = await $fetch<ApiResponse<T>>(newURL, newOptions)
  if (response?.success === false) {
    throw new Error(response?.message)
  }
  return response
}

export function useHttp () {
  const {
    public: { baseApiUrl }
  } = useRuntimeConfig()

  return {
    get: <T> (url: string, options: NitroFetchOptions<'get'> = {}) =>
      fetch<T>(url, {
        method: 'get',
        ...options,
        baseURL: baseApiUrl
      }),
    post: <T> (url: string, options: NitroFetchOptions<'post'> = {}) =>
      fetch<T>(url, {
        method: 'post',
        ...options,
        baseURL: baseApiUrl
      }),
    put: <T> (url: string, options: NitroFetchOptions<'put'> = {}) =>
      fetch<T>(url, {
        method: 'put',
        ...options,
        baseURL: baseApiUrl
      }),
    delete: <T> (url: string, options: NitroFetchOptions<'delete'> = {}) =>
      fetch<T>(url, {
        method: 'delete',
        ...options,
        baseURL: baseApiUrl
      })
  }
}

export default useHttp
