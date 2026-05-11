import cron from "node-cron";

export function startCron() {
  cron.schedule("0 * * * *", async () => {
    try {
      await fetch(
        "http://localhost:3000/api/fetch"
      );

      await fetch(
        "http://localhost:3000/api/top"
      );

      await fetch(
        "http://localhost:3000/api/push"
      );

      console.log(
        "✅ Daily pipeline done"
      );
    } catch (err) {
      console.error(err);
    }
  });
}