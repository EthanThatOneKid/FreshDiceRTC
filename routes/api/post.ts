import { HandlerContext } from "$fresh/server.ts";

const DEBUG = true

export const  handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const dataObject = await _req.json();
        if (DEBUG) console.info('Client Posted:', dataObject)
        const gBC = new BroadcastChannel("game");
        gBC.postMessage(dataObject);
        gBC.close();
        return new Response("",
        {
            status: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
        }
    );
  };