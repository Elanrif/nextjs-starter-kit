'use client';

import { Session } from "@/lib/auth/models/auth.model";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import useSWR from "swr";


const fetcher  = async (url: string):Promise<Session> => {
    const res = await fetch(url, {credentials: "include"});
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Failed to fetch session" }));
        throw crudApiErrorResponse(errorData, "fetchSession");
    }
    return res.json();
}

export const useSession = () => {
    const {data, error, isLoading, mutate} = useSWR<Session>("/api/auth/session", fetcher, {
        revalidateOnFocus: false,
        // shouldRetryOnError: false,
    });

    return {
        session: data,
        isLoading,
        error,
        refresh: mutate, // allows manual refresh of session data
    }
}