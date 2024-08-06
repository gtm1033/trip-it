'use client'
import Link from "next/link";
import Dropdown from "./Dropdown";
import { usePathname } from "next/navigation";

const Links = [
    {
        name: 'Join Us',
        path: '/join'
    },
    {
        name: 'Members Login',
        path: '/member'
    },
    {
        name: 'How We Work?',
        path: '/how-we-work'
    },
    {
        name: 'Guests Login',
        path: '/guests-login'
    },
];

const Lang_options = [
    { label: 'English', href: '/' },
    { label: 'Hindi', href: '/' },
    { label: 'French', href: '/' },
    { label: 'Punjabi', href: '/' },
];
const Curr_options = [
    { label: 'US Dollar', href: '/' },
    { label: 'INR', href: '/' },
    { label: 'Yen', href: '/' },
    { label: 'Euro', href: '/' },
];

export default function PCNav() {


    const pathname = usePathname();



    return (
        <>

            <div className="flex items-center gap-5">
                {Links.map((link, index) => {
                    return (
                        <Link
                            href={link.path}
                            className={`${link.path === pathname && "text-blue-500  border-b-2 border-blue-500 "} flex text-white text-sm drop-shadow-md justify-center hover:text-blue-500  transition-all`}
                            key={index}
                        >
                            {link.name}
                        </Link>
                    );
                })}


                <Dropdown options={Lang_options} head="Language" />
                <Dropdown options={Curr_options} head="Currency" />
            </div>

        </>
    );
}