/**
 * v0 by Vercel.
 * @see https://v0.dev/t/7vWDwqoza70
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps } from "react"
import { toast } from "sonner"

interface CopyToClipboardProps {
    text: string
}

export default function CopyToClipboard({ text }: CopyToClipboardProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            navigator.clipboard.writeText(text)
                            toast.success("Copied to clipboard")
                        }}
                    >
                        <CopyIcon className="h-4 w-4" />
                        <span className="sr-only">Copy to clipboard</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Click to copy</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

function CopyIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
    )
}