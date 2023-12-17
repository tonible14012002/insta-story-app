import {
  Button,
  FormControl,
  FormLabel,
  TextFieldInput,
  TextFieldRoot,
  Typography,
  TextFieldDecorator,
  FormHelperText,
  FormErrorMessage,
} from "@mochi-ui/core";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { ArrowRight, User as UserSolid } from "lucide-react";
import { identityService } from "@/apis";
import JWTManager from "@/libs/jwt-manager";
import { useAuthContext } from "@/context/auth";
import { toast } from "react-hot-toast";

interface LoginFormValue {
  username: string;
  password: string;
}

interface LoginFormProps {
  onRegister?: () => void;
}

export function LoginForm(props: LoginFormProps) {
  const { onRegister } = props;
  const { handleSubmit, control } = useForm<LoginFormValue>();
  const { setUser } = useAuthContext();

  const onSubmit = async (values: LoginFormValue) => {
    try {
      const res = await identityService.login(values);
      const { access, refresh, user } = res.data;

      JWTManager?.setToken(access);
      JWTManager?.setRefreshToken(refresh);

      setUser(user);
    } catch (e: any) {
      toast.error(
        <Typography level="h8">User&apos;s credential not found</Typography>,
      );
    }
  };

  return (
    <div className="fixed h-screen flex flex-col items-center justify-center inset-0">
      <form
        className="w-md bg-white p-4 rounded-md min-w-[400px] -translate-y-[100px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography level="h5" className="text-neutral-500">
          Login
        </Typography>
        <Controller
          name="username"
          control={control}
          rules={{
            required: "This field is required",
          }}
          render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} className="mt-2">
              <FormLabel>Username</FormLabel>
              <TextFieldRoot>
                <TextFieldDecorator>
                  <UserSolid />
                </TextFieldDecorator>
                <TextFieldInput {...field} placeholder="Enter your username" />
              </TextFieldRoot>
              {!fieldState.error ? (
                <FormHelperText>Type in your Username</FormHelperText>
              ) : (
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              )}
            </FormControl>
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: "This field is required",
          }}
          render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} className="mt-2">
              <FormLabel>Password</FormLabel>
              <TextFieldRoot>
                <TextFieldDecorator>
                  <UserSolid />
                </TextFieldDecorator>
                <TextFieldInput
                  {...field}
                  type="password"
                  placeholder="Enter your username"
                />
              </TextFieldRoot>
              {!fieldState.error ? (
                <FormHelperText>Type in your Password</FormHelperText>
              ) : (
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              )}
            </FormControl>
          )}
        />
        <Button className="mt-4 w-full" size="lg" type="submit">
          Sign in
        </Button>
        <Button
          variant="outline"
          className="mt-4 w-full"
          size="lg"
          type="button"
          onClick={onRegister}
        >
          Register
          <ArrowRight width={14} height={14} />
        </Button>
      </form>
    </div>
  );
}
