-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "center_id" INTEGER;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "exam_centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
