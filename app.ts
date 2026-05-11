type PredictionResult = {
    high: number;
    middle: number; 
    low: number;
}

function updateProgressBars (results: PredictionResult) {

    const high = results.high; 
    const middle = results.middle;
    const low = results.low;

    const highEl = document.getElementById('fill-high') as HTMLInputElement || null;
    const middleEl = document.getElementById('fill-middle') as HTMLInputElement || null;
    const lowEl = document.getElementById('fill-low') as HTMLInputElement || null;

    if(highEl) {
        highEl.style.width = `${high}%`;
        highEl.textContent = `${middle}%`;
    }

    if(middle) {
        middleEl.style.width = `${middle}%`;
        middleEl.textContent = `${middle}%`;
    }

    if(low) {
        lowEl.style.width = `${low}%`;
        lowEl.textContent = `${low}%`;
    }
}

const parser = (id: string) => {
    const value = (document.getElementById('id') as HTMLInputElement)?.value;
    const num = Number(value?.replace(",", "."));

    return isNaN(num) ? 0 : num; 
}

async function run_analysis() {

    try {
        
        const data = await predict();

        if(data) {
            await generate_report(data);
        }

    } catch (error) {
        console.log(error)
    }
};


async function predict (): Promise<PredictionResult> {

    const API_URL = (import.meta as any).env.VITE_ENDPOINT_SERVICE;

    if(!API_URL) {
        throw new Error("API URL is not defined in environment variables");
    }

    const values = [ 
        parser("net_income"), 
        parser("net_cash_flow"), 
        parser("roe"), parser("roa"), 
        parser("ebitda"), 
        parser("cumulation"), 
        String((document.getElementById("sector") as HTMLInputElement)?.value || ""), ];

        const res = await fetch (API_URL as string, { 
            method: "POST", 
            headers: {"Content-Type": "application/json"}, 
            body: JSON.stringify({data: [values]}) }); 
        
        if(!res.ok) { 
            throw new Error("Failed to load model") 
        } 
        
        const results = await res.json(); 
        
        updateProgressBars(results); 
        
        const btn = document.getElementById("btn-generate-report") as HTMLButtonElement | null; 
        
        if (btn) btn.disabled = false; return results;
}

async function generate_report (result: PredictionResult) { 

    if (!result) { 
        throw new Error("No prediction results available. Run prediction first."); } 
    
    const label = Object.entries(result) .sort((a, b) => 
        Number(b[1]) - Number(a[1]))[0]?.[0]; 
    
    if (!label){ 
        throw new Error("Prediction results do not contain a label."); 
    } 
    
    const INTERPRET_URL = (import.meta as any).env.VITE_INTERPRET_ENDPOINT || 
        "http://localhost:3000/api/interpret"; 
    
    const interpretRes = await fetch(INTERPRET_URL, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ label }) }); 
        
    if (!interpretRes.ok) { 
        throw new Error("Failed to generate the report"); } 
        
    const interpretData = await interpretRes.json(); 
    
    const output = document.getElementById("llm-output"); 
    
    if (output) { 
        output.textContent = interpretData.explanation; 
    } 
    else { 
        console.error("Element #llm-output not found"); 
    } 
    
} 
        
        
(window as any).run_analysis = run_analysis; 
(window as any).predict = predict; 
(window as any).generate_report = generate_report;

