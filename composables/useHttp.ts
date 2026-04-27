import type { NitroFetchOptions } from 'nitropack'

type Method = 'get' | 'post' | 'put' | 'delete'

const replaceUrlParams = (url: string, params: Record<string, unknown>) =>
  url.replace(/:(\w+)/g, (_, key) => String(params[key]))

const fetch = (url: string, options: NitroFetchOptions<Method> = {}) => {
  const newURL = options?.params ? replaceUrlParams(url, options.params) : url

  const newOptions: NitroFetchOptions<Method> = {
    ...options,
    params: {}
  }
  console.log({ url, newURL, options, newOptions })

  return $fetch(newURL, newOptions)
}

export function useHttp () {
  const {
    public: { baseApiUrl }
  } = useRuntimeConfig()

  return {
    get: (url: string, options: NitroFetchOptions<'get'> = {}) =>
      fetch(url, {
        method: 'get',
        ...options,
        baseURL: baseApiUrl
      }),
    post: (url: string, options: NitroFetchOptions<'post'> = {}) =>
      fetch(url, {
        method: 'post',
        ...options,
        baseURL: baseApiUrl
      }),
    postVerifyOtpSimple: (otp: string) =>
      fetch('examples/verify-otp-simple', {
        method: 'post',
        body: { otp },
        baseURL: baseApiUrl
      }),
    put: (url: string, options: NitroFetchOptions<'put'> = {}) =>
      fetch(url, {
        method: 'put',
        ...options,
        baseURL: baseApiUrl
      }),
    delete: (url: string, options: NitroFetchOptions<'delete'> = {}) =>
      fetch(url, {
        method: 'delete',
        ...options,
        baseURL: baseApiUrl
      })
  }
}

export default useHttp
