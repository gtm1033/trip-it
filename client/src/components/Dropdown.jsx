import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";


const Dropdown = ({ head, options }) => {

    return (
        <>
            <DropdownMenu >
                <DropdownMenuTrigger className="flex text-white items-center  gap-4 px-2 py-[0.5px] text-xl">{head}   </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="border-none outline-none">{head} </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {
                        options.map((option, index) => {
                            return (

                                <DropdownMenuItem key={index}>
                                    <Link href={option.link}>
                                        {option.name}
                                    </Link>
                                </DropdownMenuItem>

                            );
                        })
                    }
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    )
}

export default Dropdown