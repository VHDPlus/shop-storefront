import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    ShouldReloadFunction,
    useLoaderData,
} from '@remix-run/react';
import styles from './styles/app.css';
import customStyles from './styles/custom.css';
import { Header } from './components/header/Header';
import {
    DataFunctionArgs,
    MetaFunction,
    json,
} from '@remix-run/server-runtime';
import { getCollections } from '~/providers/collections/collections';
import { activeChannel } from '~/providers/channel/channel';
import { APP_META_DESCRIPTION, APP_META_TITLE } from '~/constants';
import { useEffect, useState } from 'react';
import { CartTray } from '~/components/cart/CartTray';
import { getActiveCustomer } from '~/providers/customer/customer';
import Footer from '~/components/footer/Footer';
import { useActiveOrder } from '~/utils/use-active-order';
import { sessionStorage } from './sessions';
import { setApiUrl } from '~/graphqlWrapper';
import { getAvailableCountries } from './providers/checkout/checkout';
import CookieConsent from 'react-cookie-consent';
import { buildOptions } from '@graphql-codegen/cli';

export const meta: MetaFunction = () => {
    return { title: APP_META_TITLE, description: APP_META_DESCRIPTION };
};

export function links() {
    return [
        { rel: 'stylesheet', href: styles },
        { rel: 'stylesheet', href: customStyles },
    ];
}

const devMode =
    typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

// The root data does not change once loaded.
export const unstable_shouldReload: ShouldReloadFunction = ({
    url,
    prevUrl,
    params,
    submission,
}) => {
    if (prevUrl.pathname === '/sign-in') {
        // just logged in
        return true;
    }
    if (prevUrl.pathname === '/account' && url.pathname === '/') {
        // just logged out
        return true;
    }
    if (submission?.action === '/checkout/payment') {
        // submitted payment for order
        return true;
    }
    return false;
};

export type RootLoaderData = {
    activeCustomer: Awaited<ReturnType<typeof getActiveCustomer>>;
    activeChannel: Awaited<ReturnType<typeof activeChannel>>;
    collections: Awaited<ReturnType<typeof getCollections>>;
    countries: Awaited<ReturnType<typeof getAvailableCountries>>;
    sessionChannelChanged: boolean;
};

export async function loader({ request, params, context }: DataFunctionArgs) {
    if (typeof context?.VENDURE_API_URL === 'string') {
        // Set the API URL for Cloudflare Pages
        setApiUrl(context.VENDURE_API_URL);
    }
    const collections = await getCollections(request);
    const topLevelCollections = collections.filter(
        (collection) => collection.parent?.name === '__root_collection__',
    );
    const activeCustomer = await getActiveCustomer({ request });

    const session = await sessionStorage.getSession(
        request.headers.get('Cookie'),
    );
    const sessionChannel = session.get('channel');

    const availableCountries = await getAvailableCountries({ request });

    const loaderData: RootLoaderData = {
        activeCustomer,
        sessionChannelChanged: sessionChannel != null,
        activeChannel: await activeChannel({ request }),
        collections: topLevelCollections,
        countries: availableCountries,
    };

    return json(loaderData, { headers: activeCustomer._headers });
}

export default function App() {
    const [open, setOpen] = useState(false);
    const loaderData = useLoaderData<RootLoaderData>();
    const [activeChannelToken, setActiveChannelToken] = useState(
        loaderData.activeChannel.token,
    );

    const { collections } = loaderData;
    const {
        activeOrderFetcher,
        activeOrder,
        adjustOrderLine,
        removeItem,
        refresh,
        switchChannel,
    } = useActiveOrder();

    useEffect(() => {
        // When the loader has run, this implies we should refresh the contents
        // of the activeOrder as the user may have signed in or out.
        refresh();
    }, [loaderData]);

    //Set used channel automatically
    useEffect(() => {
        if (!loaderData.sessionChannelChanged) {
            fetch('https://ipapi.co/json/')
                .then((res) => res.json<{ country: string; in_eu: boolean }>())
                .then((response) => {
                    if (response.in_eu) {
                        switchChannel('eu');
                    }
                })
                .catch((data) => {
                    console.error('Request failed:', data);
                });
        }
    }, []);

    return (
        <html lang="en" id="app">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" type="image/png"></link>
                <Meta />
                <Links />
            </head>
            <body>
                <Header
                    switchChannel={switchChannel}
                    activeChannelToken={activeChannelToken}
                    onCartIconClick={() => setOpen(!open)}
                    cartQuantity={activeOrder?.totalQuantity ?? 0}
                />
                <main className="">
                    <Outlet
                        context={{
                            activeOrderFetcher,
                            activeOrder,
                            adjustOrderLine,
                            removeItem,
                            switchChannel,
                            setActiveChannelToken,
                        }}
                    />
                </main>
                <CartTray
                    open={open}
                    onClose={setOpen}
                    activeOrder={activeOrder}
                    adjustOrderLine={adjustOrderLine}
                    removeItem={removeItem}
                />
                <ScrollRestoration />
                <Scripts />
                {devMode && <LiveReload />}
                <Footer collections={collections}></Footer>

                {false ? (
                <CookieConsent
                    disableStyles={true}
                    location="bottom"
                    buttonClasses="whitespace-nowrap bg-primary-500 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-500"
                    containerClasses="bg-zinc-800 fixed flex flex-row justify-between w-full items-center p-2 drop-shadow"
                    contentClasses="text-capitalize text-white"
                >
                    This website uses cookies to enhance the user experience.
                </CookieConsent>
                ) : ("")}
            </body>
        </html>
    );
}
