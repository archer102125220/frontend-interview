import { useHttp } from '~/composables/useHttp'

export function useHttpExamples () {
  const request = useHttp()
  return {
    postVerifyOtpSimple: (otp: string) =>
      request.post<{verified: boolean}>('/examples/verify-otp-simple', {
        body: { otp }
      }).then((response) => {
        if (response.data?.verified === false) {
          throw new Error('Invalid OTP')
        }
        return response.data
      }).catch((error: unknown) => {
        if (import.meta.dev) {
          console.error(error)
        }
        throw error
      })
  }
}

export default useHttpExamples
