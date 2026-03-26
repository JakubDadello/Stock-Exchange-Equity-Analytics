function updateProgressBars (results: any) {
    const high = results.high;
    const middle = results.middle;
    const low = results.low;

    (document.getElementById("fill-high") as HTMLElement)!.style.width = high + "%";
    (document.getElementById("fill-high") as HTMLElement)!.textContent = high + "%";

    (document.getElementById("fill-middle") as HTMLElement)!.style.width = middle + "%";
    (document.getElementById("fill-middle") as HTMLElement)!.textContent = middle + "%";

    (document.getElementById("fill-low") as HTMLElement)!.style.width = low + "%";
    (document.getElementById("fill-low") as HTMLElement)!.textContent = low + "%";
}

async function predict () {
    const values = [
        Number((document.getElementById("net_income") as HTMLInputElement).value.replace(',', '.')),
        Number((document.getElementById("net_cash_flow") as HTMLInputElement).value.replace(',', '.')),
        Number((document.getElementById("roe") as HTMLInputElement).value.replace(',', '.')),
        Number((document.getElementById("roa") as HTMLInputElement).value.replace(',', '.')),
        Number((document.getElementById("ebitda") as HTMLInputElement).value.replace(',', '.')),
        Number((document.getElementById("cumulation") as HTMLInputElement).value.replace(',', '.')),
        String((document.getElementById("sector") as HTMLInputElement).value),
    ]

    const API_URL = (import.meta as any).env.VITE_ENDPOINT_SERVICE;

    try {
        if(!API_URL) {
            throw new Error("API URL is not defined in environment variables");
        }

        const res = await fetch (API_URL as string, 
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({data: [values]})
        })

        if(!res.ok) {
            throw new Error("Failed to load model")
        }

        const results = await res.json();

        updateProgressBars(results); 

        } catch (error) {
           throw new Error (error)
        }

    
}

(window as any).predict = predict; 