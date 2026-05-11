import OpenAI from "openai";
import express from 'express';
import type {Request, Response} from 'express'; 
import cors from 'cors';
import process from "node:process";

const app = express();
app.use(cors({
    origin: "*",
}));
app.use(express.json());

const client = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/interpret", async (req: Request, res: Response) => {

    console.log("Connection has been established");

    try {
        const { result } = req.body;

        if (!result) {
            return res.status(400).json({ error: "Missing 'result' in request body" });
        }
   
        //user prompt 
        const prompt =` Interpret the financial risk level:: "${result}".
                        - If "low": focus on strong fundamentals and high capacity to meet obligations.
                        - If "middle": mention adequate protection but potential vulnerability to economic shifts.
                        - If "high": emphasize significant credit risk and limited margin for safety.
                        Provide a concise, professional assessment in 3-4 sentences.`;

        const response = await client.chat.completions.create({

            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a senior credit risk analyst a firm like Moody's or S&P. You write concise financial risk assessments."}, //system prompt
                { role: "user", content: prompt } 
            ],

            temperature: 0.7

        });

        console.log(`Prompt: ${response.usage?.prompt_tokens}`)
        console.log(`Generated: ${response.usage?.completion_tokens}`)
        console.log(`Sum ${response.usage?.total_tokens}`)

        res.status(200).json({
            explanation: response.choices[0].message.content //chat.completion object
        })
        
    } catch (error: any) {
        console.error("OpenAI API Error:", error.message);
        res.status(500).json({  //Internal Server Error 
            error: "Failed to process the request",
            details: error.message 
        });
    }

});

const port = 3001; 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// export default app;