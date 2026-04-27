<script setup lang="ts">
import { useHttpExamples } from '~/composables/useHttpExamples'

const otp = ref('')
const disabled = ref(false)
const isComplete = ref(false)
const isLoading = ref(false)
const isError = ref(false)
const isSuccess = ref(false)

const { postVerifyOtpSimple } = useHttpExamples()

function handleChange () {
  isError.value = false
  isSuccess.value = false
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
    <button
      class="mb-2 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      :class="{ 'bg-indigo-600': !disabled, 'bg-gray-500': disabled }"
      @click="disabled = !disabled"
    >
      切換OTP輸入框禁用狀態
    </button>

    <BaseInputOtp
      v-model="otp"
      :length="6"
      :error="isError"
      :success="isSuccess"
      :disabled="disabled"
      error-message="錯誤的驗證碼"
      success-message="驗證成功"
      @complete="isComplete = true"
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
