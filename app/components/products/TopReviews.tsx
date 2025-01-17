/* This example requires Tailwind CSS v2.0+ */
import { StarIcon } from '@heroicons/react/solid';
import { classNames } from '~/utils/class-names';

interface Review {
    id: number;
    title: string;
    rating: number;
    content: string;
    author: string;
    date: string;
    datetime: string;
}

const reviews: Review[] = [];

export default function TopReviews() {
    return (
        <div className="">
            <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-6xl lg:px-8">
                <h2 className="text-lg font-medium text-gray-900">
                    Recent reviews
                </h2>
                <div className="mt-6 pb-10 border-t border-gray-200 divide-y divide-gray-200 space-y-10">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8"
                        >
                            <div className="lg:col-start-5 lg:col-span-8 xl:col-start-4 xl:col-span-9 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:items-start">
                                <div className="flex items-center xl:col-span-1">
                                    <div className="flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                className={classNames(
                                                    review.rating > rating
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-200',
                                                    'h-5 w-5 flex-shrink-0',
                                                )}
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                    <p className="ml-3 text-sm text-gray-700">
                                        {review.rating}
                                        <span className="sr-only">
                                            {' '}
                                            out of 5 stars
                                        </span>
                                    </p>
                                </div>

                                <div className="mt-4 lg:mt-6 xl:mt-0 xl:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {review.title}
                                    </h3>

                                    <div
                                        className="mt-3 space-y-6 text-sm text-gray-500"
                                        dangerouslySetInnerHTML={{
                                            __html: review.content,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex items-center text-sm lg:mt-0 lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:flex-col lg:items-start xl:col-span-3">
                                <p className="font-medium text-gray-900">
                                    {review.author}
                                </p>
                                <time
                                    dateTime={review.datetime}
                                    className="ml-4 border-l border-gray-200 pl-4 text-gray-500 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
                                >
                                    {review.date}
                                </time>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
