import { Button, FormControl, FormLabel, TextFieldInput, TextFieldRoot, Typography, TextFieldDecorator, FormHelperText, FormErrorMessage } from "@consolelabs/core";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { UserSolid } from "@consolelabs/icons";
import { identityService } from "@/apis";
import JWTManager from "@/libs/jwt-manager";
import { useAuthContext } from "@/context/auth";

interface LoginFormValue {
   username: string
   password: string
}

export function LoginForm () {

   const { handleSubmit, control } = useForm<LoginFormValue>()
   const { setUser } = useAuthContext()

   const onSubmit = async (values: LoginFormValue) => {
      try {
            const res = await identityService.login(values)
            const { access, refresh, user } = res.data

            JWTManager?.setToken(access)
            JWTManager?.setRefreshToken(refresh)

            setUser(user)
      }
      catch (e) {
         alert(JSON.stringify(e))
      }
   }

   return (
      <div className="py-8 px-8 bg-black/40 h-screen flex items-center justify-center">
         <form className="w-md bg-white p-4 rounded-md min-w-[400px]" onSubmit={handleSubmit(onSubmit)}>
            <Typography level="h5" className="text-neutral-500">
               Login
            </Typography>
            <Controller name="username" control={control} rules={{
                  required: 'This field is required'
               }}
               render={({
                  field,
                  fieldState
               }) => (
                  <FormControl error={!!fieldState.error} className="mt-2">
                     <FormLabel>Username</FormLabel>
                     <TextFieldRoot>
                        <TextFieldDecorator>
                           <UserSolid />
                        </TextFieldDecorator>
                        <TextFieldInput {...field} placeholder="Enter your username" />
                     </TextFieldRoot>
                     {!fieldState.error? <FormHelperText>Type in your Username</FormHelperText>
                     : <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>}
                  </FormControl>
               )}
            />
            <Controller name="password" control={control} rules={{
                  required: 'This field is required'
               }}
               render={({
                  field,
                  fieldState
               }) => (
                  <FormControl error={!!fieldState.error} className="mt-2">
                     <FormLabel>Password</FormLabel>
                     <TextFieldRoot>
                        <TextFieldDecorator>
                           <UserSolid />
                        </TextFieldDecorator>
                        <TextFieldInput {...field} type="password" placeholder="Enter your username" />
                     </TextFieldRoot>
                     {!fieldState.error? <FormHelperText>Type in your Password</FormHelperText>
                     : <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>}
                  </FormControl>
               )}
            />
            <Button className="mt-4 w-full" size="lg" type="submit">
               Signin
            </Button>
         </form>
      </div>
   )
}
