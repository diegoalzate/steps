import { type FC, Fragment, type MouseEventHandler } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

type MenuItem = {
    title: string;
    link?: string;
    icon: FC<React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>>;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

type Props = {
    options: MenuItem[];
    menuTitle: string;
}

const DropdownMenu: FC<Props> = ({ options, menuTitle }) => (
    <Menu as="div" className="relative inline-block text-left">
        <div>
            <Menu.Button className="inline-flex justify-center rounded-md hover:text-amber-600 bg-transparent text-black  px-4 py-2 text-sm font-medium">
                {menuTitle}
                <ChevronDownIcon
                    className="ml-2 -mr-1 h-5 w-5 text-black hover:text-amber-600"
                    aria-hidden="true"
                />
            </Menu.Button>
        </div>
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                    {options.map(({ title, link, icon: Icon, onClick }, idx) => (
                        <Menu.Item key={idx}>
                            {({ active }) => (
                                link ? (
                                    <Link className={`${active ? 'bg-amber-600 text-white' : 'text-amber-600'} group flex rounded-md items-center w-full px-2 py-2 text-sm`} href={link}>
                                        <Icon className="mr-2 h-5 w-5" />
                                        {title}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={onClick}
                                        className={`${active ? 'bg-amber-600 text-white' : 'text-amber-600'
                                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                    >
                                        <Icon className="mr-2 h-5 w-5" />
                                        {title}
                                    </button>
                                )
                            )}
                        </Menu.Item>
                    ))}
                </div>
            </Menu.Items>
        </Transition>
    </Menu>
)

export default DropdownMenu

