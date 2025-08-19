-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlassDoorRefrigeration" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "temperatureRange" TEXT NOT NULL,
    "capacityLitres" TEXT NOT NULL,
    "glassType" TEXT NOT NULL,
    "lighting" TEXT NOT NULL,
    "shelves" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "powerSupply" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlassDoorRefrigeration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IceCreamFreezers" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "temperatureRange" TEXT NOT NULL,
    "lidType" TEXT NOT NULL,
    "defrostType" TEXT NOT NULL,
    "interiorLighting" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IceCreamFreezers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrinksFridgesAndBottleCoolers" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "bottleCapacity" TEXT NOT NULL,
    "temperatureControl" TEXT NOT NULL,
    "doorType" TEXT NOT NULL,
    "numberOfShelves" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "powerSupply" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DrinksFridgesAndBottleCoolers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServeOverCounters" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "displayLength" TEXT NOT NULL,
    "coolingType" TEXT NOT NULL,
    "storageCapacity" TEXT NOT NULL,
    "lighting" TEXT NOT NULL,
    "glassShape" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServeOverCounters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultideckDisplays" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "numberOfShelves" TEXT NOT NULL,
    "internalLighting" TEXT NOT NULL,
    "coolingType" TEXT NOT NULL,
    "doorStyle" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MultideckDisplays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UprightAndUndercounterFridges" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "numberOfDoors" TEXT NOT NULL,
    "coolingRange" TEXT NOT NULL,
    "shelves" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "lockFeature" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UprightAndUndercounterFridges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreezersChestAndUpright" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "freezerType" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "temperatureControl" TEXT NOT NULL,
    "numberOfCompartments" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreezersChestAndUpright_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
