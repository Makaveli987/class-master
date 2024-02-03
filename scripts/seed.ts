const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    // await database.classroom.create({
    //   data: { name: "Online" },
    // });

    // await database.user.create({
    //   data: {
    //     firstName: "Darko",
    //     lastName: "Vidic",
    //     password: "darko123",
    //     email: "vidic93@gmail.com",
    //     dateOfBirth: "1994-01-31T11:00:00+01:00",
    //     phone: "+381649544934",
    //     schoolName: "DV Languages",
    //     role: RoleType.ADMIN,
    //   },
    // });

    await database.schoolClass.deleteMany({});

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
