<script setup lang="ts">
interface Props {
  length?: number,
}

const props = withDefaults(defineProps<Props>(), {
  length: 6
})

const { length } = toRefs(props)
const otp = ref<string[]>([...Array(length.value)].fill(''))
const focusedInput = ref<number | null>(null)

function focus (index: number) {
  focusedInput.value = index
}

function handleInput (index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/[^0-9]/g, '')

  if (value && value.length > 1) {
    const digits = value.split('').slice(0, length.value - index)
    digits.forEach((digit, idx) => {
      if (index + idx < length.value) {
        otp.value[index + idx] = digit
      }
    })
    const filledCount = otp.value.filter(Boolean).length
    focusedInput.value = filledCount < length.value ? filledCount : null
  } else {
    otp.value[index] = value
    if (value && index < length.value - 1) {
      focusedInput.value = index + 1
    } else {
      focusedInput.value = null
    }
  }
}

function handleKeydown (index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !otp.value[index]) {
    if (index > 0) {
      focusedInput.value = index - 1
    }
  }
}
</script>
<template>
  <div class="flex gap-2">
    <input
      v-for="(_, index) in otp"
      :key="index"
      v-model="otp[index]"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="size-12 rounded-lg border-2 border-gray-300 text-center text-2xl font-bold focus:border-blue-500 focus:outline-none"
      :class="{ 'border-blue-500': focusedInput === index }"
      @focus="focus(index)"
      @input="handleInput(index, $event)"
      @keydown="handleKeydown(index, $event)"
    >
  </div>
</template>
