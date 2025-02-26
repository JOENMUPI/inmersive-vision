import { TextInput, NumberInput, FileInput } from "@mantine/core";
import { CustomTooltip } from "./customTooltip";
import { IconClipboard } from "@tabler/icons-react";

interface CustomInputI<T> {
  errorText?: string,
  isError?: boolean,
  label: string,
  style?: React.CSSProperties,
  onChange: (event: T) => void,
  placeholder?: string
  value: T
}

interface CustomNumberInputI extends CustomInputI<number> {
  prefix?: string,
  suffix?: string,
  min?: number,
  max?: number,
  allowDecimal?: boolean,
  thousandSeparator?: string,
  decimalScale?: number,
}

const TEXT_BORDER_BOTTOM = '#353535'

export function CustomNumberInput({
  errorText = 'Error',
  isError = false,
  suffix,
  thousandSeparator = ',',
  min,
  max,
  prefix,
  decimalScale = 2,
  label,
  allowDecimal = false,
  value,
  style,
  onChange,
  placeholder = label
}: CustomNumberInputI) {
  const borderColor = isError ? 'red' : TEXT_BORDER_BOTTOM

  return (
    <CustomTooltip position='top-start' label={label}>
      <NumberInput
        variant="unstyled"
        placeholder={placeholder}
        allowNegative={true}
        hideControls
        allowDecimal={allowDecimal}
        aria-label={label}
        onChange={e => onChange(Number(e))}
        value={value}
        thousandSeparator={thousandSeparator}
        min={min}
        max={max}
        error={isError ? errorText : undefined}
        clampBehavior="strict"
        decimalScale={decimalScale}
        prefix={prefix}
        suffix={suffix}
        styles={{
          wrapper: {
            transition: 'all .2s ease',
            borderBottom: `1px solid ${borderColor}`,
            ...style,
          }
        }}
      />
    </CustomTooltip>
  )
}

export function CustomTextInput({
  errorText = 'Error',
  isError = false,
  label,
  value,
  style,
  onChange,
  placeholder = label
}: CustomInputI<string>) {
  const borderColor = isError ? 'red' : TEXT_BORDER_BOTTOM

  return (
    <CustomTooltip position='top-start' label={label}>
      <TextInput
        variant="unstyled"
        placeholder={placeholder}
        aria-label={label}
        onChange={e => onChange(e.currentTarget.value)}
        value={value}
        error={isError ? errorText : undefined}
        styles={{
          input: {
            fontSize: '1.3rem',
            marginBottom: '.5rem',
          },
          wrapper: {
            transition: 'all .2s ease',
            borderBottom: `1px solid ${borderColor}`,
            ...style,
          }
        }}
      />
    </CustomTooltip>
  )
}

export function CustomFileInput({
  label,
  errorText = 'Error',
  isError = false,
  placeholder = label,
  style,
  onChange,
  value,
}: CustomInputI<File | null>) {
  const borderColor = isError ? 'red' : TEXT_BORDER_BOTTOM

  return <FileInput
    leftSection={<IconClipboard />}
    label={label}
    aria-label={label}
    error={isError ? errorText : undefined}
    onChange={onChange}
    value={value}
    styles={{
      label: {
        fontSize: '1.3rem',
        marginBottom: '1rem',
      },
      input: {
        backgroundColor:'transparent',
        transition: 'all .2s ease',
        paddingRight: '3%',
        paddingLeft: '3%',
        border: `1px solid ${borderColor}`,
        borderRadius: 0,
        height: '100%',
        ...style,
      },
      section: {
        display: 'flex',
        alignItems:'end',
        paddingBottom:'3%'
      },
      wrapper: {
        height: '100%',
      }
    }}
    placeholder={placeholder}
    leftSectionPointerEvents="none"
  />
}