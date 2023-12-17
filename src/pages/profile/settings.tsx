import { identityService } from "@/apis";
import { uploaderService } from "@/apis/uploader";
import { useAuthContext } from "@/context/auth";
import { UserUpdateBody } from "@/schema";
import { Image as ImageSolid, X as CloseLine } from "lucide-react";
import Image from "next/image";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  TextFieldInput,
  TextFieldInputProps,
  TextFieldRoot,
  Typography,
  IconButton,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Button,
} from "@mochi-ui/core";
import { useCallback, useEffect, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import {
  Controller,
  ControllerProps,
  useForm,
  FormProvider,
} from "react-hook-form";
import toast from "react-hot-toast";
import { useFetchProfile } from "@/hooks/useFetchProfile";
import { PageSkeleton } from "@/components/common/skeleton";
import COUNTRY_CODE from "@/constants/country-code.json";

type UserUpdateFormValue = Omit<UserUpdateBody, "avatar">;

export default function ProfileSettings() {
  const { user, setUser } = useAuthContext();
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [selectedImage, setSelectedImage] = useState<Blob>();
  const [avatarStep, setAvatarStep] = useState<"ONE" | "TWO">("ONE");
  const [uploadedUrl, setUploadedUrl] = useState<string>();
  const { profile, isFirstLoading, mutate } = useFetchProfile(user?.id);

  const formProps = useForm<UserUpdateFormValue>({
    defaultValues: {
      first_name: "",
      last_name: "",
      country: "VN",
      city: "",
      gender: "OTHER",
      phone: "",
      dob: "",
    },
  });

  const { handleSubmit, reset } = formProps;

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

  const onSubmit = async (value: UserUpdateFormValue) => {
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

    const body: UserUpdateBody = {
      ...value,
      avatar: avatarUrl,
    };

    try {
      await identityService.update(user?.id as string, body);
      toast("Registered successfully");
      mutate();
    } catch (e) {
      toast("Some thing wrong! try reload your page");
    }
  };

  useEffect(() => {
    if (isFirstLoading) return;
    reset(profile);
    if (profile?.avatar) {
      setUploadedUrl(profile.avatar);
      setPreviewAvatar(profile.avatar);
      setAvatarStep("TWO");
    }
    if (profile) {
      setUser(profile);
    }
  }, [isFirstLoading, profile, reset, setUser]);

  useEffect(() => {
    if (selectedImage) {
      const image = URL.createObjectURL(selectedImage);
      setPreviewAvatar(image);
      return () => URL.revokeObjectURL(image);
    }
    return;
  }, [selectedImage]);

  if (isFirstLoading) return <PageSkeleton />;

  return (
    <FormProvider {...formProps}>
      <div className="p-4">
        <Typography level="h5">Profile Settings</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {avatarStep === "ONE" && (
            <div
              {...getRootProps()}
              className="w-40 h-40 bg-neutral-100 rounded-full my-4 flex items-center justify-center cursor-pointer active:scale-90 transition"
            >
              <ImageSolid width={40} height={40} />
              <input {...getInputProps()} />
            </div>
          )}

          {avatarStep === "TWO" && (
            <div className="relative w-40 h-40 bg-neutral-100 rounded-full my-4 flex items-center justify-center cursor-pointer">
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
          <FormInputValue name="nickname" label="Nickname" />
          <Controller<UserUpdateFormValue>
            name="dob"
            render={({ field: { value, ...restField }, fieldState }) => (
              <FormControl error={!!fieldState.error} className="mt-2">
                <FormLabel>Date of birth</FormLabel>
                <TextFieldRoot size="lg">
                  <TextFieldInput
                    type="date"
                    value={value ?? ""}
                    {...restField}
                  />
                </TextFieldRoot>
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <FormInputValue label="Phone number" name="phone" />
          <FormInputValue label="City" name="city" />
          <Controller
            name="country"
            render={({ field }) => (
              <div className="mt-2">
                <FormLabel>Country</FormLabel>
                <Select {...field}>
                  <SelectTrigger className="py-[10px] px-[14px] w-full justify-between h-[52px]">
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
          <Controller
            name="gender"
            render={({ field }) => (
              <div className="mt-2">
                <FormLabel>Gender</FormLabel>
                <Select {...field}>
                  <SelectTrigger className="py-[10px] px-[14px] w-full justify-between h-[52px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="h-[var(--radix-select-content-available-height)] overflow-y-scroll no-scrollbar drop-shadow">
                    {[
                      {
                        key: "MALE",
                        label: "Male",
                      },
                      {
                        key: "FEMALE",
                        label: "FEMALE",
                      },
                      {
                        key: "OTHER",
                        label: "Other",
                      },
                    ].map(({ key, label }) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <Button className="w-full mt-6" size="lg" type="submit">
            Update
          </Button>
        </form>
      </div>
    </FormProvider>
  );
}

const FormInputValue = (
  props: Omit<ControllerProps<UserUpdateFormValue>, "render"> & {
    placeholder?: string;
    helpText?: string;
    label?: string;
    type?: TextFieldInputProps["type"];
  },
) => {
  const { name, placeholder, helpText, label, type } = props;
  return (
    <Controller<UserUpdateFormValue>
      name={name}
      render={({ field: { value, ...restField }, fieldState }) => (
        <FormControl error={!!fieldState.error} className="mt-2">
          {label && <FormLabel>{label}</FormLabel>}
          <TextFieldRoot size="lg">
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
