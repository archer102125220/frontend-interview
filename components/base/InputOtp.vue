<script setup lang="ts">
interface Props {
  length?: number;
  modelValue: string;
  error?: boolean;
  disabled?:boolean;
  success?: boolean;
  errorMessage?: string;
  successMessage?: string;
  column?:number;
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  modelValue: '',
  disabled: false,
  error: false,
  success: false,
  errorMessage: 'Invalid OTP',
  successMessage: 'OTP Verified Successfully',
  column: 6
})
const emit = defineEmits(['update:modelValue', 'change', 'complete', 'error'])

const { length, modelValue, column } = toRefs(props)

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

// Split otp array into rows based on `column` prop
const rows = computed(() => {
  const result: string[][] = []
  for (let i = 0; i < otp.value.length; i += column.value) {
    result.push(otp.value.slice(i, i + column.value))
  }
  return result
})

function focus (index: number) {
  focusedInput.value = index
}

function handleInput (index: number, event: InputEvent) {
  const input = event.target as HTMLInputElement
  const inputValue = input.value || ''
  const value =
    event.data?.replace(/[^0-9]/g, '') || inputValue.replace(/[^0-9]/g, '')

  handleOtp(value, index, inputValue.match(/[^0-9]/g) === null && event.data !== null)

  if (
    event.data !== null &&
    (event.data.match(/[^0-9]/g) !== null ||
      inputValue.match(/[^0-9]/g) !== null)
  ) {
    console.log('error')
    emit('error', 'Invalid OTP')
  }
}

function handleKeyDown (index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    handleOtp('', index, false)
  }
}

function handleOtp (value: string, index: number, goNext: boolean = true) {
  const newOtp = [...otp.value]
  let newFocusedInput: number | null = focusedInput.value

  const emptyIndex = newOtp.findIndex(value => value === '')

  if ((newOtp[index + 1] !== undefined && value.length >= 1)) {
    const digits = value.split('').slice(0, emptyIndex <= index ? value.length : (length.value - index))
    digits.forEach((digit, idx) => {
      if (emptyIndex <= index) {
        newOtp[idx] = digit
      } else if (index + idx < length.value) {
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
    } else {
      newOtp[index] = ''
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
      if (
        inputRefList.value[safeNewFousedInput - 1] instanceof HTMLInputElement
      ) {
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
    <div class="flex flex-col gap-2">
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="flex gap-2"
      >
        <input
          v-for="(_, colIndex) in row"
          :key="colIndex"
          ref="inputRefList"
          v-model="otp[rowIndex * column + colIndex]"
          :disabled="disabled"
          type="text"
          inputmode="numeric"
          class="size-12 rounded-lg border-2 border-gray-300 text-center text-2xl font-bold focus:border-blue-500 focus:outline-none"
          :class="{
            'border-blue-500': focusedInput === rowIndex * column + colIndex,
            'border-red-500': error,
          }"
          @focus="focus(rowIndex * column + colIndex)"
          @input="handleInput(rowIndex * column + colIndex, $event)"
          @keydown="handleKeyDown(rowIndex * column + colIndex, $event)"
        >
      </div>
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
