let lastResults = null;
function updateProgressBars(results) {
    const high = results.high;
    const middle = results.middle;
    const low = results.low;
    document.getElementById("fill-high").style.width = high + "%";
    document.getElementById("fill-high").textContent = high + "%";
    document.getElementById("fill-middle").style.width = middle + "%";
    document.getElementById("fill-middle").textContent = middle + "%";
    document.getElementById("fill-low").style.width = low + "%";
    document.getElementById("fill-low").textContent = low + "%";
}
async function predict() {
    const values = [
        Number(document.getElementById("net_income").value.replace(',', '.')),
        Number(document.getElementById("net_cash_flow").value.replace(',', '.')),
        Number(document.getElementById("roe").value.replace(',', '.')),
        Number(document.getElementById("roa").value.replace(',', '.')),
        Number(document.getElementById("ebitda").value.replace(',', '.')),
        Number(document.getElementById("cumulation").value.replace(',', '.')),
        String(document.getElementById("sector").value),
    ];
    const API_URL = import.meta.env.VITE_ENDPOINT_SERVICE;
    try {
        if (!API_URL) {
            throw new Error("API URL is not defined in environment variables");
        }
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: [values] })
        });
        if (!res.ok) {
            throw new Error("Failed to load model");
        }
        const results = await res.json();
        lastResults = results;
        updateProgressBars(results);
    }
    catch (error) {
        throw new Error(error);
    }
}
async function generate_report() {
    if (!lastResults) {
        throw new Error("No prediction results available. Run prediction first.");
    }
    if (!lastResults.label) {
        throw new Error("Prediction results do not contain a label.");
    }
    const interpretRes = await fetch("http://localhost:3000/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: lastResults.label })
    });
    if (!interpretRes.ok) {
        throw new Error("Failed to generate the report");
    }
    const interpretData = await interpretRes.json();
    const LLM_output = document.getElementById("llm-output");
    if (LLM_output) {
        LLM_output.textContent = interpretData.explanation;
    }
    else {
        console.error("Element #llm-output not found");
    }
}
window.predict = predict;
window.generate_report = generate_report;
export {};
