'use client'

import { parseAsString, useQueryState } from 'nuqs'

type SearchInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value'
>

export const SearchInput = ({
  onChange,
  type = 'search',
  ...props
}: SearchInputProps) => {
  const [query, setQuery] = useQueryState(
    'q',
    props.defaultValue
      ? parseAsString.withDefault(props.defaultValue.toString())
      : parseAsString,
  )

  const value = query || props.defaultValue || ''

  return (
    <input
      value={value}
      {...props}
      onChange={(e) => {
        setQuery(e.target.value || null)
        onChange?.(e)
      }}
    />
  )
}
