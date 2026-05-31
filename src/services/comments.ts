import { Comment } from "../components/Events/EventDetails";

export async function getEventComments(
    eventId: number,
    pageNumber = 1,
    pageSize = 10,
    baseUrl = 'http://localhost:5066'
): Promise<{ data: Comment[]; totalCount: number; hasNextPage: boolean }> {
    try {
        const params = new URLSearchParams();
        params.append('pageNumber', pageNumber.toString());
        params.append('pageSize', pageSize.toString());

        const response = await fetch(
            `${baseUrl}/api/Baham/Comments/${eventId}?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: خطا در دریافت نظرات`);
        }

        const data = await response.json();
        return {
            data: data.data,
            totalCount: data.totalCount,
            hasNextPage: data.hasNextPage,
        };
    } catch (err) {
        console.error('Failed to fetch comments:', err);
        throw err;
    }
}

export async function submitComment(
    bahamId: number,
    rate: number,
    text: string,
    baseUrl = 'http://localhost:5066'
): Promise<{
    success: boolean;
    // message: string;
    rate: number;
    text: string;
}> {
    try {
        const response = await fetch(`${baseUrl}/api/Baham/Comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ bahamId, rate, text }),
        });

        // const data = await response.json();

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return { success: true, text: text, rate: rate };
        // return {
        //     success: true,
        //     message: data.message || 'نظر شما با موفقیت ثبت شد',
        //     comment: data.comment
        // };
    } catch (err) {
        console.error('Failed to submit comment:', err);
        throw err;
    }
}