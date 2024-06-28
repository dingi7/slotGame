const endpoints = {
    spin: 'http://localhost:8000/spin',
    double: 'http://localhost:8000/double',
};

export interface SpinResponseData {
    win: boolean;
    payout: number;
    reels: {
        reel1: number;
        reel2: number;
        reel3: number;
    };
}

export interface DoubleResponseData {
    result: boolean;
    payout: number;
}

export async function sendSpinRequest(
    betAmount: number
): Promise<SpinResponseData> {
    const requestBody = {
        betAmount: betAmount,
    };

    try {
        const response = await fetch(endpoints.spin, {
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

export async function sendDoubleRequest(
    betAmount: number
): Promise<DoubleResponseData> {
    const requestBody = {
        betAmount: betAmount,
    };

    try {
        const response = await fetch(endpoints.double, {
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
