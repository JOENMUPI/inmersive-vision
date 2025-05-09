import { TextInput, NumberInput, FileInput, Textarea } from "@mantine/core";
import { CustomTooltip } from "./customTooltip";
import { IconEye, IconEyeOff, IconPaperclip } from "@tabler/icons-react";
import { IMaskInput } from 'react-imask';
import { DateInput, DateValue } from '@mantine/dates';

import { INPUT_BORDER_BOTTOM } from "@/utils/consts";
import { useState } from "react";

interface CustomInputI<T, Y = HTMLInputElement> {
  errorText?: string
  isError?: boolean
  disabled?: boolean
  ref?: React.Ref<Y>
  onEnter?: () => void
  readOnly?: boolean
  showLabel?: boolean
  label: string
  style?: React.CSSProperties
  onChange: (event: T) => void
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

export function CustomNumberInput({
  errorText = 'Error',
  isError = false,
  suffix,
  thousandSeparator = ',',
  min,
  disabled = false,
  max,
  readOnly = false,
  prefix,
  decimalScale = 2,
  label,
  allowDecimal = false,
  value,
  style,
  showLabel = false,
  onChange,
  placeholder = label
}: CustomNumberInputI) {
  const borderColor = isError ? 'red' : INPUT_BORDER_BOTTOM

  return (
    <CustomTooltip position='top-start' label={label}>
      <NumberInput
        variant="unstyled"
        placeholder={placeholder}
        disabled={disabled}
        allowNegative={true}
        label={showLabel ? label : undefined}
        hideControls
        readOnly={readOnly}
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
          input: {
            fontSize: '1.3rem',
            marginBottom: '.5rem',
            backgroundColor: 'transparent',
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

export function CustomTextInput({
  errorText = 'Error',
  isError = false,
  label,
  value,
  onEnter,
  disabled = false,
  style,
  ref,
  component,
  onChange,
  showLabel = false,
  extprops,
  readOnly = false,
  placeholder = label,
}: CustomInputI<string>) {
  const borderColor = isError ? 'red' : INPUT_BORDER_BOTTOM
  
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
        disabled={disabled}
        readOnly={readOnly}
        onChange={e => onChange(e.currentTarget.value)}
        value={value}
        label={showLabel ? label : undefined}
        error={isError ? errorText : undefined}
        styles={{
          input: {
            fontSize: '1.3rem',
            marginBottom: '.5rem',
            backgroundColor: 'transparent',
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
  disabled = false,
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
    disabled,
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
  disabled = false,
  placeholder = label,
  onEnter,
  style,
  onChange,
  value,
}: CustomInputI<File | null, HTMLButtonElement>) {
  const borderColor = isError ? 'red' : INPUT_BORDER_BOTTOM

  return  <CustomTooltip position='top-start' label={label}>
    <FileInput
      leftSection={<IconPaperclip />}
      label={label}
      ref={ref}
      disabled={disabled}
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
  disabled,
  style,
  component,
  onEnter,
  onChange,
  extprops,
  placeholder = label,
}: CustomInputI<string, HTMLTextAreaElement>) => {
  const borderColor = isError ? 'red' : INPUT_BORDER_BOTTOM
  
  return (
    <CustomTooltip position='top-start' label={label}>
      <Textarea
        ref={ref}
        disabled={disabled}
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

export const CustomDateInput = ({
  style,
  isError = false,
  showLabel = false,
  label,
  value,
  onChange,
  readOnly,
  errorText,
  component,
  disabled,
  extprops,
  placeholder = label
}: CustomInputI<DateValue, HTMLDataElement>) => {
  const borderColor = isError ? 'red' : INPUT_BORDER_BOTTOM

  return <CustomTooltip position='top-start' label={label}>
    <DateInput
      variant="unstyled"
      valueFormat="DD MMM YYYY"
      value={value}
      disabled={disabled}
      component={component}
      error={isError ? errorText : undefined}
      onChange={onChange}
      label={showLabel ? label : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
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
      {...extprops}
    />
  </CustomTooltip> 
}

export function CustomPassInput({
  errorText = 'Error',
  isError = false,
  label,
  value,
  onEnter,
  disabled = false,
  style,
  ref,
  component,
  onChange,
  showLabel = false,
  extprops,
  readOnly = false,
  placeholder = label,
}: CustomInputI<string>) {
  const borderColor = isError ? 'red' : INPUT_BORDER_BOTTOM
  const [isVisible, setIsVisible] = useState<boolean>(false)

  return (
    <CustomTooltip position='top-start' label={label}>
      <TextInput
        component={component}
        ref={ref}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) onEnter()
        }}
        rightSection={
          isVisible
            ? <IconEyeOff onClick={() => setIsVisible(!isVisible)} size={20} />
            : <IconEye onClick={() => setIsVisible(!isVisible)} size={20} />
        }
        variant="unstyled"
        type={isVisible ? 'text' : 'password'}
        placeholder={placeholder}
        aria-label={label}
        disabled={disabled}
        readOnly={readOnly}
        onChange={e => onChange(e.currentTarget.value)}
        value={value}
        label={showLabel ? label : undefined}
        error={isError ? errorText : undefined}
        styles={{
          input: {
            fontSize: '1.3rem',
            marginBottom: '.5rem',
            backgroundColor: 'transparent',
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