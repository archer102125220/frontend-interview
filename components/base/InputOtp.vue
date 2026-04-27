<script setup lang="ts">
interface Props {
  length?: number;
  modelValue: string;
  error?: boolean;
  success?: boolean;
  errorMessage?: string;
  successMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  modelValue: '',
  error: false,
  success: false,
  errorMessage: 'Invalid OTP',
  successMessage: 'OTP Verified Successfully'
})
const emit = defineEmits(['update:modelValue', 'change', 'complete'])

const { length, modelValue } = toRefs(props)
const otp = ref<string[]>(
  modelValue.value
    .split('')
    .slice(0, length.value)
    .concat(
      Array(
        Math.max(modelValue.value.length, length.value) -
          modelValue.value.length
      ).fill('')
    )
)
const focusedInput = ref<number | null>(0)
const inputRefList = ref<HTMLInputElement[]>([])

function focus (index: number) {
  focusedInput.value = index
}

function handleInput (index: number, event: InputEvent) {
  const input = event.target as HTMLInputElement
  const inputValue = input.value || ''

  const value = event.data?.replace(/[^0-9]/g, '') || inputValue.replace(/[^0-9]/g, '')

  handleOtp(value, index, inputValue.match(/[^0-9]/g) === null)
}

function handleOtp (value: string, index: number, goNext: boolean = true) {
  const newOtp = [...otp.value]
  let newFocusedInput: number | null = focusedInput.value

  if (newOtp[index + 1] !== undefined && value.length >= 1) {
    const digits = value.split('').slice(0, length.value - index)
    digits.forEach((digit, idx) => {
      if (index + idx < length.value) {
        newOtp[index + idx] = digit
      }
    })
    const filledCount = newOtp.filter(Boolean).length

    newFocusedInput =
        filledCount === length.value || index + 1 < length.value
          ? index + 1
          : filledCount
  } else {
    if (value.length === 1) {
      newOtp[index] = value
    } else if (value !== '') {
      newOtp[index] = value.charAt(value.length - 1)
    }

    if (newOtp[index] === '') {
      newFocusedInput = index - 1 >= 0 ? index - 1 : 0
    } else if (newOtp[index] !== '' && index + 1 <= length.value) {
      newFocusedInput = index + 1
    }
  }

  if (goNext === true) {
    focusedInput.value = newFocusedInput
  }

  otp.value = newOtp
  emit('update:modelValue', otp.value.join(''))
  emit('change', otp.value.join(''))
  if (otp.value.join('').length === length.value) {
    emit('complete', otp.value.join(''))
  }
}

watch(
  () => modelValue.value,
  (newModelValue) => {
    if (newModelValue === '') {
      focusedInput.value = 0
      otp.value = [...Array(length.value)].fill('')
    } else if (otp.value.join('') !== newModelValue) {
      const newOtp = newModelValue.split('').slice(0, length.value)

      newOtp.forEach((value, index) => {
        handleOtp(value, index)
      })
    }
  }
)
watch(
  () => length.value,
  (newLength) => {
    otp.value = modelValue.value
      .split('')
      .slice(0, newLength)
      .concat(
        Array(
          Math.max(modelValue.value.length, newLength) -
            modelValue.value.length
        ).fill('')
      )
  }
)
watch(
  () => otp.value,
  () => {
    const safeNewFousedInput = focusedInput.value ?? 0

    if (safeNewFousedInput >= length.value) {
      if (inputRefList.value[safeNewFousedInput - 1] instanceof HTMLInputElement) {
        inputRefList.value[safeNewFousedInput - 1].blur()
      }
      focusedInput.value = null
    } else if (
      inputRefList.value[safeNewFousedInput] instanceof HTMLInputElement
    ) {
      inputRefList.value[safeNewFousedInput].focus()
    }
  }
)
</script>

<template>
  <div class="text-center">
    <div class="flex gap-2">
      <input
        v-for="(_, index) in otp"
        :key="index"
        ref="inputRefList"
        v-model="otp[index]"
        type="text"
        inputmode="numeric"
        class="size-12 rounded-lg border-2 border-gray-300 text-center text-2xl font-bold focus:border-blue-500 focus:outline-none"
        :class="{
          'border-blue-500': focusedInput === index,
          'border-red-500': error
        }"
        @focus="focus(index)"
        @input="handleInput(index, $event)"
      >
    </div>

    <p
      v-if="error"
      class="mt-2 text-sm text-red-600"
    >
      {{ errorMessage }}
    </p>

    <p
      v-if="success"
      class="mt-2 text-sm text-green-600"
    >
      {{ successMessage }}
    </p>
  </div>
</template>
