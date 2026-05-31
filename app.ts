type PredictionResult = {
    high: number;
    middle: number;
    low: number;
};

function updateProgressBars(results: PredictionResult) {
    const { high, middle, low } = results;

    const highEl = document.getElementById("fill-high") as HTMLElement | null;
    const middleEl = document.getElementById("fill-middle") as HTMLElement | null;
    const lowEl = document.getElementById("fill-low") as HTMLElement | null;

    if (highEl) {
        highEl.style.width = `${high}%`;
        highEl.textContent = `${high}%`;
    }

    if (middleEl) {
        middleEl.style.width = `${middle}%`;
        middleEl.textContent = `${middle}%`;
    }

    if (lowEl) {
        lowEl.style.width = `${low}%`;
        lowEl.textContent = `${low}%`;
    }
}

const parser = (id: string): number => {
    const value = (document.getElementById(id) as HTMLInputElement | null)?.value;
    const num = Number(value?.replace(",", "."));

    return isNaN(num) ? 0 : num;
};

async function run_analysis() {
    try {
        const data = await predict();

        if (data) {
            await generate_report(data);
        }
    } catch (error) {
        console.error(error);
    }
}

async function predict(): Promise<PredictionResult> {
    const API_URL = (import.meta as any).env.VITE_ENDPOINT_SERVICE;

    if (!API_URL) {
        throw new Error("API URL is not defined in environment variables");
    }

    const values = [
        parser("net_income"),
        parser("net_cash_flow"),
        parser("roe"),
        parser("roa"),
        parser("ebitda"),
        parser("cumulation"),
        String((document.getElementById("sector") as HTMLInputElement)?.value || "")
    ];

    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [values] })
    });

    if (!res.ok) {
        throw new Error("Failed to load model");
    }

    const results: PredictionResult = await res.json();

    updateProgressBars(results);

    const btn = document.getElementById("btn-generate-report") as HTMLButtonElement | null;
    if (btn) btn.disabled = false;

    return results;
}

async function generate_report(result: PredictionResult) {
    const label = Object.entries(result)
        .sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0];

    if (!label) {
        throw new Error("No label found");
    }

    const INTERPRET_URL =
        (import.meta as any).env.VITE_INTERPRET_ENDPOINT;

    const res = await fetch(INTERPRET_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" ,
        },
        body: JSON.stringify({ label })
    });

    if (!res.ok) {
        throw new Error("Failed to generate report");
    }

    const data = await res.json();

    const output = document.getElementById("llm-output");

    if (output) {
        output.textContent = data.explanation;
    }
}

(window as any).run_analysis = run_analysis;
(window as any).predict = predict;
(window as any).generate_report = generate_report;