import { CustomHeader } from "@/components/common/header/custom-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  TextFieldInput,
  TextFieldRoot,
  Typography,
} from "@consolelabs/core";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { type DropzoneOptions } from "react-dropzone";
import Image from "next/image";
import { animation } from "@/utils/style";
import { useAuthContext } from "@/context/auth";
import { useForm } from "react-hook-form";
import { CreateStoryParams } from "@/schema/story";
import { Controller } from "react-hook-form";
import { ChevronRightLine } from "@consolelabs/icons";
import { ExcludeUsersModal } from "./exclude-user-modal";

const STEPS = {
  ONE: "Step1",
  TWO: "Step2",
} as const;
type Steps = (typeof STEPS)[keyof typeof STEPS];

const TitleStepMapper = {
  [STEPS.ONE]: "Upload New Story",
  [STEPS.TWO]: "Edit Your Story",
};

export const StoryUploaderModal = () => {
  const [step, setStep] = useState<Steps>(STEPS.ONE);
  const [selectedFile, setSelectedFile] = useState<Blob>();
  const [previewImage, setPreviewImage] = useState<string>();
  const { setValue, control, handleSubmit, formState } =
    useForm<CreateStoryParams>({
      defaultValues: {
        duration: "5",
        live_time: "8600",
        privacy_mode: "PUBLIC",
        users_to_exclude: [],
        media_type: "IMAGE",
        media_url: "",
        view_option: "EVERYONE",
        alt_text: "",
      },
    });
  const { isValid } = formState;

  const { user } = useAuthContext();

  const onDrop: DropzoneOptions["onDrop"] = useCallback(
    (acceptFile: Blob[]) => {
      setSelectedFile(acceptFile[0]);
      setStep(STEPS.TWO);
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

  const onSubmit = (data: CreateStoryParams) => {
    console.log(data);
  };

  const renderStepOne = (
    <TabsContent value={STEPS.ONE} className="w-full flex-1">
      <div
        className="h-full flex items-center justify-center flex-col gap-4"
        {...getRootProps()}
      >
        <Typography level="h6">Drag your Photo Here</Typography>
        <Button>Upload Image from your device</Button>
        <input {...getInputProps()} />
      </div>
    </TabsContent>
  );

  const renderExcludeUserPicker = (
    <Controller
      name="users_to_exclude"
      control={control}
      render={({ field }) => (
        <Modal>
          <ModalTrigger className="w-full text-left flex justify-between items-center group">
            <Typography level="h8" fontWeight="lg" className="tracking-tight">
              Exclude users
            </Typography>
            <div className="flex items-center gap-4">
              <Typography level="p6" color="textSecondary">
                {field.value.length} users
              </Typography>
              <ChevronRightLine className=" group-hover:translate-x-[5px] transition" />
            </div>
          </ModalTrigger>
          <ModalContent
            className={clsx(
              ...animation.accordionContentAnimation,
              "max-w-md w-full !p-0 space-y-4 h-[600px] overflow-hidden",
            )}
          >
            <ExcludeUsersModal {...field} />
          </ModalContent>
        </Modal>
      )}
    />
  );

  const renderCaptionField = (
    <Controller
      name="caption"
      control={control}
      render={({ field }) => (
        <textarea
          placeholder="Write your caption"
          className={clsx(
            "placeholder:text-text-secondary",
            "h-[200px] w-full",
            "outline-none p-4",
            "text-sm",
            "font-light",
            "bg-neutral-100",
          )}
          {...field}
        />
      )}
    />
  );

  const renderDurationPicker = (
    <div className="flex justify-between p-4 py-2 items-center">
      <Typography level="h7" fontWeight="xl">
        Duration
      </Typography>
      <Controller
        name="duration"
        control={control}
        render={({ field }) => (
          <Select {...field}>
            <SelectTrigger className="!shadow-none min-w-[100px] justify-end">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 seconds</SelectItem>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="15">15 seconds</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );

  const renderExpirePicker = (
    <div className="flex justify-between p-4 py-2 items-center">
      <Typography level="h7" fontWeight="xl">
        Expire in
      </Typography>
      <Controller
        name="live_time"
        control={control}
        render={({ field }) => (
          <Select {...field}>
            <SelectTrigger className="!shadow-none min-w-[100px] justify-end">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4300">12 hours</SelectItem>
              <SelectItem value="8600">1 day</SelectItem>
              <SelectItem value="17200">2 days</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );

  const renderAltTextField = (
    <>
      <Typography level="p6" color="textSecondary">
        Alt text describes your photos for people with visual impairments. Alt
        text will be automatically created for your photos or you can choose to
        write your own.
      </Typography>
      <div className="flex items-center gap-4">
        <Image width={50} height={50} src={previewImage ?? ""} alt="preview" />
        <Controller
          name="alt_text"
          control={control}
          render={({ field }) => (
            <TextFieldRoot className="flex-1 !border-none">
              <TextFieldInput {...field} />
            </TextFieldRoot>
          )}
        />
      </div>
    </>
  );

  const renderViewOptions = (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 justify-between">
          <Typography level="h8" fontWeight="lg" className="tracking-tight">
            Hide view counts on this post
          </Typography>
          <Controller
            control={control}
            name="view_option"
            render={({ field }) => (
              <Switch
                checked={field.value === "ONLY_ME"}
                name="view_option"
                onClick={() => {
                  setValue(
                    "view_option",
                    field.value === "EVERYONE" ? "ONLY_ME" : "EVERYONE",
                  );
                }}
              />
            )}
          />
        </div>
        <Typography level="p6" color="textSecondary">
          Only you will see the total number of likes and views on this post.
          You can change this later by going to the ··· menu at the top of the
          post. To hide like counts on other people&lsquo;s posts, go to your
          account settings.
        </Typography>
      </div>
    </>
  );

  const renderPrivacyOptions = (
    <div className="flex gap-4 justify-between">
      <Typography level="h8" fontWeight="lg" className="tracking-tight">
        Privacy Mode
      </Typography>
      <Controller
        control={control}
        name="privacy_mode"
        render={({ field }) => (
          <div className="flex items-center gap-4">
            <label htmlFor="privacy_public" className="flex items-center gap-1">
              <input
                id="privacy_public"
                checked={field.value === "PUBLIC"}
                onChange={() => setValue("privacy_mode", "PUBLIC")}
                type="radio"
              />
              <Typography level="p6">Public</Typography>
            </label>
            <label
              htmlFor="privacy_private"
              className="flex items-center gap-1"
            >
              <input
                id="privacy_private"
                checked={field.value === "PRIVATE"}
                onChange={() => setValue("privacy_mode", "PRIVATE")}
                type="radio"
              />
              <Typography level="p6">Private</Typography>
            </label>
            <label
              htmlFor="privacy_friend_only"
              className="flex items-center gap-1"
            >
              <input
                id="privacy_friend_only"
                checked={field.value === "FRIEND_ONLY"}
                onChange={() => setValue("privacy_mode", "FRIEND_ONLY")}
                type="radio"
              />
              <Typography level="p6">Friend only</Typography>
            </label>
          </div>
        )}
      />
    </div>
  );

  const renderStepTwo = (
    <TabsContent value={STEPS.TWO}>
      <div>
        <Image
          src={previewImage ?? ""}
          alt="preview"
          layout="responsive"
          width={400}
          height={400}
        />
      </div>
      <form
        className="min-h-[400px] mb-[72px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex p-4 items-center gap-2">
          <Avatar src={user?.avatar ?? ""} />
          <Typography level="h7">@_{user?.nickname}</Typography>
        </div>
        {renderCaptionField}
        {renderDurationPicker}
        {renderExpirePicker}
        <Accordion
          type="multiple"
          className="rounded-none shadow-none pr-4 pl-2 py-0 pb-4"
        >
          <AccordionItem value="accessibility">
            <AccordionTrigger className="text-base font-bold">
              Accessibility
            </AccordionTrigger>
            <AccordionContent
              className={clsx(
                ...animation.accordionContentAnimation,
                "space-y-2",
              )}
            >
              {renderAltTextField}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="advance">
            <AccordionTrigger className="text-base font-bold">
              Advanced Settings
            </AccordionTrigger>
            <AccordionContent
              className={clsx(
                ...animation.accordionContentAnimation,
                "space-y-4",
              )}
            >
              {renderViewOptions}
              {renderPrivacyOptions}
              {renderExcludeUserPicker}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="fixed bottom-0 p-4 border-t w-full z-50 bg-white">
          <Button disabled={!isValid} className="w-full">
            Post
          </Button>
        </div>
      </form>
    </TabsContent>
  );

  useEffect(() => {
    if (selectedFile) {
      const image = URL.createObjectURL(selectedFile);
      setPreviewImage(image);
      return () => URL.revokeObjectURL(image);
    }
    return;
  }, [selectedFile]);

  return (
    <div className={clsx("h-full w-full flex flex-col")}>
      <CustomHeader
        title={TitleStepMapper[step]}
        closeModalOnBack={step === STEPS.ONE}
        // Return prevstep, if at step one, close modal
        onBack={step === STEPS.ONE ? undefined : () => setStep(STEPS.ONE)}
        className="border-b"
      />
      <Tabs
        className="flex-1 overflow-y-auto flex flex-col no-scrollbar"
        value={step}
      >
        {renderStepOne}
        {renderStepTwo}
      </Tabs>
    </div>
  );
};