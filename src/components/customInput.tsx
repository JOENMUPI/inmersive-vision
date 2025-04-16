import { TextInput, NumberInput, FileInput, Textarea } from "@mantine/core";
import { CustomTooltip } from "./customTooltip";
import { IconPaperclip } from "@tabler/icons-react";
import { IMaskInput } from 'react-imask';

interface CustomInputI<T, Y = HTMLInputElement> {
  errorText?: string,
  isError?: boolean,
  ref?: React.Ref<Y>,
  onEnter?: () => void,
  label: string,
  style?: React.CSSProperties,
  onChange: (event: T) => void,
  placeholder?: string
  component?: unknown
  extprops?: object
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
  onEnter,
  style,
  ref,
  component,
  onChange,
  extprops,
  placeholder = label,
}: CustomInputI<string>) {
  const borderColor = isError ? 'red' : TEXT_BORDER_BOTTOM
  
  return (
    <CustomTooltip position='top-start' label={label}>
      <TextInput
        component={component}
        ref={ref}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) onEnter()
        }}
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
        {...extprops}
      />
    </CustomTooltip>
  )
}

export function CustomPhoneInput({
  label,
  onChange,
  value,
  ref,
  errorText,
  isError,
  style,
}: CustomInputI<string>) {
  return CustomTextInput({
    label,
    ref,
    component: IMaskInput,
    extprops: {
      mask: [{ mask: '+0000000000' }, { mask: '+00000000000' }, { mask: '+000000000000' }],
    },
    onChange,
    value,
    errorText,
    isError,
    placeholder: label + ' (optional)',
    style,
  })
}

export function CustomFileInput({
  label,
  errorText = 'Error',
  isError = false,
  ref,
  placeholder = label,
  onEnter,
  style,
  onChange,
  value,
}: CustomInputI<File | null, HTMLButtonElement>) {
  const borderColor = isError ? 'red' : TEXT_BORDER_BOTTOM

  return  <CustomTooltip position='top-start' label={label}>
    <FileInput
      leftSection={<IconPaperclip />}
      label={label}
      ref={ref}
      aria-label={label}
      error={isError ? errorText : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onEnter) onEnter()
      }}
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
  </CustomTooltip>  
}

export const CustomInputTextArea = ({
  errorText = 'Error',
  isError = false,
  label,
  ref,
  value,
  style,
  component,
  onEnter,
  onChange,
  extprops,
  placeholder = label,
}: CustomInputI<string, HTMLTextAreaElement>) => {

  const borderColor = isError ? 'red' : TEXT_BORDER_BOTTOM
  return (
    <CustomTooltip position='top-start' label={label}>
      <Textarea
        ref={ref}
        error={isError ? errorText : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) onEnter()
        }}
        styles={{
          input: { 
            fontSize: '1.3rem',
            marginBottom: '.5rem',
            transition: 'all .2s ease',
            border: 0,
            backgroundColor: 'transparent',
          },
          wrapper: {
            transition: 'all .2s ease',
            borderBottom: `1px solid ${borderColor}`,
            ...style,
          }
        }}
        placeholder={placeholder}
        value={value}
        component={component}
        onChange={e => onChange(e.currentTarget.value)}
        {...extprops}
      />
    </CustomTooltip>
  )
}