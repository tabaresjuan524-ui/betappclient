import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const MatchItemSkeleton = () => (
    <li className="bg-white dark:bg-slate-800 p-3 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full rounded-lg min-w-0 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
            <Skeleton className="h-4 w-12 shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-12" />
            </div>
        </div>
        <div className="space-y-2 w-12 sm:w-8 min-w-0">
            <Skeleton className="h-4 w-4 mx-auto" />
            <Skeleton className="h-4 w-4 mx-auto" />
        </div>
        <div className="flex-1 grid grid-cols-3 gap-2 text-sm mt-2 sm:mt-0 min-w-0">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0 min-w-0">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8" />
        </div>
    </li>
);

export const MatchGroupSkeleton = () => (
    <div className="px-4">
        <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-40" />
        </div>
        <ul className="space-y-1">
            <MatchItemSkeleton />
            <MatchItemSkeleton />
            <MatchItemSkeleton />
        </ul>
    </div>
);

export const SidebarSkeleton = () => (
    <div className="px-4 py-4 space-y-4">
        {/* Sport items skeleton */}
        {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="space-y-2">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-6 ml-auto" />
                </div>
            </div>
        ))}
    </div>
);
