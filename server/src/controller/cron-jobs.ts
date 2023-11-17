
import cron from "node-cron"


//! Schedule a task to run every day at midnight (00:00) 
export let job = () => {
    cron.schedule('0 */6 * * *', async () => {

        try {
            let response = await fetch("http://localhost:3000/api/stories", {
                method: "DELETE"
            })

            let result = await response.json()
            console.log(result);
        }
        catch (err: any) {
            console.log(err);
        }
    });
}
