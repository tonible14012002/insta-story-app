import { useForm, Controller, FormProvider } from "react-hook-form";
import type { ControllerProps } from "react-hook-form";
import {
  Typography,
  FormLabel,
  TextFieldRoot,
  TextFieldInput,
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Button,
  Select,
  SelectItem,
  SelectLabel,
  SelectContent,
  SelectTrigger,
  SelectValue,
  label,
  IconButton,
  TextFieldInputProps,
} from "@mochi-ui/core";
import { ArrowLeft, Image as ImageSolid, X as CloseLine } from "lucide-react";
import COUNTRY_CODE from "@/constants/country-code.json";
import { UserRegistrationParams } from "@/schema";
import { useCallback, useEffect, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import Image from "next/image";
import { uploaderService } from "@/apis/uploader";
import toast from "react-hot-toast";
import { identityService } from "@/apis";

type RegisterFormValue = Omit<UserRegistrationParams, "avatar">;

interface RegisterFormProps {
  onLogin?: () => void;
}

export const Register = (props: RegisterFormProps) => {
  const { onLogin } = props;
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [selectedImage, setSelectedImage] = useState<Blob>();
  const [avatarStep, setAvatarStep] = useState<"ONE" | "TWO">("ONE");
  const [uploadedUrl, setUploadedUrl] = useState<string>();

  const formProps = useForm<RegisterFormValue>({
    defaultValues: {
      username: "",
      password: "",
      password_confirm: "",
      country: "VN",
      city: "",
      gender: "OTHER",
      phone: "",
      email: "",
    },
  });

  const { control, handleSubmit } = formProps;

  const onDrop: DropzoneOptions["onDrop"] = useCallback(
    (acceptFile: Blob[]) => {
      setSelectedImage(acceptFile[0]);
      setAvatarStep("TWO");
    },
    [],
  );

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/heic": [],
      "image/jfif": [],
    },
  });

  const onSubmit = async (value: RegisterFormValue) => {
    let avatarUrl = uploadedUrl;
    if (!avatarUrl && selectedImage) {
      try {
        const { url } = await uploaderService.uploadImage(selectedImage);
        avatarUrl = url;
        setUploadedUrl(url);
      } catch (e) {
        console.log(e);
        toast.error(
          "Your avatar uploaded fail, you might have to set it later",
        );
      }
    }

    const body: UserRegistrationParams = {
      ...value,
      avatar: avatarUrl,
    };

    try {
      await identityService.register(body);
      toast("Registered successfully");
      onLogin?.();
    } catch (e) {
      toast("Some thing wrong! try reload your page");
    }
  };

  useEffect(() => {
    if (selectedImage) {
      const image = URL.createObjectURL(selectedImage);
      setPreviewAvatar(image);
      return () => URL.revokeObjectURL(image);
    }
    return;
  }, [selectedImage]);

  return (
    <FormProvider {...formProps}>
      <div className="flex flex-col items-center top-10 pb-10">
        <form
          className="w-md bg-white p-4 rounded-md min-w-[400px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography level="h5" className="text-neutral-500">
            Register
          </Typography>
          {avatarStep === "ONE" && (
            <div
              {...getRootProps()}
              className="w-40 h-40 bg-neutral-100 rounded-full m-auto my-4 flex items-center justify-center cursor-pointer active:scale-90 transition"
            >
              <ImageSolid width={40} height={40} />
              <input {...getInputProps()} />
            </div>
          )}

          {avatarStep === "TWO" && (
            <div className="relative w-40 h-40 bg-neutral-100 rounded-full m-auto my-4 flex items-center justify-center cursor-pointer">
              <IconButton
                className="absolute right-0 top-0 active:scale-95 transition"
                variant="ghost"
                onClick={() => {
                  setAvatarStep("ONE");
                  setSelectedImage(undefined);
                }}
              >
                <CloseLine width={14} height={14} />
              </IconButton>
              <div className="transition h-full w-full overflow-hidden rounded-full">
                <Image
                  width={500}
                  height={500}
                  src={previewAvatar ?? ""}
                  alt="preview"
                  layout="cover"
                />
              </div>
            </div>
          )}

          <FormInputValue
            label="Username"
            name="username"
            rules={{
              required: "This field is required",
            }}
          />
          <FormInputValue
            label="Password"
            name="password"
            type="password"
            rules={{
              required: "This field is required",
            }}
          />
          <FormInputValue
            label="Confirm password"
            name="password_confirm"
            type="password"
            rules={{
              required: "This field is required",
            }}
          />
          <FormInputValue
            label="Phone number"
            name="phone"
            rules={{
              required: "This field is required",
            }}
          />
          <FormInputValue
            label="City"
            name="city"
            rules={{
              required: "Type in your city",
            }}
          />
          <Controller
            name="country"
            render={({ field }) => (
              <div className="mt-2">
                <FormLabel>Country</FormLabel>
                <Select {...field}>
                  <SelectTrigger className="py-[10px] px-[14px] w-full justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="h-[var(--radix-select-content-available-height)] overflow-y-scroll no-scrollbar drop-shadow">
                    {Object.keys(COUNTRY_CODE).map((code) => (
                      <SelectItem key={code} value={code}>
                        {code} -{" "}
                        {COUNTRY_CODE[code as keyof typeof COUNTRY_CODE]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <Button className="mt-4 w-full" size="lg" type="submit">
            Register
          </Button>
          <Button
            variant="outline"
            className="mt-4 w-full"
            size="lg"
            type="button"
            onClick={onLogin}
          >
            <ArrowLeft width={14} />
            Login
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};

const FormInputValue = (
  props: Omit<ControllerProps<RegisterFormValue>, "render"> & {
    placeholder?: string;
    helpText?: string;
    label?: string;
    type?: TextFieldInputProps["type"];
  },
) => {
  const { name, placeholder, helpText, label, type } = props;
  return (
    <Controller<RegisterFormValue>
      name={name}
      render={({ field: { value, ...restField }, fieldState }) => (
        <FormControl error={!!fieldState.error} className="mt-2">
          {label && <FormLabel>{label}</FormLabel>}
          <TextFieldRoot>
            <TextFieldInput
              type={type}
              value={value ?? ""}
              {...restField}
              placeholder={placeholder}
            />
          </TextFieldRoot>
          {!fieldState.error && helpText ? (
            <FormHelperText>{helpText}</FormHelperText>
          ) : (
            <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
          )}
        </FormControl>
      )}
    />
  );
};
