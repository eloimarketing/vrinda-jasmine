/*
  Warnings:

  - You are about to drop the column `coolingType` on the `MultideckDisplays` table. All the data in the column will be lost.
  - You are about to drop the column `doorStyle` on the `MultideckDisplays` table. All the data in the column will be lost.
  - You are about to drop the column `internalLighting` on the `MultideckDisplays` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfShelves` on the `MultideckDisplays` table. All the data in the column will be lost.
  - You are about to drop the column `coolingType` on the `ServeOverCounters` table. All the data in the column will be lost.
  - You are about to drop the column `displayLength` on the `ServeOverCounters` table. All the data in the column will be lost.
  - You are about to drop the column `glassShape` on the `ServeOverCounters` table. All the data in the column will be lost.
  - You are about to drop the column `storageCapacity` on the `ServeOverCounters` table. All the data in the column will be lost.
  - You are about to drop the `DrinksFridgesAndBottleCoolers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UprightAndUndercounterFridges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inquiries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wishlists` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `capacity` to the `MultideckDisplays` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deckCount` to the `MultideckDisplays` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayType` to the `MultideckDisplays` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lighting` to the `MultideckDisplays` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperatureRange` to the `MultideckDisplays` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `ServeOverCounters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `counterType` to the `ServeOverCounters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dimensions` to the `ServeOverCounters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayArea` to the `ServeOverCounters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperatureRange` to the `ServeOverCounters` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('REFRIGERATION', 'COOKING_APPLIANCES', 'APPLIANCES', 'KITCHENWARE_EQUIPMENT', 'CONSUMABLES', 'KITCHEN_FURNITURE', 'CLEANING', 'GRADED_EQUIPMENT', 'BARWARE', 'TABLEWARE', 'KITCHEN_ACCESSORIES', 'CATERING_SUPPLIES');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_itemId_fkey";

-- DropForeignKey
ALTER TABLE "inquiries" DROP CONSTRAINT "inquiries_itemId_fkey";

-- DropForeignKey
ALTER TABLE "inquiries" DROP CONSTRAINT "inquiries_userId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "wishlists" DROP CONSTRAINT "wishlists_itemId_fkey";

-- DropForeignKey
ALTER TABLE "wishlists" DROP CONSTRAINT "wishlists_userId_fkey";

-- AlterTable
ALTER TABLE "FreezersChestAndUpright" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "GlassDoorRefrigeration" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "IceCreamFreezers" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MultideckDisplays" DROP COLUMN "coolingType",
DROP COLUMN "doorStyle",
DROP COLUMN "internalLighting",
DROP COLUMN "numberOfShelves",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "capacity" TEXT NOT NULL,
ADD COLUMN     "deckCount" TEXT NOT NULL,
ADD COLUMN     "displayType" TEXT NOT NULL,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lighting" TEXT NOT NULL,
ADD COLUMN     "temperatureRange" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServeOverCounters" DROP COLUMN "coolingType",
DROP COLUMN "displayLength",
DROP COLUMN "glassShape",
DROP COLUMN "storageCapacity",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "capacity" TEXT NOT NULL,
ADD COLUMN     "counterType" TEXT NOT NULL,
ADD COLUMN     "dimensions" TEXT NOT NULL,
ADD COLUMN     "displayArea" TEXT NOT NULL,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "temperatureRange" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';

-- DropTable
DROP TABLE "DrinksFridgesAndBottleCoolers";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "UprightAndUndercounterFridges";

-- DropTable
DROP TABLE "inquiries";

-- DropTable
DROP TABLE "items";

-- DropTable
DROP TABLE "wishlists";

-- DropEnum
DROP TYPE "ItemCategory";

-- DropEnum
DROP TYPE "ItemStatus";

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" "ProductCategory" NOT NULL,
    "subcategory" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "productImage" TEXT,
    "productVideo" TEXT,
    "mediaType" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attributes" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "attributeName" TEXT NOT NULL,
    "attributeValue" TEXT NOT NULL,
    "attributeType" TEXT NOT NULL,

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrinksFridgesBottleCoolers" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "temperatureRange" TEXT NOT NULL,
    "doorType" TEXT NOT NULL,
    "shelving" TEXT NOT NULL,
    "lighting" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "DrinksFridgesBottleCoolers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UprightUndercounterFridges" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "temperatureRange" TEXT NOT NULL,
    "fridgeType" TEXT NOT NULL,
    "shelving" TEXT NOT NULL,
    "lighting" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "UprightUndercounterFridges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RangeCookersInductionCookersHobs" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "burnerCount" TEXT NOT NULL,
    "powerOutput" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "controlType" TEXT NOT NULL,
    "safetyFeatures" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "RangeCookersInductionCookersHobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ovens" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "ovenType" TEXT NOT NULL,
    "temperatureRange" TEXT NOT NULL,
    "cookingModes" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "Ovens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GnPansAccessories" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "panSize" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "depth" TEXT NOT NULL,
    "handles" TEXT NOT NULL,
    "lids" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "GnPansAccessories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cookware" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "handles" TEXT NOT NULL,
    "lids" TEXT NOT NULL,
    "inductionCompatible" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "Cookware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeverageMachines" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "machineType" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "temperatureControl" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "BeverageMachines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlendersMixers" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "speedSettings" TEXT NOT NULL,
    "attachments" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "BlendersMixers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlushMachines" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "temperatureRange" TEXT NOT NULL,
    "tankCount" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "SlushMachines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllAppliances" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "applianceType" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "AllAppliances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralEquipment" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "equipmentType" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "GeneralEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralConsumables" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "consumableType" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "expiryDate" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "usage" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "GeneralConsumables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllFurniture" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "furnitureType" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "assembly" TEXT NOT NULL,
    "finish" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "AllFurniture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DishwashersGlasswashers" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "cycleTime" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "waterConsumption" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "DishwashersGlasswashers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HygieneAccessories" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "accessoryType" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "installation" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "HygieneAccessories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaundryMachines" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "machineType" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "waterConsumption" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "LaundryMachines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllGradedProducts" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "originalPrice" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "AllGradedProducts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_productId_attributeName_key" ON "product_attributes"("productId", "attributeName");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlassDoorRefrigeration" ADD CONSTRAINT "GlassDoorRefrigeration_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IceCreamFreezers" ADD CONSTRAINT "IceCreamFreezers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrinksFridgesBottleCoolers" ADD CONSTRAINT "DrinksFridgesBottleCoolers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServeOverCounters" ADD CONSTRAINT "ServeOverCounters_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultideckDisplays" ADD CONSTRAINT "MultideckDisplays_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UprightUndercounterFridges" ADD CONSTRAINT "UprightUndercounterFridges_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreezersChestAndUpright" ADD CONSTRAINT "FreezersChestAndUpright_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RangeCookersInductionCookersHobs" ADD CONSTRAINT "RangeCookersInductionCookersHobs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ovens" ADD CONSTRAINT "Ovens_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GnPansAccessories" ADD CONSTRAINT "GnPansAccessories_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cookware" ADD CONSTRAINT "Cookware_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeverageMachines" ADD CONSTRAINT "BeverageMachines_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlendersMixers" ADD CONSTRAINT "BlendersMixers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlushMachines" ADD CONSTRAINT "SlushMachines_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllAppliances" ADD CONSTRAINT "AllAppliances_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralEquipment" ADD CONSTRAINT "GeneralEquipment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralConsumables" ADD CONSTRAINT "GeneralConsumables_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllFurniture" ADD CONSTRAINT "AllFurniture_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishwashersGlasswashers" ADD CONSTRAINT "DishwashersGlasswashers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HygieneAccessories" ADD CONSTRAINT "HygieneAccessories_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaundryMachines" ADD CONSTRAINT "LaundryMachines_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllGradedProducts" ADD CONSTRAINT "AllGradedProducts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
