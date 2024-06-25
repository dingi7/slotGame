const url = 'http://localhost:8000/spin';

export interface ResponseData {
    payout: number;
    reels: {
        reel1: number;
        reel2: number;
        reel3: number;
    };
}

export async function sendSpinRequest(betAmount: number): Promise<ResponseData> {
    const requestBody = {
        betAmount: betAmount,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}
