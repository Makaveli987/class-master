import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Tooltip2Props {
  children: React.ReactNode;
  text: string;
  side?: "top" | "right" | "bottom" | "left" | undefined;
}

export function Tooltip2({ children, text, side = "top" }: Tooltip2Props) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="bg-slate-800 dark:bg-slate-100" side={side}>
          <p className="whitespace-pre-wrap z-50">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
