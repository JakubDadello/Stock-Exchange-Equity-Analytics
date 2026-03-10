async function predict () {
    const values = [
        Number((document.getElementById("net_income") as HTMLInputElement).value),
        Number((document.getElementById("net_cash_flow") as HTMLInputElement).value),
        Number((document.getElementById("roe") as HTMLInputElement).value),
        Number((document.getElementById("roa") as HTMLInputElement).value),
        Number((document.getElementById("ebitda") as HTMLInputElement).value),
        String((document.getElementById("sector") as HTMLInputElement).value),
        Number((document.getElementById("cumulation") as HTMLInputElement).value)
    ]

        const res = await fetch ("https://<api-id>.execute-api.eu-central-1.amazonaws.com/development/prediction", 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({data: [values]})
        })

        const result = await res.json();
        (document.getElementById("output_data") as HTMLInputElement).textContent  = JSON.stringify(result); 

}