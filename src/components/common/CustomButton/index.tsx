// MyButton.tsx
import { extendVariants, Button } from "@nextui-org/react"

export const CustomButton = extendVariants(Button, {
  variants: {
    color: {
      olive: "text-[#000] bg-[#84cc16]",
      orange: "bg-[#ff8c00] text-[#fff]",
      violet: "bg-[#8b5cf6] text-[#fff]",
      green: "text-white bg-green-400",
      white: "text-black bg-white", // Thêm màu trắng
    },
    isDisabled: {
      true: "opacity-50 cursor-not-allowed",
    },
    isGhost: {
      true: "text-green-400 border-2 border-green-400 bg-white hover:text-white hover:bg-green-400",
    },
    size: {
      xs: "px-2 min-w-12 h-6 text-tiny gap-1 rounded-small",
      md: "px-4 min-w-20 h-10 text-small gap-2 rounded-small font-semibold",
      xl: "px-8 min-w-28 h-14 text-large gap-4 rounded-medium font-semibold",
    },
  },
  defaultVariants: {
    color: "green",
    size: "md",
  },
});
