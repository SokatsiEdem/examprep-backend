-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "verificationToken" TEXT;
