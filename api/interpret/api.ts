import OpenAI from "openai";
import express, {Request, Response} from 'express'
import cors from 'cors'
import process from "node:process";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
});

app.post("/api/interpret", async (req: Request, res: Response) => {

    try {
        const { result } = req.body;

        if (!result) {
            return res.status(400).json({ error: "Missing 'result' in request body" });
        }
   
        const prompt =` You receive a risk level: "${result}".
                        Explain it to the user in a friendly, simple way.
                        - low = low risk
                        - middle = medium risk
                        - high = high risk `; 


        const response = await client.chat.completions.create({

            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful assistant." }, //system prompt
                { role: "user", content: prompt } //user prompt 
            ],

            temperature: 0.7

        });

         res.status(200).json({
            explanation: response.choices[0].message.content
        })
    } catch (error: any) {
        console.error("OpenAI API Error:", error.message);
        res.status(500).json({  //Internal Server Error 
            error: "Failed to process the request",
            details: error.message 
        });
    }

});

const port = 3000; 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// export default app;