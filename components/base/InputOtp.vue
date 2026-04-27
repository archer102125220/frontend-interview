<script setup lang="ts">
interface Props {
  length?: number;
  modelValue: string;
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  modelValue: ''
})
const emit = defineEmits(['update:modelValue'])

const { length } = toRefs(props)
const otp = ref<string[]>([...Array(length.value)].fill(''))
const focusedInput = ref<number | null>(0)
const inputRefs = ref<HTMLInputElement[]>([])

function focus (index: number) {
  focusedInput.value = index
}

function handleInput (index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/[^0-9]/g, '')
  const newOtp = [...otp.value]
  let newFocusedInput: number | null = focusedInput.value

  if (newOtp[index + 1] === '' && value.length >= 1) {
    const digits = value.split('').slice(0, length.value - index)
    digits.forEach((digit, idx) => {
      if (index + idx < length.value) {
        newOtp[index + idx] = digit
      }
    })
    const filledCount = newOtp.filter(Boolean).length
    newFocusedInput = (filledCount === length.value || index + 1 < length.value) ? index + 1 : filledCount
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

  focusedInput.value = newFocusedInput
  otp.value = newOtp
  emit('update:modelValue', otp.value.join(''))
}

watch(
  () => otp.value,
  () => {
    const safeNewFousedInput = focusedInput.value ?? 0

    if (safeNewFousedInput >= length.value) {
      if (inputRefs.value[safeNewFousedInput - 1] instanceof HTMLInputElement) {
        inputRefs.value[safeNewFousedInput - 1].blur()
      }
      focusedInput.value = null
    } else if (inputRefs.value[safeNewFousedInput] instanceof HTMLInputElement) {
      inputRefs.value[safeNewFousedInput].focus()
    }
  }
)
</script>

<template>
  <div class="flex gap-2">
    <input
      v-for="(_, index) in otp"
      :key="index"
      ref="inputRefs"
      v-model="otp[index]"
      type="text"
      inputmode="numeric"
      class="size-12 rounded-lg border-2 border-gray-300 text-center text-2xl font-bold focus:border-blue-500 focus:outline-none"
      :class="{ 'border-blue-500': focusedInput === index }"
      @focus="focus(index)"
      @input="handleInput(index, $event)"
    >
  </div>
</template>
