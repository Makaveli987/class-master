import { db } from "@/lib/db";

export async function countEnrollmentsByMonth() {
  const currentDate = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

  const result = await db.$queryRaw`
  SELECT
    DATE_FORMAT(createdAt, '%Y-%m') AS month,
    COUNT(*) AS count
  FROM
    Enrollment
  WHERE
    createdAt >= ${sixMonthsAgo.toISOString()}
  GROUP BY
    month
  ORDER BY
    month;
`;

  console.log(result);
  return result;
}
