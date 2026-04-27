<script setup lang="ts">
import { useHttp } from '~/composables/useHttp'

const http = useHttp()
const otp = ref('')
</script>

<template>
  <div>
    <BaseInputOtp
      v-model="otp"
      :length="6"
      @update:model-value="console.log($event)"
    />
    <p>{{ otp }}</p>

    <button
      class="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      @click="http.postVerifyOtpSimple(otp)"
    >
      Verify OTP
    </button>
  </div>
</template>
