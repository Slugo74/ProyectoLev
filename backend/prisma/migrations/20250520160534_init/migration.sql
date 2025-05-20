-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "isDeveloper" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Area_name_key" ON "Area"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_dni_key" ON "Employee"("dni");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
