<script setup lang="ts">
import { useHttpExamples } from '~/composables/useHttpExamples'

const otpLength = ref(6)
const otp = ref('')
const disabled = ref(false)
const isComplete = ref(false)
const isLoading = ref(false)
const isError = ref(false)
const isSuccess = ref(false)

const { postVerifyOtpSimple } = useHttpExamples()

function handleOtpLengthChange (event: InputEvent) {
  otp.value = ''
  isLoading.value = false
  isComplete.value = false
  isError.value = false
  isSuccess.value = false

  const inputValue = (event.target as HTMLInputElement).value || ''
  const eventData = event.data || ''

  let newOtpLength: string | number = eventData || inputValue

  if (Number.isNaN(Number(newOtpLength))) {
    newOtpLength = newOtpLength.replace(/[^0-9]/g, '')
  }

  if (Number(newOtpLength) < 4 || Number.isNaN(newOtpLength)) {
    newOtpLength = 4
  } else if (Number(newOtpLength) > 8) {
    newOtpLength = 8
  }

  otpLength.value = Number(newOtpLength)
}

function handleChange () {
  isError.value = false
  isSuccess.value = false

  isComplete.value = otp.value.length === otpLength.value
}

async function handleVerifyOtp () {
  isLoading.value = true
  isError.value = false
  try {
    const response = await postVerifyOtpSimple(otp.value)
    if (response.verified) {
      isComplete.value = false
      otp.value = ''
      isSuccess.value = true
    }
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6">
    <div class="mb-4 flex items-center gap-2">
      <label for="otpLength">OTP 長度:</label>
      <input
        v-model="otpLength"
        type="number"
        min="1"
        max="8"
        class="w-16 rounded-md border-2 border-gray-300 text-center text-2xl font-bold focus:border-blue-500 focus:outline-none"
        @input="handleOtpLengthChange"
      >
    </div>
    <button
      class="mb-4 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      :class="{ 'bg-indigo-600': !disabled, 'bg-gray-500': disabled }"
      @click="disabled = !disabled"
    >
      切換OTP輸入框禁用狀態
    </button>

    <BaseInputOtp
      v-model="otp"
      :length="otpLength"
      :error="isError"
      :success="isSuccess"
      :disabled="disabled"
      error-message="錯誤的驗證碼"
      success-message="驗證成功"
      @change="handleChange"
      @error="isError = true"
    />

    <button
      class="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!isComplete || isLoading || disabled"
      @click="handleVerifyOtp"
    >
      Verify OTP
    </button>
  </div>
</template>
