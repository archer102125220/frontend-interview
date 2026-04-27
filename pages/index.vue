<script setup lang="ts">
import { useHttpExamples } from '~/composables/useHttpExamples'

const otp = ref('')
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
    <BaseInputOtp
      v-model="otp"
      :length="6"
      :error="isError"
      @complete="isComplete = true"
      @change="handleChange"
    />

    <button
      class="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!isComplete || isLoading"
      @click="handleVerifyOtp"
    >
      Verify OTP
    </button>

    <p
      v-if="isError"
      class="mt-2 text-sm text-red-600"
    >
      Invalid OTP
    </p>

    <p
      v-if="isSuccess"
      class="mt-2 text-sm text-green-600"
    >
      OTP Verified Successfully
    </p>
  </div>
</template>
