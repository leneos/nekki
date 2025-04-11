import { FC, InputHTMLAttributes, memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input as UiInput } from "@/shared/components/ui/input";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const Input: FC<InputProps> = ({ name, ...inputProps }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <UiInput {...field} {...inputProps} />}
    />
  );
};

export default memo(Input);
