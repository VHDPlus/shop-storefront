import { Link, useLoaderData } from '@remix-run/react';
import { ExternalLinkIcon, ShoppingBagIcon } from '@heroicons/react/outline';
import { SearchBar } from '~/components/header/SearchBar';
import { useRootLoader } from '~/utils/use-root-loader';
import { UserIcon } from '@heroicons/react/solid';
import { useScrollingUp } from '~/utils/use-scrolling-up';
import { classNames } from '~/utils/class-names';
import { ChannelSwitcher } from '../ChannelSwitch';
import { Channel } from '~/generated/graphql';

export function Header({
    onCartIconClick,
    cartQuantity,
    switchChannel,
    activeChannelToken,
}: {
    onCartIconClick: () => void;
    cartQuantity: number;
    switchChannel: (channel: string) => void;
    activeChannelToken: string;
}) {
    const data = useRootLoader();
    const isSignedIn = !!data.activeCustomer.activeCustomer?.id;
    const isScrollingUp = useScrollingUp();

    return (
        <header
            className={classNames(
                isScrollingUp ? 'sticky top-0 z-10 animate-dropIn' : '',
                'bg-gradient-to-r from-zinc-700 to-gray-900 shadow-lg transform shadow-xl',
            )}
        >
            <div className="bg-zinc-100 text-gray-600 shadow-inner text-center text-sm py-2 px-2 xl:px-0">
                <div className="max-w-7xl mx-2 md:mx-auto flex items-center justify-between">
                    <div className="hidden sm:block">
                        <p>
                            <span>
                                Yes, we ship{' '}
                                <span className="font-bold">WORLDWIDE!</span>{' '}
                            </span>
                            <a href="/taxes-shipping" className="underline">
                                Taxes and Shipping
                            </a>{' '}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4 justify-between grow sm:grow-0">
                        <ChannelSwitcher
                            switchChannel={switchChannel}
                            activeChannelToken={activeChannelToken}
                        />
                        <Link
                            to={isSignedIn ? '/account' : '/sign-in'}
                            className="flex space-x-1"
                        >
                            <UserIcon className="w-4"></UserIcon>
                            <span>{isSignedIn ? 'My Account' : 'Sign In'}</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto p-4 flex items-center space-x-4">
                <h1 className="text-white w-10">
                    <Link to="/">
                        <img
                            src="/vhdp.svg"
                            width={40}
                            height={31}
                            alt="VHDPlus logo"
                        />
                    </Link>
                </h1>
                <h1 className="text-white font-bold text-lg">VHDPlus Shop</h1>
                <div className="flex space-x-4 hidden sm:block">
                    <Link
                        className="text-sm md:text-base text-gray-200 hover:text-white"
                        to={'/collections/hardware'}
                        prefetch="intent"
                    >
                        Hardware
                    </Link>
                    <Link
                        className="text-sm md:text-base text-gray-200 hover:text-white"
                        to={'/products/vhdplus-ide-pro'}
                        prefetch="intent"
                    >
                        VHDPlus IDE
                    </Link>
                    <a
                        className="text-sm md:text-base text-gray-200 hover:text-white"
                        href={'https://vhdplus.com'}
                        target="blank"
                    >
                        <p className="inline-block">Docs</p>
                        <ExternalLinkIcon className="h-4 inline-block ml-1 mb-1" />
                    </a>
                </div>
                <div className="flex-1 md:pr-3 md:pl-3">
                    <SearchBar></SearchBar>
                </div>
                <div className="">
                    <button
                        className="relative w-9 h-9 bg-white bg-opacity-20 rounded text-white p-1"
                        onClick={onCartIconClick}
                        aria-label="Open cart tray"
                    >
                        <ShoppingBagIcon></ShoppingBagIcon>
                        {cartQuantity ? (
                            <div className="absolute rounded-full -top-2 -right-2 bg-primary-600 w-6 h-6">
                                {cartQuantity}
                            </div>
                        ) : (
                            ''
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
