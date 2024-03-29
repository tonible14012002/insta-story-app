const modalAnimation = [
  ,
  "data-[state=open]:animate-in",
  "data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0",
  "data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95",
  "data-[state=open]:zoom-in-95",
  "data-[state=closed]:slide-out-to-left-1/2",
  "data-[state=closed]:slide-out-to-top-[48%]",
  "data-[state=open]:slide-in-from-left-1/2",
  "data-[state=open]:slide-in-from-top-[48%]",
];

const accordionContentAnimation = [
  "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
];

const animation = {
  modalAnimation,
  accordionContentAnimation,
};

const overlay = {
  screen: [
    "container !rounded-none",
    "h-screen",
    "!p-0",
    "!focus:outline-none",
  ],
};

export { animation, overlay };
